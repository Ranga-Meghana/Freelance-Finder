import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import JobApplicants from "./pages/JobApplicants";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["client", "freelancer"]}>
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/freelancer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/jobs/:jobId/applicants"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <JobApplicants />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
