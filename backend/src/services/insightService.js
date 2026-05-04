const getMonthlyPrice = (subscription) => {
  if (subscription.billingCycle === "yearly") {
    return subscription.price / 12;
  }

  return subscription.price;
};

const getDaysLeft = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const billingDate = new Date(date);
  billingDate.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((billingDate - today) / millisecondsPerDay);
};

const roundMoney = (amount) => {
  return Math.round(amount * 100) / 100;
};

const calculateInsights = (subscriptions) => {
  let totalMonthlyCost = 0;
  const categoryTotals = {};

  subscriptions.forEach((subscription) => {
    const monthlyPrice = getMonthlyPrice(subscription);
    totalMonthlyCost += monthlyPrice;

    categoryTotals[subscription.category] =
      (categoryTotals[subscription.category] || 0) + monthlyPrice;
  });

  const categoryBreakdown = Object.keys(categoryTotals).map((category) => ({
    category,
    total: roundMoney(categoryTotals[category]),
  }));

  categoryBreakdown.sort((a, b) => b.total - a.total);

  const topCategory =
    categoryBreakdown.length > 0 ? categoryBreakdown[0].category : "None";

  const upcomingRenewals = subscriptions
    .map((subscription) => ({
      name: subscription.name,
      nextBillingDate: subscription.nextBillingDate,
      daysLeft: getDaysLeft(subscription.nextBillingDate),
    }))
    .filter(
      (subscription) =>
        subscription.daysLeft >= 0 && subscription.daysLeft <= 7,
    )
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const unusedSubscriptions = subscriptions
    .filter((subscription) => subscription.isUsed === false)
    .map((subscription) => ({
      name: subscription.name,
      price: subscription.price,
      billingCycle: subscription.billingCycle,
    }));

  const potentialSavings = subscriptions
    .filter((subscription) => subscription.isUsed === false)
    .reduce((total, subscription) => total + getMonthlyPrice(subscription), 0);

  const roundedMonthlyCost = roundMoney(totalMonthlyCost);
  const roundedPotentialSavings = roundMoney(potentialSavings);
  const monthlyCostAfterSavings = roundMoney(
    totalMonthlyCost - potentialSavings,
  );
  const yearlyCostAfterSavings = roundMoney(monthlyCostAfterSavings * 12);

  const messages = [
    `You spend RM${roundedMonthlyCost}/month on subscriptions`,
    `Top category: ${topCategory}`,
    `Potential savings: RM${roundedPotentialSavings}/month`,
  ];

  return {
    totalMonthlyCost: roundedMonthlyCost,
    totalYearlyCost: roundMoney(totalMonthlyCost * 12),
    monthlyCostAfterSavings,
    yearlyCostAfterSavings,
    topCategory,
    categoryBreakdown,
    upcomingRenewals,
    unusedSubscriptions,
    potentialSavings: roundedPotentialSavings,
    messages,
  };
};

module.exports = {
  calculateInsights,
};
