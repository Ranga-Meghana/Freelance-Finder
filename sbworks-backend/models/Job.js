const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    budget: {
      type: String,
      required: true,
      trim: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
      index: true,
    },

    deadline: {
      type: Date,
      required: true,
      index: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "released"],
      default: "pending",
      index: true,
    },

    applications: [
      {
        freelancer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        status: {
          type: String,
          enum: ["applied", "accepted", "rejected"],
          default: "applied",
        },

        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

jobSchema.index(
  { _id: 1, "applications.freelancer": 1 },
  { unique: true, sparse: true }
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ client: 1, createdAt: -1 });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ skillsRequired: 1 });

module.exports = mongoose.model("Job", jobSchema);
