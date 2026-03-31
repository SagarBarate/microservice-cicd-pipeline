import { useEffect, useMemo, useRef, useState } from "react";

function SpecializationAutocomplete({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Search by name or code…",
  disabled = false
}) {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const labelForValue = useMemo(() => {
    const o = options.find((x) => x.code === value);
    return o?.label ?? "";
  }, [options, value]);

  useEffect(() => {
    if (!open) setQuery(labelForValue);
  }, [labelForValue, open]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)
    );
  }, [options, query]);

  const resolveBlur = () => {
    setOpen(false);
    const q = query.trim().toLowerCase();
    const match = options.find(
      (o) => o.label.toLowerCase() === q || o.code.toLowerCase() === q
    );
    if (match) {
      onChange(match.code);
      setQuery(match.label);
    } else {
      setQuery(labelForValue);
    }
  };

  const handleBlur = () => {
    setTimeout(resolveBlur, 180);
  };

  return (
    <div className="form-group autocomplete-field" ref={wrapRef}>
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <div className="autocomplete-input-wrap">
        <input
          id={name}
          name={name}
          type="text"
          autoComplete="off"
          value={open ? query : labelForValue || query}
          disabled={disabled}
          placeholder={placeholder}
          className={error ? "input-error" : ""}
          onFocus={() => {
            setOpen(true);
            setQuery(labelForValue);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange("");
          }}
          onBlur={handleBlur}
          aria-expanded={open}
          aria-controls={`${name}-listbox`}
          aria-autocomplete="list"
          role="combobox"
        />
        {open && !disabled ? (
          <ul
            className="autocomplete-list"
            id={`${name}-listbox`}
            role="listbox"
          >
            {filtered.length === 0 ? (
              <li className="autocomplete-empty">No matches</li>
            ) : (
              filtered.map((o) => (
                <li key={o.code}>
                  <button
                    type="button"
                    className="autocomplete-option"
                    role="option"
                    aria-selected={o.code === value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(o.code);
                      setQuery(o.label);
                      setOpen(false);
                    }}
                  >
                    <span className="autocomplete-option-label">{o.label}</span>
                    <span className="autocomplete-option-code">{o.code}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}

export default SpecializationAutocomplete;
