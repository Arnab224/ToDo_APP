import { useState } from "react";
import ProfileSection from "./ProfileSection";

const Header = ({ user, handleLogout }) => {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = (e) => {
    e.stopPropagation(); // Prevent bubbling to parent
    setShowProfile((prev) => !prev);
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Profile Image + Name Trigger */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            {user.profilePic && (
              <img
                src={`http://localhost:3000/${user.profilePic.replace(/^\/+/, "")}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
              />
            )}
            <p className="font-medium text-gray-800">Hi, {user.name}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggling profile
              handleLogout();
            }}
            className="text-sm text-red-500 hover:text-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Profile Editing Section */}
      {showProfile && <ProfileSection user={user} setShowProfile={setShowProfile} />}
    </>
  );
};

export default Header;