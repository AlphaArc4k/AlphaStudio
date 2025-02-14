import { useEffect, useRef, useState } from "react";
import { AgentConfig } from "../../lib/AgentConfig";
import { Send } from "lucide-react";
import { useAgentConfig } from "../../context/useAgentContext";

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  agent: AgentConfig;
}

export const Chat: React.FC<ChatProps> = ({ agent }) => {

  const { runAgent, messages: messagesAgent } = useAgentConfig()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Hello! I\'m here to help you analyze market data and trends. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // TODO on reload this will trigger creating duplicates - move messages to server for more persistent sessions, add a reset or id based on content
  useEffect(() => {

    // append to messages
    const newMessages = messagesAgent.map(m => ({
      ...m,
      id: Date.now().toString(),
      timestamp: new Date()
    }))
    setMessages(prev => [...prev, ...newMessages]);
  
    return () => {

    }
  }, [messagesAgent])
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const result = await runAgent(agent, {
        message: {
          type: 'user',
          content: newMessage.content
        }
      })
      console.log('exec result', result)
    } catch (error) {
      console.log('execution error', error)
    }
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isUser && (
          <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 mr-3">
            <img
              src={agent.info.profileImage || '/api/placeholder/32/32'}
              alt={agent.info.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2 rounded-lg max-w ${
              isUser
                ? 'bg-purple-500 text-white'
                : 'bg-[#13171F] text-slate-200'
            }`}
          >
            {message.content}
          </div>
          <span className="text-xs text-slate-500 mt-1">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="border-t border-slate-800/20 bg-[#0B101B]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#13171F] text-white rounded-lg px-4 py-2.5 
                       placeholder-slate-500 border border-slate-800/20
                       focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};