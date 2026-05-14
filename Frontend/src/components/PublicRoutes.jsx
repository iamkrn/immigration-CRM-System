import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const token = localStorage.getItem("token");

  
  if (token) {
     const user = JSON.parse(localStorage.getItem('user'));
     const role = user?.role;
     if(role === 'admin' || role === 'superAdmin'){
       return <Navigate to='/admin/dashboard'/>
     }
       return <Navigate to='/'/>

  }

  return children;
};

export default PublicRoutes;