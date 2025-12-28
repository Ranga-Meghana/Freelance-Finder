import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "@/lib/axios";
import { DollarSign, Bookmark, CheckCircle } from "lucide-react";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    // fetch all jobs
    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });

    // ✅ fetch already applied jobs
    API.get("/jobs/my/applications").then((res) => {
      const ids = res.data.map((job: any) => job._id);
      setAppliedJobs(ids);
    });
  }, []);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = async (jobId: string) => {
    if (appliedJobs.includes(jobId)) return;

    try {
      await API.post(`/jobs/${jobId}/apply`);
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground">
            Find Your <span className="text-gradient-primary">Perfect</span> Project
          </h1>
          <p className="text-primary-foreground/70 mt-3">
            Browse jobs tailored to your skills
          </p>

          <div className="flex gap-4 mt-8 bg-card/90 p-4 rounded-xl">
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="gradient">Search</Button>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-muted-foreground">
            <span className="font-semibold text-foreground">
              {jobs.length}
            </span>{" "}
            jobs found
          </p>

          <div className="space-y-4">
            {jobs.map((job) => {
              const isApplied = appliedJobs.includes(job._id);

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-xl font-bold hover:text-primary"
                  >
                    {job.title}
                  </Link>

                  <p className="text-muted-foreground mt-1">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <DollarSign className="w-4 h-4" />
                    {job.budget}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant={isApplied ? "outline" : "gradient"}
                      disabled={isApplied}
                      onClick={() => handleApply(job._id)}
                      className="flex items-center gap-2"
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Applied
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleSaveJob(job._id)}
                    >
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
