const { PrismaClient } = require("@prisma/client");
const { storeErrorLogs } = require("../helper/queryHelper");
const prisma = new PrismaClient();

const adminTokenVarify = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.token?.split(" ")[1]; // Assuming "Bearer <token>"
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Check if token exists in database
        const tokenList = await prisma.userToken.findFirst({
            where: { token: token }
        });
        
        if (!tokenList) {
            return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }

        // Check if existing token is related to admin only
        const userList = await prisma.user.findFirst({
            where: { id: tokenList?.userId }
        });

        if (userList?.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden: User don't authority to make/views changes!" });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        await storeErrorLogs({ module: "adminTokenVarify", error });
        return res.status(500).json({ 
            error: "Internal server error", 
            details: error?.message ?? "Unknown error occurred!" 
        });
    }
};

module.exports = {
    adminTokenVarify
};
