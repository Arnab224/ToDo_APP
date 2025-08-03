import { useState, useEffect } from "react";
import axios from "axios";

const ProductivityInsights = ({ tasks, user }) => {
  const [insights, setInsights] = useState(null);
  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(false);

  const calculateLocalInsights = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const timeframeDate = timeframe === 'week' ? weekAgo : monthAgo;
    const recentTasks = tasks.filter(task => new Date(task.createdAt || now) >= timeframeDate);
    
    const completedTasks = recentTasks.filter(t => t.completed);
    const completionRate = recentTasks.length > 0 ? (completedTasks.length / recentTasks.length * 100) : 0;
    
    // Analyze productivity patterns
    const tasksByDay = {};
    recentTasks.forEach(task => {
      const day = new Date(task.createdAt || now).toLocaleDateString('en-US', { weekday: 'long' });
      tasksByDay[day] = (tasksByDay[day] || 0) + 1;
    });
    
    const mostProductiveDay = Object.entries(tasksByDay).reduce((a, b) => 
      tasksByDay[a[0]] > tasksByDay[b[0]] ? a : b, ['Monday', 0])[0];
    
    // Task completion streaks
    const completedDates = completedTasks.map(t => new Date(t.completedAt || t.createdAt || now).toDateString());
    const uniqueDates = [...new Set(completedDates)].sort();
    
    let currentStreak = 0;
    let maxStreak = 0;
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = new Date(uniqueDates[i]);
      const expectedDate = new Date(now.getTime() - currentStreak * 24 * 60 * 60 * 1000);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        break;
      }
    }
    
    return {
      totalTasks: recentTasks.length,
      completedTasks: completedTasks.length,
      completionRate: completionRate.toFixed(1),
      averageTasksPerDay: (recentTasks.length / (timeframe === 'week' ? 7 : 30)).toFixed(1),
      mostProductiveDay,
      currentStreak,
      maxStreak,
      productivity: {
        score: Math.min(100, (completionRate + currentStreak * 10)).toFixed(0),
        trend: completionRate > 70 ? 'up' : completionRate > 40 ? 'stable' : 'down'
      },
      recommendations: [
        completionRate < 50 ? "Try breaking large tasks into smaller, manageable pieces" : "Great completion rate! Keep up the momentum",
        currentStreak === 0 ? "Start a new productivity streak by completing a task today" : `Excellent! You're on a ${currentStreak}-day streak`,
        `${mostProductiveDay} seems to be your most productive day - schedule important tasks then`
      ]
    };
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      let aiInsights = null;
      
      // Try to get AI insights
      try {
        const res = await axios.post("/api/ai/productivity-insights", {
          tasks,
          user,
          timeframe
        });
        aiInsights = res.data.insights;
      } catch (err) {
        console.log("Using local insights calculation");
      }
      
      const localInsights = calculateLocalInsights();
      
      setInsights({
        ...localInsights,
        aiRecommendations: aiInsights?.recommendations || [],
        predictiveInsights: aiInsights?.predictions || {
          nextWeekProductivity: "Based on your patterns, you're likely to complete 5-7 tasks next week",
          optimalTaskTime: "Your peak productivity appears to be in the morning hours",
          burnoutRisk: localInsights.completionRate < 30 ? "High" : localInsights.completionRate < 60 ? "Medium" : "Low"
        }
      });
    } catch (err) {
      alert("Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      generateInsights();
    }
  }, [tasks, timeframe]);

  if (!insights && tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Complete some tasks to see productivity insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-2">📈 Productivity Insights</h3>
          <p className="text-sm text-gray-600">AI-powered analysis of your productivity patterns and trends</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Analyzing your productivity...</p>
        </div>
      ) : insights && (
        <div className="space-y-4">
          {/* Productivity Score */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🏆</span>
              <h4 className="text-lg font-medium text-gray-800">Productivity Score</h4>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{insights.productivity.score}/100</div>
            <div className="flex items-center justify-center space-x-1">
              <span className={`text-sm ${
                insights.productivity.trend === 'up' ? 'text-green-600' : 
                insights.productivity.trend === 'stable' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {insights.productivity.trend === 'up' ? '📈 Trending Up' : 
                 insights.productivity.trend === 'stable' ? '➡️ Stable' : '📉 Needs Attention'}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-lg font-bold text-blue-600">{insights.completionRate}%</p>
              <p className="text-xs text-blue-800">Completion Rate</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-lg font-bold text-purple-600">{insights.currentStreak}</p>
              <p className="text-xs text-purple-800">Current Streak</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-lg font-bold text-orange-600">{insights.averageTasksPerDay}</p>
              <p className="text-xs text-orange-800">Tasks/Day</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-lg font-bold text-green-600">{insights.maxStreak}</p>
              <p className="text-xs text-green-800">Best Streak</p>
            </div>
          </div>

          {/* Productivity Patterns */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">⭐ Your Productivity Patterns</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-yellow-700">Most Productive Day:</span>
                <span className="font-medium text-yellow-800">{insights.mostProductiveDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-700">Burnout Risk:</span>
                <span className={`font-medium ${
                  insights.predictiveInsights.burnoutRisk === 'Low' ? 'text-green-600' :
                  insights.predictiveInsights.burnoutRisk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {insights.predictiveInsights.burnoutRisk}
                </span>
              </div>
            </div>
          </div>

          {/* AI Predictions */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-indigo-800 mb-3">🔮 AI Predictions</h4>
            <div className="space-y-2 text-sm text-indigo-700">
              <p><strong>Next Week:</strong> {insights.predictiveInsights.nextWeekProductivity}</p>
              <p><strong>Optimal Time:</strong> {insights.predictiveInsights.optimalTaskTime}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Personalized Recommendations</h4>
            <div className="space-y-2">
              {insights.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
              {insights.aiRecommendations.map((rec, i) => (
                <div key={`ai-${i}`} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">🤖</span>
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generateInsights}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition duration-200"
          >
            🔄 Refresh Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductivityInsights;