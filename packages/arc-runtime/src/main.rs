use rig::{completion::Prompt, providers::openai};
use std::io::{self, Read};
use std::io::Write;

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
    println!("{}\n", log_json);
    io::stdout().flush().unwrap(); // Flush stdout
}

fn log_remote(log_type: String, msg: &str) {
    log_remote_data(log_type, msg, None);
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
    let api_key = config.llm.apiKey;
    let openai_client = openai::Client::new(&api_key);
    let gpt4 = openai_client.agent("gpt-4").build();
    log_remote("SUCCESS".to_string(), "Agent initialized");

    let data : serde_json::Value = serde_json::from_str("{}").unwrap();

    log_remote("INFO".to_string(), "Building prompt...");
    let prompt = format!(
"{}
{}
{}",
        config.info.character,
        config.info.task,
        serde_json::to_string(&data).unwrap()
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