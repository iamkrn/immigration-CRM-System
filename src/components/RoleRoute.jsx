import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Role allowed nahi hai toh dashboard pe bhejo
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleRoute;