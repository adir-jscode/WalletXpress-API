# WalletXpress-API

A secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) built with Express.js and Mongoose.

## 🎯 Project Overview

DigitalXpress enables users to register, manage wallets, and perform core financial operations such as add money, withdraw, and send money. The system supports three roles: **admin**, **user**, and **agent**, each with specific permissions and capabilities.

## 🌐 Live Deployment

🔗 [Click to access the live API](https://wallet-xpress-api-v1.vercel.app/)

## 📄Postman API Documentation

🔗 [Postman API Documentation](https://documenter.getpostman.com/view/20685543/2sB3BEpAqj)

---

## 📦 Key Features

### 🔐 Security & Authentication

- **JWT-based authentication** for all roles
- **Password hashing** using bcrypt
- **Role-based authorization** middleware to protect sensitive routes
- **OTP-based email verification** via Nodemailer
- _Note: Sometimes emails may be delivered to the spam folder. Please check your spam/junk folder if you do not see the OTP or reset link in your inbox._

### 💼 Wallet Management

- Automatic wallet creation for **users** and **agents** at registration
- Initial balance of **৳50**
- Admins can **block/unblock wallets** instantly

### 🔁 Transaction Management

- Transactions are **atomic** — balance changes and logs update together
- Types: `add`, `withdraw`, `send`, `cash-in`, `cash-out`
- Track **amount, type, fee, commission, initiator, status**
- Status workflow: `pending → completed → reversed`

### 👥 Role-Specific Capabilities

- **Users:** Deposit, withdraw, send money, view personal transaction history
- **Agents:** Perform cash-in/cash-out for users, view commission history
- **Admins:** View all wallets/users/transactions, approve/suspend agents, set system parameters

### ✅ Core Validations

- Prevent transactions on **blocked wallets**
- Check **sufficient balance** before withdrawal or transfer
- Enforce valid receiver existence
- Disallow negative amounts

### 🧱 Modular Architecture

- Organized into feature modules: `auth/`, `user/`, `wallet/`, `transaction/`, `admin/`
- Clean separation of models, services, controllers, and routes

---

## 🏦 Wallet Management

- Wallets are automatically created for users and agents during registration ([`UserServices.createUser`](src/app/modules/user/user.service.ts)).
- Initial balance: ৳50.
- Only admins can block/unblock wallets ([`AdminServices.blockUnlockUserWallets`](src/app/modules/admin/admin.service.ts)).
- Blocked wallets cannot perform operations.

---

## 🔁 Transaction Management

- Transactions include: type, amount, fee, commission, initiator, status.
- Statuses: pending, completed, reversed.
- All balance updates and transaction records are atomic ([`WalletServices`](src/app/modules/wallet/wallet.service.ts)).
- Transaction history is available for users and agents.

---

## 👥 Roles

- **User**: Can add, withdraw, send money, and view transaction history.
- **Agent**: Can cash-in/cash-out for users, view commission history.
- **Admin**: Can view all data, block/unblock wallets, approve/suspend agents.

Roles are managed via a single User model with a `role` field ([`Role`](src/app/modules/user/user.interface.ts)).

---

## 🧠 Validations & Business Rules

- Insufficient balance, non-existent receiver, negative amounts are validated.
- Blocked wallets cannot perform transactions.
- Agents cannot cash-in/out for blocked wallets.
- All business rules enforced via service and middleware layers.

---

## 📜 Access & Visibility

- Users/agents can view their own wallet and transaction history.
- Admins can view all users, agents, wallets, and transactions.
- Data access is protected by role-based middleware ([`checkAuth`](src/app/middlewares/checkAuth.ts)).

---

## 🔐 Role-Based Control

- **Admin-only endpoints**: View all users/agents/wallets/transactions, block/unblock wallets, approve/suspend agents.
- **User-only endpoints**: Withdraw, send money, view own transactions.
- **Agent-only endpoints**: Cash-in/cash-out, view commission history.
- Authorization enforced via middleware.

## 🧩 API Endpoints

Below are the main API endpoints for DigitalXpress, organized by feature and role. All protected endpoints require JWT authentication and appropriate role access.

### Auth Endpoints

| Method | Endpoint                       | Access                    | Description                 |
| ------ | ------------------------------ | ------------------------- | --------------------------- |
| POST   | `/api/v1/auth/login`           | Public                    | Login and receive JWT       |
| POST   | `/api/v1/auth/refresh-token`   | Public                    | Refresh access token        |
| POST   | `/api/v1/auth/logout`          | Authenticated             | Logout and clear cookies    |
| POST   | `/api/v1/auth/change-password` | Authenticated (All Roles) | Change password             |
| POST   | `/api/v1/auth/forget-password` | Public                    | Request password reset link |
| POST   | `/api/v1/auth/reset-password`  | Public                    | Reset password using token  |

### User Endpoints

| Method | Endpoint              | Access | Description         |
| ------ | --------------------- | ------ | ------------------- |
| POST   | `/api/v1/user/`       | Public | Register user/agent |
| GET    | `/api/v1/user/users`  | Admin  | View all users      |
| GET    | `/api/v1/user/agents` | Admin  | View all agents     |

### OTP Endpoints

| Method | Endpoint             | Access | Description                             |
| ------ | -------------------- | ------ | --------------------------------------- |
| POST   | `/api/v1/otp/send`   | Public | Send OTP in email for user verification |
| GET    | `/api/v1/otp/verify` | Public | Verify OTP & update user details        |

### Wallet Endpoints

| Method | Endpoint                        | Access | Description                     |
| ------ | ------------------------------- | ------ | ------------------------------- |
| PATCH  | `/api/v1/wallet/add-money`      | Agent  | Agent adds money to user wallet |
| PATCH  | `/api/v1/wallet/withdraw-money` | User   | User withdraws money            |
| PATCH  | `/api/v1/wallet/send-money`     | User   | Send money to another user      |
| GET    | `/api/v1/wallet/`               | Admin  | View all wallets                |

### Transaction Endpoints

| Method | Endpoint                                  | Access     | Description                  |
| ------ | ----------------------------------------- | ---------- | ---------------------------- |
| GET    | `/api/v1/transaction/`                    | Admin      | View all transactions        |
| GET    | `/api/v1/transaction/transaction-history` | User/Agent | View own transaction history |

### Admin Endpoints

| Method | Endpoint                            | Access | Description               |
| ------ | ----------------------------------- | ------ | ------------------------- |
| PATCH  | `/api/v1/admin/block-unblock/:id`   | Admin  | Block/unblock user wallet |
| PATCH  | `/api/v1/admin/approve-suspend/:id` | Admin  | Approve/suspend agent     |

---

**Note:**

- All endpoints use RESTful conventions.
- Error responses and success messages are standardized.
- Role-based route protection is enforced

## 🏗️ Setup & Usage

### 1️⃣ Clone the repository\*

```sh
git clone https://github.com/yourname/DigitalXpress.git
cd DigitalXpress
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Configure environment variables

- Copy `.env.example` to `.env` and fill in required values (see [`env.ts`](src/app/config/env.ts)).

### 4️⃣ Run in development

```sh
npm run dev
```

### 5️⃣ Build & run in production

```sh
npm run build
npm start
```

---

## 🧩 Code Structure

- [`src/app/modules`](src/app/modules): Feature modules (user, wallet, transaction, auth, admin)
- [`src/app/middlewares`](src/app/middlewares): Error handling, validation, authentication
- [`src/app/utils`](src/app/utils): Utility functions (JWT, cookies, async handler)
- [`src/app/routes`](src/app/routes): API route definitions

---

## 📜 Error Handling

- Centralized error handler ([`globalErrorHandler`](src/app/middlewares/globalErrorHandler.ts))
- Consistent error responses with status codes and messages

## ⚙️ Tech Stack

- **Node.js** & **Express.js**: Backend framework for building RESTful APIs
- **MongoDB** & **Mongoose**: Database and ODM for data modeling and queries
- **JWT (jsonwebtoken)**: Secure authentication and role-based authorization
- **bcrypt**: Password hashing for user security
- **Nodemailer** – Email sending
- **Redis**: Temporary storage for OTP codes (valid for 2 minutes)
- **Zod**: Request validation

---
