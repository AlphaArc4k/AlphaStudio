use rig::{completion::Prompt, providers::openai};
use std::io::{self, Read};
use std::io::Write;
use anyhow::Result;
use serde_json::Value;
use serde_json::json;

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct Llm {
    provider: String,
    model: String,
    temperature: Option<f32>,
    apiKey: String,
    framework: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct Actions {
    twitter: Option<Twitter>,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct Data {
    enabledViews: Vec<String>,
    userQuery: String,
    timeRange: TimeRange,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct Info {
    name: String,
    description: String,
    version: Option<String>,
    isPublic: Option<bool>,
    profileImage: Option<String>,
    character: String,
    task: String,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct Twitter {
    enabled: Option<bool>,
    apiKey: String,
    apiSecret: String,
    accessToken: Option<String>,
    accessSecret: Option<String>,
    username: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct Sliding {
    startBacktest: Option<String>,
    minutes: u32,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct TimeRange {
    sliding: Option<Sliding>,
    fixed: Option<serde_json::Value>,
}

#[derive(Debug, serde::Deserialize)]
#[allow(dead_code, non_snake_case)]
struct AgentConfig {
    id: Option<String>,
    configVersion: String,
    isDeployed: Option<bool>,
    info: Info,
    data: Data,
    llm: Llm,
    actions: Option<Actions>,
    knowledge: serde_json::Value,
    tools: serde_json::Value,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct Log {
    log_type: String,
    message: String,
    data: String,
}

fn log_remote_data(log_type: String, msg: &str, data: Option<String>) {
    let log = Log {
        log_type,
        message: msg.to_string(),
        data: data.unwrap_or("".to_string()),
    };

    let log_json = serde_json::to_string(&log).unwrap();
    println!("{}:log:\n", log_json);
    io::stdout().flush().unwrap(); // Flush stdout to avoid buffering
}

fn log_remote(log_type: String, msg: &str) {
    log_remote_data(log_type, msg, None);
}

async fn query_data(user_query: &str, time_interval: &Value) -> Result<serde_json::Value> {
    let client = reqwest::Client::new();
    
    let res = client
        // FIXME get host and port as part of the config
        .post("http://127.0.0.1:3000/api/v1/data/query")
        .json(&json!({
            "query": user_query,
            "timeInterval": time_interval,
        }))
        .send()
        .await
        .expect("Failed to send request");
    let body = res.text().await.expect("Failed to read response body");
    let data: serde_json::Value = serde_json::from_str(&body).expect("Failed to parse JSON");
    Ok(data)
}

fn build_data_prompt(config: &AgentConfig, injected_data: &Value) -> String {
    let json_prompt = format!(
        "# Data to analyze:\n## Time Frame:\nStart_Date: {}\n## Data:",
        config
            .data
            .timeRange
            .sliding
            .as_ref()
            .and_then(|s| s.startBacktest.as_ref())
            .unwrap_or(&"Unknown Start Date".to_string())
    );

    if injected_data.is_null() {
        log_remote("INFO".to_string(), "data is null");
        return format!("{}\nNo data available", json_prompt);
    }
    else if injected_data.is_object() && injected_data.as_object().unwrap_or(&serde_json::Map::new()).is_empty() {
        log_remote("INFO".to_string(), "data is empty object");
        return format!("{}\nNo data available", json_prompt);
    }
    else if injected_data.is_array() && injected_data.as_array().unwrap_or(&vec![]).is_empty() {
        log_remote("INFO".to_string(), "data is empty arry");
        return format!("{}\nNo data available", json_prompt);
    }

    format!(
        "{}\n```json\n{}\n```",
        json_prompt,
        serde_json::to_string_pretty(injected_data).unwrap_or("Invalid Data".to_string())
    )
}

#[tokio::main]
async fn main() {

    // Read JSON input from stdin
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).expect("Failed to read input");
    
    // Parse the JSON
    let config: AgentConfig = serde_json::from_str(&input).expect("Invalid JSON");

    // Create OpenAI client and model
    log_remote("INFO".to_string(), "Initializing agent...");
    let api_key = config.llm.apiKey.clone();
    let openai_client = openai::Client::new(&api_key);
    let gpt4 = openai_client.agent("gpt-4").build();
    log_remote("SUCCESS".to_string(), "Agent initialized");

    // handle data
    let mut data_prompt = "".to_string();
    if let Some(sliding) = &config.data.timeRange.sliding {
        if let Some(start_backtest) = &sliding.startBacktest {
            let minutes = sliding.minutes;
            let parts: Vec<&str> = start_backtest.split('T').collect();
            log_remote("INFO".to_string(), format!(
                "Fetching data for {} {} on {} minute interval",
                parts[0],
                parts[1].split('.').next().unwrap_or("Unknown Time"),
                minutes
            ).as_ref());

            let time_interval = json!({
                "minutes": minutes,
                "startBacktest": start_backtest.clone()
            });

            match query_data(&config.data.userQuery, &time_interval).await {
                Ok(data) => {
                    let injected_data = data["result"]["data"].clone();
                    log_remote("INFO".to_string(), format!("Received data from server in {}", data["result"]["time"]).as_str());
                    data_prompt = build_data_prompt(&config, &injected_data);
                }
                Err(err) => {
                    //error!("Failed to fetch data: {}", err);
                    log_remote("ERROR".to_string(), format!("{:?}", err).as_str());
                }
            }
        }
    }
   
    log_remote("INFO".to_string(), "Building prompt...");
    let prompt = format!(
        "{}\n{}\n{}",
        config.info.character,
        config.info.task,
        &data_prompt
    );
    log_remote("PROMPT".to_string(), &prompt);
    log_remote("SUCCESS".to_string(), "Prompt available");

    // Prompt the model and print its response
    log_remote("INFO".to_string(), "Invoking agent...");

    let response = gpt4
        .prompt(&prompt)
        .await
        .expect("Failed to prompt GPT-4");
    log_remote("SUCCESS".to_string(), "Agent invoked");
    log_remote_data("RESULT".to_string(),"", Some(response.to_string()));
}