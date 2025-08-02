const Alert = ({ alert }) => {
  if (!alert) return null;

  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
      <p>{alert}</p>
    </div>
  );
};

export default Alert;