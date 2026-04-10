/**
 * work of role-Middleware ----> 
 * 1-> check the role of user
 * 2-> that were allowed or not
 */




exports.roleMiddleware = (...allowedRoles) => {
    return (req,res,next) => {

        //take the role of user
        const userRoles =  req.user.role

        //checking of allowed or not
        if(!allowedRoles.includes(userRoles)){
            return res.status(403).json({msg:"Access Denied"})
        }
        //allow
        next();

    };

};