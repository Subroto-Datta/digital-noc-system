const authorize = (allowedRoles) => {
  return (req, res, next) => {

    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ error: 'Forbidden: User role not available.' });
    }

    // Check if the user's role is included in the array of roles allowed for this route
    if (allowedRoles.includes(userRole)) {
      next(); // User has a permitted role, so continue
    } else {
      res.status(403).json({ error: 'Forbidden: You do not have permission for this action.' });
    }
  };
};

module.exports = authorize;