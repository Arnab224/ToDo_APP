import TaskItem from "./TaskItem";

const TaskList = ({
  tasks,
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
            <TaskItem
              key={task._id}
              task={task}
              editId={editId}
              editText={editText}
              setEditText={setEditText}
              handleEdit={handleEdit}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              toggleCompleted={toggleCompleted}
              setEditId={setEditId}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;