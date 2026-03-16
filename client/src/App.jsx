import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ApplyInstructor from "./pages/auth/ApplyInstructor";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseList from "./pages/student/CourseList";
import CourseDetail from "./pages/student/CourseDetail";
import VideoPlayer from "./pages/student/VideoPlayer";
import QuizPlayer from "./pages/student/QuizPlayer";
import Certificate from "./pages/student/Certificate";
import Checkout from "./pages/student/Checkout";

// Faculty
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import CreateCourse from "./pages/faculty/CreateCourse";
import ManageCourses from "./pages/faculty/ManageCourses";
import UploadLesson from "./pages/faculty/UploadLesson";
import UploadQuiz from "./pages/faculty/UploadQuiz";
import StudentsList from "./pages/faculty/StudentsList";
import ManageDiscussions from "./pages/faculty/ManageDiscussions";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAllCourses from "./pages/admin/ManageAllCourses";
import FacultyRequests from "./pages/admin/FacultyRequests";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/apply-instructor" element={<ApplyInstructor />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/course/:id" element={<CourseDetail />} />

            {/* Student */}
            <Route
              path="/student"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/lesson/:lessonId"
              element={
                <ProtectedRoute roles={["student"]}>
                  <VideoPlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/quiz/:quizId"
              element={
                <ProtectedRoute roles={["student"]}>
                  <QuizPlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificate/:courseId"
              element={
                <ProtectedRoute roles={["student"]}>
                  <Certificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:id"
              element={
                <ProtectedRoute roles={["student"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Faculty */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/create-course"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/manage-courses"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <ManageCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/upload-lesson/:courseId"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <UploadLesson />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/upload-quiz/:courseId"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <UploadQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/students/:courseId"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <StudentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/discussions/:courseId"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <ManageDiscussions />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageAllCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/faculty-requests"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <FacultyRequests />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

