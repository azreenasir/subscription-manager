const express = require("express");
const {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionInsights,
} = require("../controllers/subscriptionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/insights", getSubscriptionInsights);
router.route("/").get(getSubscriptions).post(createSubscription);
router.route("/:id").put(updateSubscription).delete(deleteSubscription);

module.exports = router;
