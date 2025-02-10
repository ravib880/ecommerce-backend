const { PrismaClient } = require("@prisma/client");
const Joi = require("joi");
const crypto = require('crypto');
const { storeErrorLogs } = require("../../helper/queryHelper");
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const userSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(10).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/) // Ensures the mobile number starts with 6-9 and is exactly 10 digits
        .required()
        .messages({
            "string.pattern.base": "Mobile number must be a valid 10-digit number starting with 6-9",
            "string.empty": "Mobile number is required",
        }),
    gender: Joi.string().valid("male", "female", "other").optional(),
    password: Joi.string()
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.empty": "Password is required",
        }),
    addressLine1: Joi.string()
        .pattern(/^(?=.*\d)(?=.*[a-zA-Z]).+$/)
        .optional()
        .messages({
            "string.pattern.base": "Address must contain at least one digit and one character",
            "string.empty": "Address is required",
        }),
    addressLine2: Joi.string().optional(),
    city: Joi.string().min(1).optional(),
    state: Joi.string().min(1).optional(),
    country: Joi.string().min(1).optional(),
    pinCode: Joi.string()
        .pattern(/^\d{6}$/)
        .optional()
        .messages({
            "string.pattern.base": "Pincode must be a valid 6-digit number",
            "string.empty": "Pincode is required",
        }),
}).options({ abortEarly: false })

const generateToken = () => {
    return crypto.randomBytes(30).toString("hex");  // Random token (60 chars)
};

const createUser = async (req, res) => {
    try {
        const { name, email, mobile, password, addressLine1, addressLine2, city, state, country, pinCode } = req?.body;

        const findEmail = await prisma.user.findFirst({
            where: {
                email: {
                    contains: email,
                    mode: "insensitive"
                }
            }
        })

        if (findEmail) {
            return res.status(400).json({ message: "The email address is already in use." })
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        // Insert new user in user table
        const userData = await prisma.user.create({
            data: { name, email, mobile, password: securePassword, addressLine1, addressLine2, city, state, country, pinCode }
        })

        // Create token
        const token = generateToken();

        // Store created token on userToken table
        const userTokenData = await prisma.userToken.create({
            data: {
                userId: userData?.id,
                token,
            }
        })

        // Return success response
        return res.status(201).json({
            data: {
                ...userData,
                token: userTokenData?.token
            },
            message: "User created successfully!"
        });
    } catch (error) {
        // Return erroror response
        await storeErrorLogs({ module: "create-user", error })
        return res.status(500).json({ error: "Internal server error", details: error?.message ?? "unknown error occurs!" });
    }
}

const signInSchema = Joi.object({
    username: Joi.required(),
    password: Joi.required(),
    role: Joi.optional(),
}).options({ abortEarly: false })

const signInUser = async (req, res) => {
    try {
        const { username, password, role } = req?.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: {
                            equals: username,
                            mode: "insensitive"
                        }
                    },
                    {
                        mobile: username
                    }
                ]
            },
        })
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password!" })
        }

        const isValidPassword = await bcrypt.compare(password, user?.password)

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid username or password!" })
        }
        if (!user?.role == (role ?? "USER")) {
            return res.status(401).json({ error: "Access denied. Only admin can log in." })
        }

        // Create token
        const token = generateToken();

        // Store created token on userToken table
        const userTokenData = await prisma.userToken.create({
            data: {
                userId: user?.id,
                token,
            }
        })

        return res.status(200).json({ data: { ...user, token: userTokenData?.token }, message: "Login successfully!" })

    } catch (error) {
        // Return erroror response
        await storeErrorLogs({ module: "login-user", error })
        return res.status(500).json({ error: "Internal server error", details: error?.message ?? "unknown error occurs!" });
    }
}

const signOutSchema = Joi.object({
    token: Joi.required(),
}).options({ abortEarly: false })

const signOutUser = async (req, res) => {
    try {
        const { tempToken } = req?.body;
        const token = tempToken?.split(" ")[1]; // Assuming "Bearer <token>"

        const result = await prisma.userToken.deleteMany({
            where: {
                token
            },
        })

        if (result.count === 0) {
            return res.status(404).json({ error: "Token not found or already deleted" });
        }

        return res.status(200).json({ message: "Logout successfully!" })

    } catch (error) {
        // Return erroror response
        await storeErrorLogs({ module: "logout-user", error })
        return res.status(500).json({ error: "Internal server error", details: error?.message ?? "unknown error occurs!" });
    }
}

module.exports = {
    userSchema,
    createUser,
    signInSchema,
    signInUser,
    signOutSchema,
    signOutUser
}