const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const { calculateInsights } = require("../services/insightService");

const allowedSortFields = ["name", "price", "billingCycle", "category", "nextBillingDate", "createdAt"];
const allowedUpdateFields = ["name", "price", "billingCycle", "category", "nextBillingDate", "isUsed"];

const getAllowedUpdates = (body) => {
  const updates = {};

  allowedUpdateFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

const getSubscriptions = async (req, res, next) => {
  try {
    const { category, billingCycle, isUsed, sortBy, order, page, limit } = req.query;
    const filter = { userId: req.user._id };

    if (category) {
      filter.category = category;
    }

    if (billingCycle) {
      filter.billingCycle = billingCycle;
    }

    if (isUsed === "true") {
      filter.isUsed = true;
    }

    if (isUsed === "false") {
      filter.isUsed = false;
    }

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "nextBillingDate";
    const sortOrder = order === "desc" ? -1 : 1;
    const shouldPaginate = page !== undefined || limit !== undefined;

    if (shouldPaginate) {
      const currentPage = Math.max(Number(page) || 1, 1);
      const itemsPerPage = Math.max(Number(limit) || 5, 1);
      const skip = (currentPage - 1) * itemsPerPage;

      const totalItems = await Subscription.countDocuments(filter);
      const subscriptions = await Subscription.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(itemsPerPage);

      res.json({
        subscriptions,
        pagination: {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages: Math.ceil(totalItems / itemsPerPage),
        },
      });
      return;
    }

    const subscriptions = await Subscription.find(filter).sort({ [sortField]: sortOrder });

    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const { name, price, billingCycle, category, nextBillingDate, isUsed } = req.body;

    if (!name || price === undefined || !billingCycle || !category || !nextBillingDate) {
      res.status(400);
      throw new Error("Name, price, billing cycle, category, and next billing date are required");
    }

    if (Number(price) <= 0) {
      res.status(400);
      throw new Error("Price must be a positive number");
    }

    const subscription = await Subscription.create({
      userId: req.user._id,
      name,
      price,
      billingCycle,
      category,
      nextBillingDate,
      isUsed,
    });

    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    if (req.body.price !== undefined && Number(req.body.price) <= 0) {
      res.status(400);
      throw new Error("Price must be a positive number");
    }

    const updates = getAllowedUpdates(req.body);

    const subscription = await Subscription.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found");
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid ID");
    }

    const subscription = await Subscription.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found");
    }

    res.json({
      message: "Subscription deleted successfully",
      deletedSubscriptionId: id,
    });
  } catch (error) {
    next(error);
  }
};

const getSubscriptionInsights = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id });
    const insights = calculateInsights(subscriptions);

    res.json(insights);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionInsights,
};
