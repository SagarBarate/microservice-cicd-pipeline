function Alert({ type = "info", message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose ? (
        <button className="btn-icon" onClick={onClose} type="button">
          x
        </button>
      ) : null}
    </div>
  );
}

export default Alert;
