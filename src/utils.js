export const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export const escapeHtml = (unsafe) => (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const formatTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;
    let hour = parseInt(parts[0], 10);
    const mins = parts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${mins} ${ampm}`;
};

export const timeToMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

export const minsToTime = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};
