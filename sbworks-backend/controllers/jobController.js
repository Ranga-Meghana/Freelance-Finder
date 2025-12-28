const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");

const createJob = async (req, res) => {
  const { title, description, budget } = req.body;

  const user = await User.findById(req.user.id);
  if (!user || user.role !== "client") {
    return res.status(403).json({ message: "Only clients can post jobs" });
  }

  const job = await Job.create({
    title,
    description,
    budget,
    client: req.user.id,
  });

  res.status(201).json(job);
};

const getJobs = async (req, res) => {
  const jobs = await Job.find()
    .populate("client", "name email")
    .sort({ createdAt: -1 });

  res.json(jobs);
};

const applyJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const alreadyApplied = job.applications.some(
    (a) => a.freelancer.toString() === req.user.id
  );

  if (alreadyApplied) {
    return res.status(400).json({ message: "Already applied" });
  }

  job.applications.push({ freelancer: req.user.id });
  await job.save();

  await Notification.create({
    user: job.client,
    title: "New Application",
    message: `Someone applied for ${job.title}`,
  });

  res.json({ message: "Applied successfully" });
};

const getMyApplications = async (req, res) => {
  const jobs = await Job.find({
    "applications.freelancer": req.user.id,
  }).populate("client", "name email");

  res.json(jobs);
};

const getMyPostedJobs = async (req, res) => {
  const jobs = await Job.find({ client: req.user.id })
    .populate("applications.freelancer", "name email");

  res.json(jobs);
};

const updateApplicationStatus = async (req, res) => {
  const { jobId, freelancerId } = req.params;
  const { status } = req.body;

  const job = await Job.findOne({
    _id: jobId,
    client: req.user.id,
    "applications.freelancer": freelancerId,
  });

  if (!job) {
    return res.status(404).json({ message: "Not found" });
  }

  const application = job.applications.find(
    (a) => a.freelancer.toString() === freelancerId
  );

  application.status = status;
  await job.save();

  res.json({ message: "Status updated" });
};

module.exports = {
  createJob,
  getJobs,
  applyJob,
  getMyApplications,
  getMyPostedJobs,
  updateApplicationStatus,
};
