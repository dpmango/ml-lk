// LINEAR NORMALIZATION
const normalize = (value, fromMin, fromMax, toMin, toMax) => {
  const pct = (value - fromMin) / (fromMax - fromMin);
  const normalized = pct * (toMax - toMin) + toMin;

  // Cap output to min/max
  if (normalized > toMax) return toMax;
  if (normalized < toMin) return toMin;
  return normalized;
};

export default normalize;
