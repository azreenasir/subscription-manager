import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../utils/formatCurrency";

function SubscriptionCard({ subscription, onDelete }) {
  return (
    <article className="subscription-card">
      <div>
        <h3>{subscription.name}</h3>
        <p className="muted">{subscription.category}</p>
      </div>

      <div className="subscription-details">
        <span>{formatCurrency(subscription.price)}</span>
        <span>{subscription.billingCycle}</span>
        <span>{formatDate(subscription.nextBillingDate)}</span>
        <span className={subscription.isUsed ? "status used" : "status unused"}>
          {subscription.isUsed ? "Used" : "Unused"}
        </span>
      </div>

      <div className="card-actions">
        <Link className="button secondary" to={`/subscriptions/edit/${subscription._id}`}>
          Edit
        </Link>
        <button type="button" className="button danger" onClick={() => onDelete(subscription._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default SubscriptionCard;
