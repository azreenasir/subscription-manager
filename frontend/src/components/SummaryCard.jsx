function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <p>{title}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default SummaryCard;
