const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 fade-in">
    <span className="text-5xl mb-3">{icon}</span>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-5 text-center max-w-sm">{description}</p>
    {action}
  </div>
);
export default EmptyState;
