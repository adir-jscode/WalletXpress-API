"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const env_1 = require("../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExist = yield user_model_1.User.findOne({ phone: env_1.envVars.ADMIN_PHONE });
        if (isAdminExist) {
            console.log("Admin already exist");
            return;
        }
        console.log("Trying to create admin...");
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const adminInfo = {
            name: env_1.envVars.ADMIN_NAME,
            email: env_1.envVars.ADMIN_EMAIL,
            password: hashedPassword,
            phone: env_1.envVars.ADMIN_PHONE,
            address: env_1.envVars.ADMIN_ADDRESS,
            nid: env_1.envVars.ADMIN_NID,
            isActive: user_interface_1.IsActive.ACTIVE,
            isVerified: true,
            role: user_interface_1.Role.ADMIN,
            approvalStatus: user_interface_1.ApprovalStatus.APPROVED,
        };
        yield user_model_1.User.create(adminInfo);
        console.log("Admin created successfully");
    }
    catch (error) {
        console.log("Failed to create admin", error);
    }
});
exports.seedAdmin = seedAdmin;
