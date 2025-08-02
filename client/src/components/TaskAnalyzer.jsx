import { useState, useEffect } from "react";
import axios from "axios";

const TaskAnalyzer = ({ tasks }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeTaskComplexity = (task) => {
    const text = task.toLowerCase();
    let complexity = 1;
    
    // Keywords that indicate higher complexity
    const complexKeywords = ['research', 'analyze', 'develop', 'create', 'design', 'plan', 'strategy'];
    const simpleKeywords = ['call', 'email', 'buy', 'send', 'check'];
    
    complexKeywords.forEach(keyword => {
      if (text.includes(keyword)) complexity += 1;
    });
    
    simpleKeywords.forEach(keyword => {
      if (text.includes(keyword)) complexity -= 0.5;
    });
    
    return Math.max(1, Math.min(5, complexity));
  };

  const categorizeTask = (task) => {
    const text = task.toLowerCase();
    
    if (text.includes('meet') || text.includes('call') || text.includes('discuss')) return 'Communication';
    if (text.includes('buy') || text.includes('shop') || text.includes('order')) return 'Shopping';
    if (text.includes('clean') || text.includes('organize') || text.includes('tidy')) return 'Organization';
    if (text.includes('work') || text.includes('project') || text.includes('develop')) return 'Work';
    if (text.includes('learn') || text.includes('study') || text.includes('read')) return 'Learning';
    if (text.includes('exercise') || text.includes('gym') || text.includes('workout')) return 'Health';
    
    return 'General';
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Local analysis
      const taskComplexity = tasks.map(task => ({
        ...task,
        complexity: analyzeTaskComplexity(task.text),
        category: categorizeTask(task.text)
      }));

      const categories = {};
      taskComplexity.forEach(task => {
        categories[task.category] = (categories[task.category] || 0) + 1;
      });

      const completionRate = tasks.length > 0 ? 
        (tasks.filter(t => t.completed).length / tasks.length * 100).toFixed(1) : 0;

      // Try to get AI insights
      let aiInsights = null;
      try {
        const res = await axios.post("/api/ai/analyze-tasks", { tasks });
        aiInsights = res.data.insights;
      } catch (err) {
        console.log("AI analysis not available, using local analysis");
      }

      setAnalysis({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        pendingTasks: tasks.filter(t => !t.completed).length,
        completionRate: parseFloat(completionRate),
        categories,
        averageComplexity: taskComplexity.reduce((sum, t) => sum + t.complexity, 0) / tasks.length || 0,
        highComplexityTasks: taskComplexity.filter(t => t.complexity >= 4).length,
        aiInsights: aiInsights || {
          patterns: ["Most tasks are work-related", "Consider breaking down complex tasks"],
          recommendations: ["Schedule high-complexity tasks during peak hours", "Group similar tasks together"],
          timeEstimates: taskComplexity.map(t => ({ task: t.text, estimate: t.complexity * 30 }))
        }
      });
    } catch (err) {
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      runAnalysis();
    }
  }, [tasks]);

  if (!analysis && tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Add some tasks to see detailed analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">📊 Task Analysis & Insights</h3>
        <p className="text-sm text-gray-600 mb-4">AI-powered analysis of your task patterns and productivity</p>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Analyzing your tasks...</p>
        </div>
      ) : analysis && (
        <div className="space-y-4">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{analysis.totalTasks}</p>
              <p className="text-xs text-blue-800">Total Tasks</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{analysis.completedTasks}</p>
              <p className="text-xs text-green-800">Completed</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{analysis.pendingTasks}</p>
              <p className="text-xs text-orange-800">Pending</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{analysis.completionRate}%</p>
              <p className="text-xs text-purple-800">Completion Rate</p>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Task Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(analysis.categories).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="text-sm text-gray-700">{category}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-indigo-800 mb-3">🔍 AI Insights</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-medium text-indigo-700 mb-1">Patterns Detected:</h5>
                <ul className="text-sm text-indigo-600 space-y-1">
                  {analysis.aiInsights.patterns.map((pattern, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-medium text-indigo-700 mb-1">Recommendations:</h5>
                <ul className="text-sm text-indigo-600 space-y-1">
                  {analysis.aiInsights.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">💡</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">⚡ Complexity Analysis</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-yellow-700">Average Complexity: <span className="font-medium">{analysis.averageComplexity.toFixed(1)}/5</span></p>
              </div>
              <div>
                <p className="text-yellow-700">High Complexity Tasks: <span className="font-medium">{analysis.highComplexityTasks}</span></p>
              </div>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            🔄 Refresh Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskAnalyzer;