function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}

export default InputField;
