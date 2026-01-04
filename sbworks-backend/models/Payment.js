const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
      unique: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "released", "refunded"],
      default: "pending",
      index: true,
    },

    releasedAt: {
      type: Date,
    },

    refundedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ client: 1, status: 1 });
paymentSchema.index({ freelancer: 1, status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
