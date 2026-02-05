"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCompany = void 0;
const requireCompany = (req, res, next) => {
    if (!req.companyId) {
        return res.status(400).json({ error: "Company context missing" });
    }
    next();
};
exports.requireCompany = requireCompany;
