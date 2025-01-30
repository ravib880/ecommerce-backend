const formValidationError = (error) => {
    const errorList = {}

    if (error) {
        error?.details.forEach(details => {
            errorList[details?.context?.key] = details?.message?.replace(/"/g, '')?.replace(/([a-z])([A-Z])/g, "$1 $2")?.toLowerCase();
        })
    }
    return errorList;
}

module.exports = {
    formValidationError
}