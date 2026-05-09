import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSubscriptionById, updateSubscription } from "../api/subscriptionApi";
import Loader from "../components/Loader";

const emptyForm = {
  name: "",
  price: "",
  billingCycle: "monthly",
  category: "",
  nextBillingDate: "",
  isUsed: true,
};

const toDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().split("T")[0];
};

function EditSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const subscription = await getSubscriptionById(id);

        if (!subscription) {
          setError("Subscription not found");
          return;
        }

        setForm({
          name: subscription.name,
          price: subscription.price,
          billingCycle: subscription.billingCycle,
          category: subscription.category,
          nextBillingDate: toDateInputValue(subscription.nextBillingDate),
          isUsed: subscription.isUsed,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load subscription");
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateSubscription(id, {
        ...form,
        price: Number(form.price),
      });
      navigate("/subscriptions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subscription");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading subscription..." />;
  }

  return (
    <section className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Edit Subscription</h1>
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
          Used
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Subscription"}
        </button>
      </form>
    </section>
  );
}

export default EditSubscription;
