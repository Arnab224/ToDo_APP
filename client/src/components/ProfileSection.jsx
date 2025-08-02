// src/components/ProfileSection.jsx
import { useState } from "react";

const ProfileSection = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const token = user?.token || localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 2000);
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || "Update failed");

      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      showAlert("success", "Profile updated ✅");
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to update profile");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showAlert("error", "Please select a file first.");
      return;
    }

    const form = new FormData();
    form.append("profilePic", selectedFile);

    try {
      const res = await fetch("http://localhost:3000/api/users/upload-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      const updatedUser = { ...user, profilePic: data.profilePic };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showAlert("success", "Profile picture uploaded ✅");
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to upload profile picture");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 my-6">
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>

      {alert.message && (
        <div
          className={`mb-4 text-sm px-4 py-2 rounded ${
            alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Profile
      </button>

      <hr className="my-6" />

      <div className="mb-4">
        <label htmlFor="profilePic" className="block text-sm font-medium mb-1">
          Upload Profile Picture
        </label>
        <input
          id="profilePic"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full"
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload Picture
      </button>

      {user?.profilePic && (
        <div className="mt-6">
          <img
            src={`http://localhost:3000/${user.profilePic.replace(/^\/+/, "")}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border mt-4"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileSection;