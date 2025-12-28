import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import API from "@/lib/axios";
import { User, Mail, Calendar } from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs/my/posted").then((res) => {
      const foundJob = res.data.find((j: any) => j._id === jobId);
      setJob(foundJob);
      setLoading(false);
    });
  }, [jobId]);

  if (loading) {
    return <p className="p-10 text-muted-foreground">Loading applicants...</p>;
  }

  if (!job) {
    return <p className="p-10 text-destructive">Job not found</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6"
        >
          Applicants for “{job.title}”
        </motion.h1>

        {job.applications.length === 0 && (
          <p className="text-muted-foreground">
            No applications yet.
          </p>
        )}

        <div className="space-y-4">
          {job.applications.map((app: any) => (
            <motion.div
              key={app.freelancer._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5"
            >
              <h2 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {app.freelancer.name}
              </h2>

              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {app.freelancer.email}
              </p>

              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4" />
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobApplicants;
