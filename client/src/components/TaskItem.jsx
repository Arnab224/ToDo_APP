const TaskItem = ({
  task,
  editId,
  editText,
  setEditText,
  handleEdit,
  handleUpdate,
  handleDelete,
  toggleCompleted,
  setEditId
}) => {
  return (
    <li
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
  );
};

export default TaskItem;