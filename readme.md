# FinApp Backend

FinApp Backend is a financial management API built with **Express.js**, **Prisma**, and **JWT authentication**. It provides secure user authentication, transaction management, and budgeting features.

## 🚀 Features

- **User Authentication** (Register, Login, JWT-based Auth, Refresh Token)
- **Transaction Management** (Add, Edit, Delete transactions)
- **Budgeting System**
- **Multi-Currency Support**
- **Swagger API Documentation**

## 📌 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL/MySQL (via Prisma ORM)
- **Authentication**: JWT, Refresh Token
- **Deployment**: VPS

## 🔧 Installation

### 1️⃣ Clone the repository

```sh
git clone https://github.com/JovianNanda/finapp-backend.git
cd finapp-backend
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file and configure the following:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
PORT=5000
```

### 4️⃣ Run database migrations

```sh
npx prisma migrate dev --name init
```

### 5️⃣ Start the server

```sh
npm run dev
```

Server runs at: `http://localhost:5000`

## 📖 Swagger API Docs

Swagger documentation is available at:

```
http://localhost:5000/api/api-docs
```

## 🚀 Deployment Guide

### **Using VPS (e.g., NiagaHoster)**

1. Upload your project to the server.
2. Install dependencies: `npm install`
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `pm2 start npm --name finapp -- run start`

## 🛠️ Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

💡 **Need Help?** Contact me on GitHub or open an issue!
