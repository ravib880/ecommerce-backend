const { PrismaClient } = require("@prisma/client");
const Joi = require("joi");
const { storeErrorLogs } = require("../../helper/queryHelper");
const prisma = new PrismaClient();


const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
}).options({ abortEarly: false })

const createCategory = async (req, res) => {
    try {
        const { name, description } = req?.body;
        const thumbnail = req.file ? `/uploads/category/${req.file.filename}` : null;

        const categoryList = await prisma.category.findFirst({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive"
                }
            }
        })
        // If category name already defined then throw error 
        if (categoryList) {
            return res.status(400).json({ message: "The category name is already in use." });
        }

        // Insert new category in category table
        const categoryData = await prisma.category.create({
            data: { name, description, thumbnail }
        })

        // Return success response
        return res.status(201).json({
            data: categoryData,
            message: "Category created successfully!"
        });
    } catch (error) {
        // Return erroror response
        await storeErrorLogs({ module: "create-user", error })
        return res.status(500).json({ error: "Internal server error", details: error?.message ?? "unknown error occurs!" });
    }
}


module.exports = {
    categorySchema,
    createCategory,
}