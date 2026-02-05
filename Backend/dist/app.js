"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const routes_1 = __importDefault(require("./core/auth/routes"));
const routes_2 = __importDefault(require("./modules/accounting/routes"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "ERP Core Platform Running" });
});
// Routes will be mounted here
app.use("/api/auth", routes_1.default);
app.use("/api/accounting", routes_2.default);
exports.default = app;
