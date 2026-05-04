export const getMonthlyPrice = (subscription) => {
  if (subscription.billingCycle === "yearly") {
    return subscription.price / 12;
  }

  return subscription.price;
};
