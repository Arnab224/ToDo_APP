import { useState } from "react";
import TaskSuggester from "./TaskSuggester";
import SmartScheduler from "./SmartScheduler";
import TaskAnalyzer from "./TaskAnalyzer";
import PriorityOptimizer from "./PriorityOptimizer";
import ProductivityInsights from "./ProductivityInsights";
import AIAssistant from "./AIAssistant";

const AIDashboard = ({ tasks, user, onTaskUpdate, onTaskCreate }) => {
  const [activeTab, setActiveTab] = useState("suggester");

  const tabs = [
    { id: "suggester", label: "Task Suggester", icon: "💡" },
    { id: "scheduler", label: "Smart Scheduler", icon: "📅" },
    { id: "analyzer", label: "Task Analyzer", icon: "📊" },
    { id: "priority", label: "Priority Optimizer", icon: "🎯" },
    { id: "insights", label: "Productivity Insights", icon: "📈" },
    { id: "assistant", label: "AI Assistant", icon: "🤖" }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "suggester":
        return <TaskSuggester onTaskCreate={onTaskCreate} />;
      case "scheduler":
        return <SmartScheduler tasks={tasks} onTaskUpdate={onTaskUpdate} />;
      case "analyzer":
        return <TaskAnalyzer tasks={tasks} />;
      case "priority":
        return <PriorityOptimizer tasks={tasks} onTaskUpdate={onTaskUpdate} />;
      case "insights":
        return <ProductivityInsights tasks={tasks} user={user} />;
      case "assistant":
        return <AIAssistant tasks={tasks} user={user} onTaskCreate={onTaskCreate} onTaskUpdate={onTaskUpdate} />;
      default:
        return <TaskSuggester onTaskCreate={onTaskCreate} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-800 mb-3">🚀 AI-Powered Features</h2>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AIDashboard;