exports.roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ msg: "No Role Found" });
      }

      const userRole = req.user.role.toLowerCase();

      const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

     
      if (!normalizedRoles.includes(userRole)) {
        return res.status(403).json({ msg: "Access Denied" });
      }

      next();

    } catch (error) {
      console.log("ROLE ERROR:", error.message);
      return res.status(500).json({ msg: "Role Middleware Error" });
    }
  };
};