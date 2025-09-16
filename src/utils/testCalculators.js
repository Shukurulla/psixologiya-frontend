// Frontend test utilities
// Note: Main calculations are done on backend for security

export const formatTestTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} daqiqa`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} soat ${mins > 0 ? `${mins} daqiqa` : ""}`;
};

export const getProgressColor = (percent) => {
  if (percent >= 80) return "#52c41a";
  if (percent >= 60) return "#1890ff";
  if (percent >= 40) return "#faad14";
  return "#ff4d4f";
};

export const getSeverityText = (severity) => {
  const severityMap = {
    normal: "Normal",
    mild: "Yengil",
    moderate: "O'rta",
    severe: "Og'ir",
  };
  return severityMap[severity] || severity;
};

export const getSeverityColor = (severity) => {
  const colorMap = {
    normal: "success",
    mild: "processing",
    moderate: "warning",
    severe: "error",
  };
  return colorMap[severity] || "default";
};

export const getTestCategoryName = (category) => {
  const categoryMap = {
    EMOTIONAL: "Emosional testlar",
    PERSONALITY: "Shaxsiyat testlari",
    CLINICAL: "Klinik testlar",
  };
  return categoryMap[category] || category;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateCompletionPercentage = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getTemperamentName = (type) => {
  const temperamentMap = {
    choleric: "Xolerik",
    sanguine: "Sangvinik",
    phlegmatic: "Flegmatik",
    melancholic: "Melanxolik",
  };
  return temperamentMap[type] || type;
};

export const getShapeName = (shape) => {
  const shapeMap = {
    kvadrat: "Kvadrat",
    "to'g'ri_to'rtburchak": "To'g'ri to'rtburchak",
    uchburchak: "Uchburchak",
    aylana: "Aylana",
    zigzag: "Zigzag",
  };
  return shapeMap[shape] || shape;
};

export const getOrientationName = (orientation) => {
  const orientationMap = {
    self: "O'ziga yo'nalganlik",
    others: "Odamlarga yo'nalganlik",
    activity: "Faoliyatga yo'nalganlik",
  };
  return orientationMap[orientation] || orientation;
};

// Chart color schemes
export const chartColors = {
  primary: ["#1890ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"],
  gradient: {
    blue: ["#e6f4ff", "#bae0ff", "#91caff", "#69b1ff", "#4096ff", "#1677ff"],
    green: ["#f6ffed", "#d9f7be", "#b7eb8f", "#95de64", "#73d13d", "#52c41a"],
    red: ["#fff1f0", "#ffccc7", "#ffa39e", "#ff7875", "#ff4d4f", "#f5222d"],
  },
};

// Test status helpers
export const isTestCompleted = (test) => {
  return test?.isCompleted === true;
};

export const isTestSensitive = (test) => {
  return test?.isSensitive === true;
};

export const canViewTestResult = (test, userRole) => {
  if (userRole === "admin") return true;
  if (isTestSensitive(test)) return false;
  return isTestCompleted(test);
};

// Statistics helpers
export const calculateAverageScore = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
};

export const groupByCategory = (items, categoryKey) => {
  return items.reduce((groups, item) => {
    const category = item[categoryKey];
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

export const sortByCompletion = (items) => {
  return [...items].sort((a, b) => {
    const aCompletion = a.completionRate || 0;
    const bCompletion = b.completionRate || 0;
    return bCompletion - aCompletion;
  });
};

export default {
  formatTestTime,
  getProgressColor,
  getSeverityText,
  getSeverityColor,
  getTestCategoryName,
  formatDate,
  calculateCompletionPercentage,
  getTemperamentName,
  getShapeName,
  getOrientationName,
  chartColors,
  isTestCompleted,
  isTestSensitive,
  canViewTestResult,
  calculateAverageScore,
  groupByCategory,
  sortByCompletion,
};
