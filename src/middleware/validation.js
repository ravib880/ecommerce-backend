const { formValidationError } = require("../helper/helper");

const verifyValidation = (schema) => {
    return async (req, res, next) => {
        const { error } = await schema.validate(req?.body);

        if (error) {
            const formateError = formValidationError(error);
            if (formateError) {
                return res.status(403).json({ data: formateError, message: "Invalid Validation!" })
            }
        }

        next();
    }
}

module.exports = {
    verifyValidation
}