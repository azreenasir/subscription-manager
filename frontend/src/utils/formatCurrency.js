export const formatCurrency = (amount) => {
  const number = Number(amount) || 0;
  return `RM ${number.toFixed(2)}`;
};

export const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
