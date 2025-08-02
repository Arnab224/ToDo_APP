import { useEffect, useState } from "react";
import axios from "axios";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import ProfileUpload from "./components/ProfileUpload";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Alert from "./components/Alert";
import AIDashboard from "./components/AIDashboard";

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
      const res = await axios.post("http://localhost:3000/api/auth/login", loginForm);
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
        "http://localhost:3000/tasks",
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
        await axios.delete(`http://localhost:3000/tasks/${id}`, {
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
        `http://localhost:3000/tasks/${id}`,
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
        `http://localhost:3000/tasks/${task._id}`,
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
      const res = await fetch("http://localhost:3000/api/users/upload-profile", {
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
      <AuthForm
        showSignup={showSignup}
        setShowSignup={setShowSignup}
        loginForm={loginForm}
        signupForm={signupForm}
        loginError={loginError}
        signupError={signupError}
        alert={alert}
        handleLoginChange={handleLoginChange}
        handleSignupChange={handleSignupChange}
        handleLoginSubmit={handleLoginSubmit}
        handleSignupSubmit={handleSignupSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Header user={user} handleLogout={handleLogout} />

        
        
        <ProfileUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleUpload={handleUpload}
        />

        <Alert alert={alert} />

        <TaskForm
          text={text}
          setText={setText}
          handleCreate={handleCreate}
        />


        <AIDashboard />


        <TaskList
          tasks={tasks}
          editId={editId}
          editText={editText}
          setEditText={setEditText}
          handleEdit={handleEdit}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          toggleCompleted={toggleCompleted}
          setEditId={setEditId}
        />
      </div>
    </div>
  );
};

export default App;