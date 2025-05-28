import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [notification, setNotification] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
  });
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState("");
  const API_URL = "to-do-app-rosy-nu.vercel.app";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setAlert("Failed to fetch tasks. Please login again.");
      handleLogout();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.token) {
        setUser(parsed);
      } else {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginForm);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setLoginForm({ username: "", password: "" });
    } catch (error) {
      setLoginError("Invalid username or password");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: signupForm.name,
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password,
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShowSignup(false);
      setSignupForm({ name: "", username: "", email: "", password: "" });
      setAlert("Signup successful! Please log in.");
      setTimeout(() => setAlert(""), 3000);
    } catch (error) {
      console.error("Signup Error:", error.message);
      setSignupError(error.message || "Signup failed.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setTasks([]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setAlert("Please enter a task");
      setTimeout(() => setAlert(""), 2000);
      return;
    }
    try {
      await axios.post(
        `${API_URL}/tasks`,
        { text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setText("");
      setAlert("Task added successfully! ✅");
      setTimeout(() => setAlert(""), 2000);
      fetchTasks();
    } catch (error) {
      setAlert("Failed to add task");
      setTimeout(() => setAlert(""), 2000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAlert("Task deleted successfully! 🗑️");
        setTimeout(() => setAlert(""), 2000);
        fetchTasks();
      } catch (error) {
        setAlert("Failed to delete task");
        setTimeout(() => setAlert(""), 2000);
      }
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditText(task.text);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) {
      setAlert("Task cannot be empty");
      setTimeout(() => setAlert(""), 2000);
      return;
    }
    try {
      await axios.put(
        `${API_URL}/tasks/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEditId(null);
      setEditText("");
      setAlert("Task updated successfully! ✅");
      setTimeout(() => setAlert(""), 2000);
      fetchTasks();
    } catch (error) {
      setAlert("Failed to update task");
      setTimeout(() => setAlert(""), 2000);
    }
  };

  const toggleCompleted = async (task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
    };

    setTasks(prev =>
      prev.map(t => (t._id === task._id ? updatedTask : t))
    );

    try {
      await axios.put(
        `${API_URL}/tasks/${task._id}`,
        {
          text: updatedTask.text,
          completed: updatedTask.completed,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(prev => prev.map(t => (t._id === task._id ? task : t)));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setAlert("Please select a file first.");
      setTimeout(() => setAlert(""), 2000);
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;

    if (!token) {
      setAlert("No token found. Please login again.");
      setTimeout(() => setAlert(""), 2000);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/upload-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data.message);
        setAlert("Upload failed: " + data.message);
        setTimeout(() => setAlert(""), 2000);
      } else {
        const updatedUser = { ...user, profilePic: data.profilePic };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAlert("Profile picture updated successfully! ✅");
        setTimeout(() => setAlert(""), 2000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setAlert("Upload error: " + err.message);
      setTimeout(() => setAlert(""), 2000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          {alert && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
              {alert}
            </div>
          )}
          <form
            onSubmit={showSignup ? handleSignupSubmit : handleLoginSubmit}
            className="bg-white p-8 rounded-lg shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              {showSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {showSignup ? "Join us today!" : "Sign in to continue"}
            </p>

            {showSignup && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <input
                    name="email"
                    placeholder="john@example.com"
                    type="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {showSignup ? "Choose a Username" : "Username"}
              </label>
              <input
                name="username"
                placeholder={showSignup ? "johndoe123" : "Enter your username"}
                value={showSignup ? signupForm.username : loginForm.username}
                onChange={showSignup ? handleSignupChange : handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {showSignup ? "Create a Password" : "Password"}
              </label>
              <input
                name="password"
                type="password"
                placeholder={showSignup ? "••••••••" : "••••••••"}
                value={showSignup ? signupForm.password : loginForm.password}
                onChange={showSignup ? handleSignupChange : handleLoginChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
              {showSignup && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>

            {loginError && !showSignup && (
              <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>
            )}
            {signupError && showSignup && (
              <p className="text-red-500 text-sm mb-4 text-center">{signupError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {showSignup ? "Sign Up" : "Login"}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowSignup(!showSignup)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
              >
                {showSignup
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-gray-600">Stay organized and productive</p>
          </div>
          <div className="flex items-center space-x-4">
            {user.profilePic && (
              <img
                src={`${API_URL}/${user.profilePic.replace(/^\/+/, '')}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
              />
            )}
            <div>
              <p className="font-medium text-gray-800">Hi, {user.name}</p>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Profile Picture Upload */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Profile Settings</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0 file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`px-4 py-2 rounded-lg font-medium ${selectedFile ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition duration-200`}
            >
              Upload
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {alert && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
            <p>{alert}</p>
          </div>
        )}

        {/* Add Task Form */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-800">
              My Tasks ({tasks.length})
            </h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className={`p-4 hover:bg-gray-50 transition duration-150 ${task.completed ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleCompleted(task)}
                        className={`flex-shrink-0 w-5 h-5 rounded border ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      {editId === task._id ? (
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`flex-1 truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                        >
                          {task.text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-3">
                      {editId === task._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(task._id)}
                            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50 transition duration-200"
                            title="Save"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition duration-200"
                            title="Cancel"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50 transition duration-200"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition duration-200"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
