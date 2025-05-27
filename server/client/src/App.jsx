import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [alert, setAlert] = useState("");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tasks", {
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
      setUser(JSON.parse(storedUser));
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
      const res = await axios.post("http://localhost:3000/api/auth/login",
        loginForm
      );
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
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(data.message);

    
    setShowSignup(false);
    setSignupForm({ name: "", username: "", email: "", password: "" });
    alert("Signup successful! Please log in.");
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
    if (!text.trim()) return;
    await axios.post(
      "http://localhost:3000/tasks",
      { text },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setText("");
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditText(task.text);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    await axios.put(
      `http://localhost:3000/tasks/${id}`,
      { text: editText },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setEditId(null);
    setEditText("");
    setAlert("Task updated successfully! ✅");
    fetchTasks();
    setTimeout(() => setAlert(""), 2000);
  };

  const toggleCompleted = async (task) => {
    await axios.put(
      `http://localhost:3000/tasks/${task._id}`,
      {
        text: task.text,
        completed: !task.completed,
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    fetchTasks();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={showSignup ? handleSignupSubmit : handleLoginSubmit}
          className="bg-white p-6 rounded shadow-md max-w-sm w-full"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {showSignup ? "Sign Up" : "Login"}
          </h2>

          {showSignup && (
                <>
                    <input
                    name="name"
                    placeholder="Name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    className="w-full mb-3 px-3 py-2 border rounded"
                    />
                    <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className="w-full mb-3 px-3 py-2 border rounded"
                    />
                </>
                )}

          <input
            name="username"
            placeholder="Username"
            value={showSignup ? signupForm.username : loginForm.username}
            onChange={showSignup ? handleSignupChange : handleLoginChange}
            className="w-full mb-3 px-3 py-2 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={showSignup ? signupForm.password : loginForm.password}
            onChange={showSignup ? handleSignupChange : handleLoginChange}
            className="w-full mb-4 px-3 py-2 border rounded"
          />

          {loginError && !showSignup && (
            <p className="text-red-600 mb-3 text-center">{loginError}</p>
          )}
          {signupError && showSignup && (
            <p className="text-red-600 mb-3 text-center">{signupError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {showSignup ? "Create Account" : "Login"}
          </button>

          <button
            type="button"
            onClick={() => setShowSignup(!showSignup)}
            className="mt-3 text-blue-500 hover:underline w-full text-center"
          >
            {showSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">ToDo List</h1>
        <div>
          <span className="mr-4">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {alert && (
        <div className="bg-green-200 text-green-700 px-4 py-2 rounded mb-4 w-full max-w-md text-center">
          {alert}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-2 mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <ul className="w-full max-w-md space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-white p-2 border rounded"
          >
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(task)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              {editId === task._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded"
                />
              ) : (
                <span
                  className={task.completed ? "line-through text-gray-400" : ""}
                >
                  {task.text}
                </span>
              )}
            </div>

            {editId === task._id ? (
              <>
                <button
                  onClick={() => handleUpdate(task._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-1"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;