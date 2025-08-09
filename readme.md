# DigitalXpress - Digital Wallet API

A secure, modular, and role-based backend API for a digital wallet system (similar to Bkash or Nagad) built with Express.js and Mongoose.

## 🎯 Project Overview

DigitalXpress enables users to register, manage wallets, and perform core financial operations such as add money, withdraw, and send money. The system supports three roles: **admin**, **user**, and **agent**, each with specific permissions and capabilities.

---

## 📦 Features

- **JWT-based Authentication**: Secure login for all roles.
- **Role-based Authorization**: Protects routes and operations based on user role.
- **Automatic Wallet Creation**: Wallets are created for users and agents during registration with an initial balance of ৳50.
- **Wallet Operations**:
  - Add money (top-up)
  - Withdraw money
  - Send money to other users
  - Cash-in/cash-out by agents
- **Transaction Management**: All transactions are stored and trackable.
- **Admin Controls**:
  - View all users, agents, wallets, and transactions
  - Block/unblock user wallets
  - Approve/suspend agents
- **Modular Code Architecture**: Organized by modules for scalability and maintainability.

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

---

## 🧩 API Endpoints

| Method | Endpoint                                  | Role   | Description                     |
| ------ | ----------------------------------------- | ------ | ------------------------------- |
| POST   | `/api/v1/auth/login`                      | All    | Login and receive JWT           |
| POST   | `/api/v1/auth/refresh-token`              | All    | Refresh access token            |
| POST   | `/api/v1/user/`                           | Public | Register user/agent             |
| GET    | `/api/v1/user/users`                      | Admin  | View all users                  |
| GET    | `/api/v1/user/agents`                     | Admin  | View all agents                 |
| PATCH  | `/api/v1/wallet/add-money`                | Agent  | Agent adds money to user wallet |
| PATCH  | `/api/v1/wallet/withdraw-money`           | User   | User withdraws money            |
| PATCH  | `/api/v1/wallet/send-money`               | User   | Send money to another user      |
| PATCH  | `/api/v1/wallet/cash-in`                  | Agent  | Agent cash-in to user wallet    |
| GET    | `/api/v1/wallet/`                         | Admin  | View all wallets                |
| GET    | `/api/v1/transaction/`                    | Admin  | View all transactions           |
| GET    | `/api/v1/transaction/transaction-history` | User   | View own transaction history    |
| PATCH  | `/api/v1/admin/:id`                       | Admin  | Change user wallet status       |
| PATCH  | `/api/v1/admin/block-unblock/:id`         | Admin  | Block/unblock wallet            |
| PATCH  | `/api/v1/admin/approve-suspend/:id`       | Admin  | Approve/suspend agent           |

---

## 🛠️ Setup & Usage

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in required values (see [`env.ts`](src/app/config/env.ts)).
4. **Run in development**
   ```sh
   npm run dev
   ```
5. **Build for production**
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

---

## 🧠 Optional Features

- Transaction fee system and agent commissions (structure ready for extension)
- Daily/monthly limits (can be added in wallet service)
- Notification system (can be added as needed)

---
