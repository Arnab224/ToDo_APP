const ProfileUpload = ({ selectedFile, setSelectedFile, handleUpload }) => {
  return (
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
  );
};

export default ProfileUpload;