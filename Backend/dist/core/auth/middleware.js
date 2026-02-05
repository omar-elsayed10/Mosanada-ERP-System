"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const utils_1 = require("./utils");
const app_1 = require("../../app");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, utils_1.verifyToken)(token);
        const user = await app_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = user;
        req.companyId = user.companyId;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.authenticate = authenticate;
