import { envVars } from "../config/env";
import bcryptjs from "bcryptjs";
import {
  ApprovalStatus,
  IsActive,
  IUser,
  Role,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({ phone: envVars.ADMIN_PHONE });
    if (isAdminExist) {
      console.log("Admin already exist");
      return;
    }
    console.log("Trying to create admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const adminInfo: IUser = {
      name: envVars.ADMIN_NAME,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      phone: envVars.ADMIN_PHONE,
      address: envVars.ADMIN_ADDRESS,
      nid: envVars.ADMIN_NID,
      isActive: IsActive.ACTIVE,
      isVerified: true,
      role: Role.ADMIN,
      approvalStatus: ApprovalStatus.APPROVED,
    };

    await User.create(adminInfo);
    console.log("Admin created successfully");
  } catch (error) {
    console.log("Failed to create admin", error);
  }
};
