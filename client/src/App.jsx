import React, { useEffect, useState } from "react";
import axios from "axios";
import AddTask from "./components/AddTask";
import Task from "./components/Task";
import Login from "./components/Login";
import Signup from "./components/Signup";

const API_BASE = "https://todo-app-mgt8.onrender.com";
const URL = "https://todo-app-mgt8.onrender.com"; // ✅ Fix 1: Added missing URL constant

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_BASE}/tasks/${user._id}`);
          setTasks(response.data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };
    fetchTasks();
  }, [user]);

  const addTask = async (text) => {
    try {
      const response = await axios.post(`${API_BASE}/tasks`, {
        text,
        userId: user._id,
      });
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleCompleted = async (task) => {
    try {
      const updatedTask = {
        ...task,
        completed: !task.completed,
      };

      const response = await axios.put(
        `${API_BASE}/tasks/${task._id}`, // ✅ Fix 2: Corrected endpoint
        updatedTask
      );

      setTasks(
        tasks.map((t) => (t._id === task._id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return isLogin ? (
      <Login onLogin={setUser} switchToSignup={() => setIsLogin(false)} />
    ) : (
      <Signup onSignup={setUser} switchToLogin={() => setIsLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={`${URL}/${user.profilePic.replace(/^\/+/, '')}`} // ✅ Uses the fixed URL
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-xl font-semibold">Welcome, {user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      <main className="p-4 max-w-2xl mx-auto">
        <AddTask addTask={addTask} />
        <div className="mt-4">
          {tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              toggleCompleted={toggleCompleted}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
