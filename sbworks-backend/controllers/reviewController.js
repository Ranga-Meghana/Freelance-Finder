const Review = require("../models/Review");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createReview = async (req, res) => {
  const { jobId, rating, feedback } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const freelancerApplication = job.applications.find(
      (app) => app.status === "accepted"
    );

    if (!freelancerApplication) {
      return res.status(400).json({
        message: "No accepted freelancer for this job",
      });
    }

    const review = await Review.create({
      job: jobId,
      client: req.user.id,
      freelancer: freelancerApplication.freelancer,
      rating,
      feedback,
    });

    await User.findByIdAndUpdate(freelancerApplication.freelancer, {
      $inc: { completedJobs: 1 },
    });

    await Notification.create({
      user: freelancerApplication.freelancer,
      title: "New Review",
      message: "A client has submitted a review for your completed job",
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Review already submitted" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsForFreelancer = async (req, res) => {
  try {
    const reviews = await Review.find({
      freelancer: req.params.freelancerId,
    })
      .populate("client", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
