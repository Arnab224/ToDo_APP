import { useState } from "react";
import axios from "axios";

const SmartScheduler = ({ tasks, onTaskUpdate }) => {
  const [schedule, setSchedule] = useState([]);
  const [preferences, setPreferences] = useState({
    workingHours: { start: "09:00", end: "17:00" },
    breakDuration: 15,
    focusTime: 90,
    preferredDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
  });
  const [loading, setLoading] = useState(false);

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const incompleteTasks = tasks.filter(task => !task.completed);
      const res = await axios.post("/api/ai/smart-schedule", {
        tasks: incompleteTasks,
        preferences
      });
      setSchedule(res.data.schedule);
    } catch (err) {
      alert("Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  };

  const applySchedule = async (taskId, scheduledTime) => {
    try {
      await onTaskUpdate(taskId, { scheduledTime });
      alert("Schedule applied successfully!");
    } catch (err) {
      alert("Failed to apply schedule");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">📅 Smart Task Scheduler</h3>
        <p className="text-sm text-gray-600 mb-4">AI will optimize your task schedule based on priority, estimated time, and your preferences</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Scheduling Preferences</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Working Hours</label>
            <div className="flex space-x-2">
              <input
                type="time"
                value={preferences.workingHours.start}
                onChange={(e) => setPreferences({
                  ...preferences,
                  workingHours: { ...preferences.workingHours, start: e.target.value }
                })}
                className="px-2 py-1 border rounded text-sm"
              />
              <span className="text-gray-500 text-sm self-center">to</span>
              <input
                type="time"
                value={preferences.workingHours.end}
                onChange={(e) => setPreferences({
                  ...preferences,
                  workingHours: { ...preferences.workingHours, end: e.target.value }
                })}
                className="px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Focus Session (minutes)</label>
            <input
              type="number"
              value={preferences.focusTime}
              onChange={(e) => setPreferences({ ...preferences, focusTime: parseInt(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
              min="30"
              max="180"
            />
          </div>
        </div>
      </div>

      <button
        onClick={generateSchedule}
        disabled={loading || tasks.filter(t => !t.completed).length === 0}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-200 disabled:opacity-50"
      >
        {loading ? "Generating Optimal Schedule..." : "Generate Smart Schedule"}
      </button>

      {schedule.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-800 mb-3">📋 Optimized Schedule</h4>
          <div className="space-y-3">
            {schedule.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded border flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{item.taskName}</p>
                  <p className="text-sm text-gray-600">
                    {item.suggestedTime} • {item.estimatedDuration} min • Priority: {item.priority}
                  </p>
                  <p className="text-xs text-purple-600">{item.reasoning}</p>
                </div>
                <button
                  onClick={() => applySchedule(item.taskId, item.suggestedTime)}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartScheduler;