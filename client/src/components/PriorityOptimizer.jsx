import { useState } from "react";
import axios from "axios";

const PriorityOptimizer = ({ tasks, onTaskUpdate }) => {
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState({
    deadline: 0.4,
    importance: 0.3,
    effort: 0.2,
    dependencies: 0.1
  });

  const calculateLocalPriority = (task) => {
    const text = task.text.toLowerCase();
    let score = 50; // Base score
    
    // Urgency indicators
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'today', 'now', 'deadline'];
    const importantKeywords = ['important', 'critical', 'key', 'essential', 'priority'];
    const lowPriorityKeywords = ['maybe', 'sometime', 'eventually', 'when possible'];
    
    urgentKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 30;
    });
    
    importantKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 20;
    });
    
    lowPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 20;
    });
    
    // Length-based complexity (longer tasks might be more complex)
    if (text.length > 50) score += 10;
    
    return Math.max(1, Math.min(100, score));
  };

  const getPriorityLabel = (score) => {
    if (score >= 80) return { label: 'Critical', color: 'red', emoji: '🔴' };
    if (score >= 60) return { label: 'High', color: 'orange', emoji: '🟠' };
    if (score >= 40) return { label: 'Medium', color: 'yellow', emoji: '🟡' };
    return { label: 'Low', color: 'green', emoji: '🟢' };
  };

  const optimizePriorities = async () => {
    setLoading(true);
    try {
      // Try AI optimization first
      let optimizedTasks;
      try {
        const res = await axios.post("/api/ai/optimize-priorities", { 
          tasks: tasks.filter(t => !t.completed),
          criteria 
        });
        optimizedTasks = res.data.prioritizedTasks;
      } catch (err) {
        // Fallback to local optimization
        console.log("Using local priority optimization");
        optimizedTasks = tasks
          .filter(t => !t.completed)
          .map(task => ({
            ...task,
            priorityScore: calculateLocalPriority(task),
            reasoning: "Analyzed based on keywords and task complexity"
          }))
          .sort((a, b) => b.priorityScore - a.priorityScore);
      }

      setPrioritizedTasks(optimizedTasks);
    } catch (err) {
      alert("Failed to optimize priorities");
    } finally {
      setLoading(false);
    }
  };

  const applyPriority = async (taskId, priority) => {
    try {
      await onTaskUpdate(taskId, { priority });
      alert("Priority updated successfully!");
    } catch (err) {
      alert("Failed to update priority");
    }
  };

  const applyAllPriorities = async () => {
    try {
      for (const task of prioritizedTasks) {
        await onTaskUpdate(task._id, { 
          priority: task.priorityScore,
          priorityLabel: getPriorityLabel(task.priorityScore).label
        });
      }
      alert("All priorities updated successfully!");
    } catch (err) {
      alert("Failed to update some priorities");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">🎯 Priority Optimizer</h3>
        <p className="text-sm text-gray-600 mb-4">AI analyzes your tasks and suggests optimal priorities based on multiple factors</p>
      </div>

      {/* Priority Criteria */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Priority Factors</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(criteria).map(([factor, weight]) => (
            <div key={factor}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                {factor} ({(weight * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={weight}
                onChange={(e) => setCriteria({
                  ...criteria,
                  [factor]: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={optimizePriorities}
        disabled={loading || tasks.filter(t => !t.completed).length === 0}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? "Analyzing Priorities..." : "🧠 Optimize Task Priorities"}
      </button>

      {prioritizedTasks.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-red-800">📋 Optimized Priority Order</h4>
            <button
              onClick={applyAllPriorities}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Apply All
            </button>
          </div>
          
          <div className="space-y-3">
            {prioritizedTasks.map((task, index) => {
              const priority = getPriorityLabel(task.priorityScore);
              return (
                <div key={task._id} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                        <span className="text-sm">{priority.emoji}</span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${priority.color}-100 text-${priority.color}-800`}>
                          {priority.label}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">{task.text}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Score: {task.priorityScore}/100 • {task.reasoning}
                      </p>
                    </div>
                    <button
                      onClick={() => applyPriority(task._id, task.priorityScore)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityOptimizer;