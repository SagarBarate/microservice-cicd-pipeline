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
