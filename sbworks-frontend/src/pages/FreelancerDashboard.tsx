import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import API from "@/lib/axios";
import {
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const statusMap: any = {
  applied: {
    label: "Applied",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-600",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600",
  },
};

const FreelancerDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Extract logged-in userId from JWT
  const userId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    API.get("/jobs/my/applications")
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6"
        >
          My Job Applications
        </motion.h1>

        {loading && (
          <p className="text-muted-foreground">Loading applications...</p>
        )}

        {!loading && jobs.length === 0 && (
          <p className="text-muted-foreground">
            You haven’t applied to any jobs yet.
          </p>
        )}

        <div className="space-y-4">
          {jobs.map((job) => {
            const application = job.applications.find(
              (a: any) => a.freelancer._id === userId
            );

            const status = statusMap[application?.status || "applied"];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-5 shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    {job.title}
                  </h2>

                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    {job.budget}
                  </div>
                </div>

                <span
                  className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium ${status.className}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
