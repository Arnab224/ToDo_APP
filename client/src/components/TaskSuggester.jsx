import { useState } from "react";
import axios from "axios";

function TaskSuggester({ onTaskCreate }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/ai/suggest-tasks", { input });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      alert("Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };

  const addSuggestionAsTask = (suggestion) => {
    if (onTaskCreate) {
      onTaskCreate(suggestion);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">💡 Generate Smart Subtasks</h3>
        <p className="text-sm text-gray-600 mb-3">Describe your main task and get AI-powered subtask suggestions</p>
      </div>
      
      <div className="space-y-3">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Prepare for project meeting, Plan vacation, Organize home office"
          onKeyPress={(e) => e.key === 'Enter' && handleSuggest()}
        />
        <button 
          onClick={handleSuggest}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Subtasks"}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Subtasks:</h4>
          <div className="space-y-2">
            {suggestions.map((sug, i) => (
              <div key={i} className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="text-gray-700 flex-1">{sug}</span>
                <button
                  onClick={() => addSuggestionAsTask(sug)}
                  className="ml-3 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition duration-200"
                >
                  Add Task
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskSuggester;