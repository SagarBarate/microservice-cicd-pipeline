function StatusBadge({ healthy }) {
  return <span className={`status-badge ${healthy ? "healthy" : "unhealthy"}`}>{healthy ? "Healthy" : "Unhealthy"}</span>;
}

export default StatusBadge;
