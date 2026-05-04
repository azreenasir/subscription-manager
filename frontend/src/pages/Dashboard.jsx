import { useEffect, useState } from "react";
import { getInsights } from "../api/subscriptionApi";
import Loader from "../components/Loader";
import SummaryCard from "../components/SummaryCard";
import { formatCurrency, formatDate } from "../utils/formatCurrency";

function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await getInsights();
        setInsights(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="muted">Insights from your active subscriptions.</p>
      </div>

      <div className="summary-grid">
        <SummaryCard title="Monthly cost" value={formatCurrency(insights.totalMonthlyCost)} />
        <SummaryCard title="Yearly cost" value={formatCurrency(insights.totalYearlyCost)} />
        <SummaryCard title="Top category" value={insights.topCategory} />
        <SummaryCard title="Potential savings" value={formatCurrency(insights.potentialSavings)} />
      </div>

      <div className="content-grid">
        <div className="panel">
          <h2>Category breakdown</h2>
          {insights.categoryBreakdown.length === 0 ? (
            <p className="muted">No categories found.</p>
          ) : (
            <ul className="simple-list">
              {insights.categoryBreakdown.map((item) => (
                <li key={item.category}>
                  <span>{item.category}</span>
                  <strong>{formatCurrency(item.total)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel">
          <h2>Upcoming renewals</h2>
          {insights.upcomingRenewals.length === 0 ? (
            <p className="muted">No renewals in the next 7 days.</p>
          ) : (
            <ul className="simple-list">
              {insights.upcomingRenewals.map((renewal) => (
                <li key={`${renewal.name}-${renewal.nextBillingDate}`}>
                  <span>
                    {renewal.name} renews on {formatDate(renewal.nextBillingDate)}
                  </span>
                  <strong>{renewal.daysLeft} days</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel wide">
          <h2>Summarize</h2>
          

          {insights.messages.length === 0 ? (
            <p className="muted">No insights yet.</p>
          ) : (
            <ul className="message-list">
              {insights.messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}

          {insights.potentialSavings > 0 && (
            <div className="savings-summary">
              <div>
                <p className="muted">Monthly cost after savings</p>
                <strong>{formatCurrency(insights.monthlyCostAfterSavings)}</strong>
              </div>
              <div>
                <p className="muted">Yearly cost after savings</p>
                <strong>{formatCurrency(insights.yearlyCostAfterSavings)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
