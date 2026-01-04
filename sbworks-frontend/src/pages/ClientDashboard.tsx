import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import API from "@/lib/axios";
import { Briefcase, Users, DollarSign, Mail } from "lucide-react";

const ClientDashboard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/my/posted");
      setJobs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (
    jobId: string,
    freelancerId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await API.put(`/jobs/${jobId}/applications/${freelancerId}`, { status });
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6"
        >
          My Posted Jobs
        </motion.h1>

        {loading && <p className="text-muted-foreground">Loading your jobs...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-muted-foreground">You haven’t posted any jobs yet.</p>
        )}

        <div className="space-y-6">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {job.title}
              </h2>

              <p className="text-muted-foreground mt-1">{job.description}</p>

              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                {job.budget}
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                <Users className="w-4 h-4 text-primary" />
                {job.applications.length} Applicants
              </div>

              {/* Applicants */}
              <div className="mt-4 space-y-3">
                {job.applications.map((app: any) => (
                  <div
                    key={app.freelancer._id}
                    className="flex items-center justify-between text-sm border rounded-lg p-3"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {app.freelancer.name} — {app.freelancer.email}
                    </span>

                    <div className="flex gap-2">
                      {app.status === "applied" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(
                                job._id,
                                app.freelancer._id,
                                "accepted"
                              )
                            }
                            className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(
                                job._id,
                                app.freelancer._id,
                                "rejected"
                              )
                            }
                            className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status !== "applied" && (
                        <span
                          className={`text-xs font-semibold ${
                            app.status === "accepted"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientDashboard;
