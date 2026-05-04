import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteSubscription, getSubscriptions } from "../api/subscriptionApi";
import Loader from "../components/Loader";
import SubscriptionCard from "../components/SubscriptionCard";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    category: "",
    billingCycle: "",
    isUsed: "",
    sortBy: "nextBillingDate",
    order: "asc",
    page: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const params = {};

        Object.keys(filters).forEach((key) => {
          if (filters[key]) {
            params[key] = filters[key];
          }
        });

        const data = await getSubscriptions(params);
        setSubscriptions(data.subscriptions || []);
        setPagination(
          data.pagination || {
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: data.length || 0,
            totalPages: 1,
          }
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setLoading(true);
    setError("");
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setError("");
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: nextPage,
    }));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this subscription?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteSubscription(id);
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.filter((subscription) => subscription._id !== id)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subscription");
    }
  };

  return (
    <section>
      <div className="page-header row-header">
        <div>
          <h1>Subscriptions</h1>
          <p className="muted">Filter, sort, edit, and remove your subscriptions.</p>
        </div>
        <Link className="button" to="/subscriptions/add">
          Add Subscription
        </Link>
      </div>

      <div className="filters">
        <input
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
        />

        <select name="billingCycle" value={filters.billingCycle} onChange={handleFilterChange}>
          <option value="">All billing cycles</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <select name="isUsed" value={filters.isUsed} onChange={handleFilterChange}>
          <option value="">All usage</option>
          <option value="true">Used</option>
          <option value="false">Unused</option>
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="price">Sort by price</option>
          <option value="nextBillingDate">Sort by next billing date</option>
        </select>

        <select name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading && <Loader text="Loading subscriptions..." />}
      {error && <p className="error">{error}</p>}

      {!loading && !error && subscriptions.length === 0 && (
        <p className="empty-state">No subscriptions found.</p>
      )}

      {!loading && !error && subscriptions.length > 0 && (
        <>
          <div className="subscription-list">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="button secondary"
              disabled={pagination.currentPage <= 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages || 1}
            </span>
            <button
              type="button"
              className="button secondary"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Subscriptions;
