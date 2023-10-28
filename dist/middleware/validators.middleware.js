"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = void 0;
const express_validator_1 = require("express-validator");
const validators = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            errors: result.array()
        });
    }
    next();
};
exports.validators = validators;
