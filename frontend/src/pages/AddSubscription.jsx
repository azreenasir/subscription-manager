import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSubscription } from "../api/subscriptionApi";

const initialForm = {
  name: "",
  price: "",
  billingCycle: "monthly",
  category: "",
  nextBillingDate: "",
  isUsed: true,
};

function AddSubscription() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createSubscription({
        ...form,
        price: Number(form.price),
      });
      navigate("/subscriptions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Add Subscription</h1>
        {error && <p className="error">{error}</p>}

        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Price
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Billing cycle
          <select name="billingCycle" value={form.billingCycle} onChange={handleChange}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        <label>
          Category
          <input name="category" value={form.category} onChange={handleChange} required />
        </label>

        <label>
          Next billing date
          <input
            name="nextBillingDate"
            type="date"
            value={form.nextBillingDate}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          <input name="isUsed" type="checkbox" checked={form.isUsed} onChange={handleChange} />
          Is used
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Subscription"}
        </button>
      </form>
    </section>
  );
}

export default AddSubscription;
