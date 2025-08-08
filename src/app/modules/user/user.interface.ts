import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  nid: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  wallet?: Types.ObjectId;
  comissionRate?: number;
  approvalStatus?: ApprovalStatus;
}
