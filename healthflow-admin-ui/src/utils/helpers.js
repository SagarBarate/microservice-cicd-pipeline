export const safeArray = (value) => (Array.isArray(value) ? value : []);

export const extractArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.result)) return response.result;
  return [];
};

export const extractObject = (response) => {
  if (response?.data && typeof response.data === "object") return response.data;
  if (typeof response === "object") return response;
  return {};
};

export const readableDate = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleString();
};

/** Local date key YYYY-MM-DD for comparison (handles ISO string or [y,m,d] from JSON). */
export const toDateKey = (value) => {
  if (value == null) return null;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  if (typeof value === "string") {
    const part = value.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

export const todayDateKeyLocal = () => {
  const n = new Date();
  const y = n.getFullYear();
  const m = n.getMonth() + 1;
  const d = n.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

/**
 * Nearest appointment for doctor with appointmentDate today or in the future (local calendar).
 */
export const findNextAppointmentForDoctor = (appointments, doctorId) => {
  const id = Number(doctorId);
  if (Number.isNaN(id)) return null;
  const today = todayDateKeyLocal();
  const forDoctor = safeArray(appointments).filter((a) => Number(a?.doctorId) === id);
  const withKeys = forDoctor
    .map((a) => ({ a, key: toDateKey(a?.appointmentDate) }))
    .filter(({ key }) => key && key >= today)
    .sort((x, y) => x.key.localeCompare(y.key));
  return withKeys[0]?.a ?? null;
};

export const getErrorMessage = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data;
  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }
  if (data?.errors && typeof data.errors === "object") {
    const values = Object.values(data.errors);
    const first = values.find((v) => typeof v === "string" && v.trim());
    if (first) return first;
  }
  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  return fallback;
};
