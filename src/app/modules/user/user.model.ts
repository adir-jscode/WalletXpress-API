import { model, Schema } from "mongoose";
import { ApprovalStatus, IsActive, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    nid: { type: String, unique: true, required: true },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.INACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    comissionRate: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ApprovalStatus,
      default: ApprovalStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
