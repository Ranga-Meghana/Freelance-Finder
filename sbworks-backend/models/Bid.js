const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    proposal: {
      type: String,
      required: true,
      trim: true,
    },

    bidAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model("Bid", bidSchema);
