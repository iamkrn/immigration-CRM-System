import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Application from "./pages/Application";
import Document from "./pages/Document";
import Profile from "./pages/Profile";
import Students from "./pages/Students";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AddCustomer from "./Forms-pages/AddCustomer";
import ProtectedRoute from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoutes";
import EditCustomer from "./Forms-pages/EditCustomer";
import AddApplication from "./Forms-pages/AddApplication";
import EditApplication from "./Forms-pages/EditApplication";
import AddDocument from "./Forms-pages/AddDocument";
import RoleRoute from "./components/RoleRoute";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/*  PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/*  PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          
          {/* only Admin + Counsellor */}
                  <Route
                    path="customers"
                    element={
                      <RoleRoute allowedRoles={["admin", "counsellor"]}>
                        <Customer />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/add-customer"
                    element={
                      <RoleRoute allowedRoles={["admin", "counsellor"]}>
                        <AddCustomer />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="/edit-customer/:id"
                    element={
                      <RoleRoute allowedRoles={["admin", "counsellor"]}>
                        <EditCustomer />
                      </RoleRoute>
                    }
                  />

                  {/* only Admin */}
                  <Route
                    path="/edit-application/:id"
                    element={
                      <RoleRoute allowedRoles={["admin", "counsellor"]}>
                        <EditApplication />
                      </RoleRoute>
                    }
                  />

          <Route path="applications" element={<Application />} />
          <Route path="/documents/:applicationId" element={<Document />} />
          <Route path="add-document/:applicationId" element={<AddDocument />} />
          <Route path="profile" element={<Profile />} />

            <Route path="/students" element={<Students />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;