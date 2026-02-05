"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModule = void 0;
const app_1 = require("../../app");
const checkModule = (moduleKey) => {
    return async (req, res, next) => {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const module = await app_1.prisma.companyModule.findFirst({
            where: {
                companyId,
                module: {
                    key: moduleKey,
                },
                isActive: true,
            },
        });
        if (!module) {
            return res
                .status(403)
                .json({
                error: `Module '${moduleKey}' is not active for this company`,
            });
        }
        next();
    };
};
exports.checkModule = checkModule;
