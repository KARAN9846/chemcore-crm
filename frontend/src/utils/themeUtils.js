// Add new colors here when new themes are introduced
export const themeMap = {
  "#1f7a35": "Dark Green",
  "#2563eb": "Royal Blue",
  "#dc2626": "Crimson Red",
  "#9333ea": "Purple",
  "#f59e0b": "Amber",
};

export const normalizeHex = (color) => {
  if (!color) {
    return null;
  }

  let c = String(color).trim().toLowerCase();

  // Add # if missing
  if (!c.startsWith("#") && /^[0-9a-f]{6}$/.test(c)) {
    c = `#${c}`;
  }

  return c;
};

export const getThemeData = (color) => {
  const normalized = normalizeHex(color);

  if (!normalized) {
    return {
      name: "Custom Theme",
      color: "#999",
      isCustom: true,
    };
  }

  if (themeMap[normalized]) {
    return {
      name: themeMap[normalized],
      color: normalized,
      isCustom: false,
    };
  }

  return {
    name: "Custom Theme",
    color: normalized,
    isCustom: true,
  };
};
