const Header = ({ user, handleLogout }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <p className="text-gray-600">Stay organized and productive</p>
      </div>
      <div className="flex items-center space-x-4">
        {user.profilePic && (
          <img
            src={`http://localhost:3000/${user.profilePic.replace(/^\/+/, '')}`}
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
  );
};

export default Header;