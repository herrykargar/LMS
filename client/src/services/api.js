import axios from "axios";

const API = axios.create({
    baseURL: "/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("learnify_user"));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// AUTH
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");
export const applyInstructor = (data) =>
    API.post("/auth/apply-instructor", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// PUBLIC
export const getPublicStats = () => API.get("/users/public-stats");

// COURSES
export const getCourses = (params) => API.get("/courses", { params });
export const getCourse = (id) => API.get(`/courses/${id}`);
export const getMyCourses = () => API.get("/courses/my");
export const createCourse = (data) =>
    API.post("/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const updateCourse = (id, data) =>
    API.put(`/courses/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// LESSONS
export const getLessons = (courseId) => API.get(`/lessons/${courseId}`);
export const addLesson = (data) =>
    API.post("/lessons", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const updateLesson = (id, data) =>
    API.put(`/lessons/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const deleteLesson = (id) => API.delete(`/lessons/${id}`);

// QUIZZES
export const getQuizzes = (courseId) => API.get(`/quizzes/course/${courseId}`);
export const getQuiz = (id) => API.get(`/quizzes/${id}`);
export const createQuiz = (data) => API.post("/quizzes", data);
export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);
export const submitQuiz = (id, data) => API.post(`/quizzes/${id}/submit`, data);

// ENROLLMENT
export const enrollCourse = (courseId) => API.post("/enroll", { courseId });
export const getMyEnrollments = () => API.get("/enroll/my");
export const updateProgress = (courseId, lessonId) =>
    API.put(`/enroll/${courseId}/progress`, { lessonId });
export const checkEnrollment = (courseId) => API.get(`/enroll/check/${courseId}`);
export const getCourseStudents = (courseId) =>
    API.get(`/enroll/course/${courseId}/students`);

// USERS (admin)
export const getUsers = () => API.get("/users");
export const updateUserRole = (id, role) =>
    API.put(`/users/${id}/role`, { role });
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getStats = () => API.get("/users/stats");
export const getFacultyStats = () => API.get("/users/faculty-stats");
export const getFacultyRequests = (status) =>
    API.get("/users/faculty-requests", { params: status ? { status } : {} });
export const reviewFacultyRequest = (id, action) =>
    API.put(`/users/${id}/review`, { action });

// DISCUSSIONS
export const getDiscussions = (courseId) => API.get(`/discussions/course/${courseId}`);
export const createDiscussion = (data) => API.post('/discussions', data);
export const deleteDiscussion = (id) => API.delete(`/discussions/${id}`);
export const getReplies = (id) => API.get(`/discussions/${id}/replies`);
export const addReply = (id, data) => API.post(`/discussions/${id}/replies`, data);
export const deleteReply = (replyId) => API.delete(`/discussions/replies/${replyId}`);

export default API;
