"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const ai_controller_1 = require("./ai.controller");
exports.aiRoutes = (0, express_1.Router)();
exports.aiRoutes.post("/chat", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN), ai_controller_1.AIControllers.chat);
