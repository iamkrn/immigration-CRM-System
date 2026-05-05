import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Application from "./pages/Application";
import Document from "./pages/Document";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

import AddCustomer from "./Forms-pages/AddCustomer";
import EditCustomer from "./Forms-pages/EditCustomer";
import AddApplication from "./Forms-pages/AddApplication";
import EditApplication from "./Forms-pages/EditApplication";
import AddDocument from "./Forms-pages/AddDocument";

import ProtectedRoute from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoutes";
import RoleRoute from "./components/RoleRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin","superAdmin"]}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<Students />} />
          <Route path="customers" element={<Customer />} />
          <Route path="applications" element={<Application />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-application" element={<AddApplication />} />
          <Route path="edit-application/:id" element={<EditApplication />} />

          </Route>

        {/* MAIN ROUTES — Student + Counsellor */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="applications" element={<Application />} />
          <Route path="/documents/:applicationId" element={<Document />} />
          <Route path="add-document/:applicationId" element={<AddDocument />} />
          <Route path="/students" element={<Students />} />

          {/* Admin + Counsellor only */}
          <Route path="customers" element={
            <RoleRoute allowedRoles={["admin", "counsellor", "superAdmin"]}>
              <Customer />
            </RoleRoute>
          } />
          <Route path="/add-customer" element={
            <RoleRoute allowedRoles={["admin", "counsellor", "superAdmin"]}>
              <AddCustomer />
            </RoleRoute>
          } />
          <Route path="/edit-customer/:id" element={
            <RoleRoute allowedRoles={["admin", "counsellor", "superAdmin"]}>
              <EditCustomer />
            </RoleRoute>
          } />
          <Route path="/add-application" element={
              <RoleRoute allowedRoles={["admin", "counsellor"]}>
                <AddApplication />
              </RoleRoute>
            } />
            <Route path="/edit-application/:id" element={
              <RoleRoute allowedRoles={["admin", "counsellor"]}>
                <EditApplication />
              </RoleRoute>
            } /></Route>

                  </Routes>
    </BrowserRouter>
  );
};

export default App;