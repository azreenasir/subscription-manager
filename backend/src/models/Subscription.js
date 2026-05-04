const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be a positive number"],
    },
    billingCycle: {
      type: String,
      required: [true, "Billing cycle is required"],
      enum: ["monthly", "yearly"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    nextBillingDate: {
      type: Date,
      required: [true, "Next billing date is required"],
    },
    isUsed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
