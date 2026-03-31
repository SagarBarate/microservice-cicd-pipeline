function EmptyState({ title = "No data found", subtitle = "Try changing filters." }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export default EmptyState;
