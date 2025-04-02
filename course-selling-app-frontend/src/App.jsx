import React from 'react';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import CourseDetail from "./pages/CourseDetail";
import { BasketProvider } from "./context/BasketContext";
import BasketPage from "./pages/BasketPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import MyCourseDetail from "./pages/MyCourseDetail";


export default function App() {
  return (
    <AuthProvider>
      <BasketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            {/* 👇 Layout wraps all pages that should show the navbar */}
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <CoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/mycourses/:id" element={<MyCourseDetail />} />
          </Routes>
        </BrowserRouter>
      </BasketProvider>
    </AuthProvider>
  );
}
