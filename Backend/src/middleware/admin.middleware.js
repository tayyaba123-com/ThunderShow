export const isAdmin = (req, res, next) => {
   
    // 1. Check if user exists (was passed by the previous auth middleware)
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // 2. Check if the role is 'admin'
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: "Access Denied: You do not have admin permissions" 
        });
    }

    // 3. If everything is fine, proceed to the next function
    next();
};

export default isAdmin