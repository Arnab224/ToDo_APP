import { useState, useRef, useEffect } from "react";
import axios from "axios";

const AIAssistant = ({ tasks, user, onTaskCreate, onTaskUpdate }) => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: `Hi ${user.name}! 👋 I'm your AI productivity assistant. I can help you with:
      
• Creating and organizing tasks
• Setting priorities and deadlines  
• Productivity tips and insights
• Task breakdowns and planning
• Motivation and goal setting

What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: "Help me prioritize", action: "prioritize" },
    { label: "Break down a task", action: "breakdown" },
    { label: "Motivate me", action: "motivate" },
    { label: "Weekly planning", action: "plan" }
  ];

  const handleQuickAction = (action) => {
    const actionMessages = {
      prioritize: "Can you help me prioritize my current tasks based on importance and urgency?",
      breakdown: "I have a complex task that I need help breaking down into smaller steps.",
      motivate: "I'm feeling unmotivated today. Can you help me stay focused?",
      plan: "Help me plan my tasks for the upcoming week."
    };
    
    setInput(actionMessages[action]);
  };

  const processLocalResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Task creation patterns
    if (msg.includes('create') || msg.includes('add') || msg.includes('new task')) {
      return {
        content: "I'd be happy to help you create a new task! Just tell me what you need to do, and I can add it to your list. You can also specify details like priority level or deadline.",
        suggestions: ["Add task: Complete project proposal", "Create task: Call client about meeting"]
      };
    }
    
    // Prioritization help
    if (msg.includes('prioritize') || msg.includes('priority')) {
      const pendingTasks = tasks.filter(t => !t.completed);
      return {
        content: `Looking at your ${pendingTasks.length} pending tasks, I recommend focusing on tasks with deadlines first, followed by high-impact activities. Would you like me to suggest a priority order for your current tasks?`,
        suggestions: ["Yes, prioritize my tasks", "Explain priority methods"]
      };
    }
    
    // Motivation and encouragement
    if (msg.includes('motivate') || msg.includes('unmotivated') || msg.includes('stuck')) {
      const completed = tasks.filter(t => t.completed).length;
      return {
        content: `You've already completed ${completed} tasks - that's amazing progress! 🎉 Remember, every small step counts. Try the "2-minute rule": if a task takes less than 2 minutes, do it now. For bigger tasks, just focus on taking the first small step.`,
        suggestions: ["Give me a quick win task", "Break down my hardest task"]
      };
    }
    
    // Planning assistance
    if (msg.includes('plan') || msg.includes('schedule') || msg.includes('organize')) {
      return {
        content: "Great! Let's plan effectively. I recommend the 1-3-5 rule: pick 1 big thing, 3 medium things, and 5 small things for each day. This prevents overcommitment while ensuring progress. What time frame are you planning for?",
        suggestions: ["Plan my day", "Plan my week", "Help with time blocking"]
      };
    }
    
    // Task breakdown
    if (msg.includes('break down') || msg.includes('breakdown') || msg.includes('steps')) {
      return {
        content: "I can help break down complex tasks into manageable steps! Share the task you want to break down, and I'll suggest specific, actionable steps. This makes big projects less overwhelming and more achievable.",
        suggestions: ["Break down: Launch new website", "Break down: Organize home office"]
      };
    }
    
    // Productivity tips
    if (msg.includes('productive') || msg.includes('efficiency') || msg.includes('tips')) {
      return {
        content: "Here are some proven productivity techniques: 🚀\n\n• Pomodoro Technique (25 min focus + 5 min break)\n• Time blocking for similar tasks\n• The 2-minute rule for quick tasks\n• Energy management (hard tasks when you're fresh)\n• Regular breaks to maintain focus",
        suggestions: ["Tell me about Pomodoro", "Help me time block", "What's energy management?"]
      };
    }
    
    // Default helpful response
    return {
      content: "I'm here to help with your productivity and task management! I can assist with creating tasks, setting priorities, breaking down complex projects, planning your schedule, and providing motivation. What specific area would you like help with?",
      suggestions: ["Help me get organized", "I need motivation", "Plan my tasks"]
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      let assistantResponse;
      
      // Try AI API first
      try {
        const res = await axios.post("/api/ai/chat", {
          message: input,
          context: {
            tasks: tasks.slice(-10), // Last 10 tasks for context
            user: user.name,
            completedToday: tasks.filter(t => t.completed && 
              new Date(t.completedAt || t.createdAt).toDateString() === new Date().toDateString()
            ).length
          }
        });
        assistantResponse = res.data.response;
      } catch (err) {
        // Fallback to local processing
        assistantResponse = processLocalResponse(input);
      }
      
      const response = {
        type: 'assistant',
        content: assistantResponse.content || assistantResponse,
        suggestions: assistantResponse.suggestions || [],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      
      // Handle task creation if detected
      if (input.toLowerCase().includes('add task:') || input.toLowerCase().includes('create task:')) {
        const taskText = input.replace(/^(add task:|create task:)/i, '').trim();
        if (taskText && onTaskCreate) {
          onTaskCreate(taskText);
          setMessages(prev => [...prev, {
            type: 'system',
            content: `✅ Task created: "${taskText}"`,
            timestamp: new Date()
          }]);
        }
      }
      
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">🤖 AI Productivity Assistant</h3>
        <p className="text-sm text-gray-600 mb-4">Chat with your personal AI assistant for task help, motivation, and productivity tips</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleQuickAction(action.action)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition duration-200"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'system'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, j) => (
                      <button
                        key={j}
                        onClick={() => setInput(suggestion)}
                        className="block w-full text-left text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition duration-200"
                      >
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about productivity, tasks, or planning..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;