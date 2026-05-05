import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const token = localStorage.getItem("token");

  
  if (token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoutes;