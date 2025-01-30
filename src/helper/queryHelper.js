const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const storeErrorLogs = async ({ error, module }) => {
    try {
        await prisma.errorLog.create({
            data: {
                message: error?.message || "Unknown error",
                details: error?.stack || "No stack trace available",
                module,
            },
        });
    } catch (logErr) {
        console.error("Failed to log error:", logErr);
    }
};

module.exports = {
    storeErrorLogs
}