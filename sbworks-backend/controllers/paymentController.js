const Payment = require("../models/Payment");
const Job = require("../models/Job");

exports.createPayment = async (req, res) => {
  const { jobId, amount } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const acceptedApplication = job.applications.find(
      (app) => app.status === "accepted"
    );

    if (!acceptedApplication) {
      return res.status(400).json({ message: "No accepted freelancer" });
    }

    const existingPayment = await Payment.findOne({ job: jobId });

    if (existingPayment) {
      return res.status(400).json({ message: "Payment already exists" });
    }

    const payment = await Payment.create({
      job: jobId,
      client: req.user.id,
      freelancer: acceptedApplication.freelancer,
      amount,
      status: "pending",
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.releasePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    payment.status = "released";
    await payment.save();

    res.json({ message: "Payment released successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ client: req.user.id }, { freelancer: req.user.id }],
    })
      .populate("job", "title budget")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
