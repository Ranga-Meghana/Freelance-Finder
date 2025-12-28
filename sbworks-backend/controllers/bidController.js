const Bid = require("../models/Bid");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createBid = async (req, res) => {
  const { proposal, bidAmount, deliveryTime } = req.body;
  const jobId = req.params.jobId;

  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "freelancer" || user.isBlocked) {
      return res.status(403).json({ message: "Not allowed to bid" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const acceptedBidExists = await Bid.findOne({
      job: jobId,
      status: "accepted",
    });

    if (acceptedBidExists) {
      return res.status(400).json({ message: "Bidding closed" });
    }

    const bid = await Bid.create({
      job: jobId,
      freelancer: req.user.id,
      proposal,
      bidAmount,
      deliveryTime,
    });

    await Notification.create({
      user: job.client,
      title: "New Bid Received",
      message: `A freelancer placed a bid on "${job.title}"`,
    });

    res.status(201).json(bid);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bid already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getBidsForJob = async (req, res) => {
  try {
    const bids = await Bid.find({ job: req.params.jobId })
      .populate("freelancer", "name email skills rating")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user.id })
      .populate("job", "title budget")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBidStatus = async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const bid = await Bid.findById(req.params.bidId).populate("job");

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (status === "accepted") {
      await Bid.updateMany(
        { job: bid.job._id, _id: { $ne: bid._id } },
        { status: "rejected" }
      );
    }

    bid.status = status;
    await bid.save();

    await Notification.create({
      user: bid.freelancer,
      title: "Bid Update",
      message: `Your bid for "${bid.job.title}" was ${status}`,
    });

    res.json({ message: `Bid ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
