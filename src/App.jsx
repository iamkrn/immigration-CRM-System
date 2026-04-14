import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Application from "./pages/Application";
import Document from "./pages/Document";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AddCustomer from "./Forms-pages/AddCustomer";
import ProtectedRoute from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoutes";
import EditCustomer from "./Forms-pages/EditCustomer";

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
          <Route path="customers" element={<Customer />} />
          <Route path="add-customer" element={<AddCustomer/>}/>
          <Route path="/edit-customer/:id" element={<EditCustomer/>}/>
          <Route path="applications" element={<Application />} />
          <Route path="documents" element={<Document />} />
          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;