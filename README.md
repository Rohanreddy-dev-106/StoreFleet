<table>
  <tr>
    <td width="200" align="center" style="padding: 20px;">
      <img src="Backend/public/images/Logo_2.png" alt="Project Logo" width="160" height="160"/>
    </td>
    <td style="padding: 20px;">
      <h1 style="margin: 0 0 16px 0; font-size: 2.5em;">StoreFleet</h1>
      <p style="font-size: 1.1em; line-height: 1.6; margin: 0 0 12px 0; color: #586069;">
        A robust Node.js/Express backend API for e-commerce applications with user authentication, product management, order processing, and review system.
      </p>
      <p style="margin: 8px 0 0 0;">
        <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version"/>
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
        <img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build"/>
      </p>
    </td>
  </tr>
</table>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
  - [User Routes](#user-routes)
  - [Product Routes](#product-routes)
  - [Order Routes](#order-routes)
  - [Management Routes](#management-routes)
- [Authentication](#-authentication)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### User Management
- OTP-based authentication (send & verify)
- User registration and login
- JWT token-based authentication
- Profile creation and updates
- Token refresh mechanism
- Secure logout functionality

### Product Management
- CRUD operations for products
- Text-based product search
- Category-based filtering
- Price range filtering
- Rating-based filtering
- Product details and descriptions

### Order & Cart System
- Shopping cart management (create, read, update, delete)
- Bulk cart operations (clear all items)
- Order placement
- Payment processing integration

### Review System
- User product reviews
- Duplicate review prevention
- Rating aggregation

### Admin Dashboard (Coming Soon)
- Total revenue tracking
- Order status breakdown
- Daily sales analytics
- Sales average calculations

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **OTP Service:** Custom OTP sender and validator
- **API Type:** RESTful API

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (see [Environment Variables](#-environment-variables))

4. Start the development server
```bash
npm start
```

The server should now be running on `http://localhost:3000` (or your configured port).

## 📚 API Documentation

### User Routes

Base URL: `/api/users`

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| POST | `/otp-send` | No | Send OTP to user's contact |
| POST | `/otp-verify` | No | Verify OTP code |
| POST | `/register` | No | Register new user account |
| POST | `/login` | No | User login |
| POST | `/creatprofile` | Yes | Create user profile |
| PUT | `/profile-update` | Yes | Update user profile |
| POST | `/refresh-Token` | Yes | Generate new access and refresh tokens |
| GET | `/get-profile` | Yes | Retrieve user profile |
| DELETE | `/logout` | Yes | User logout |

### Product Routes

Base URL: `/api/products`

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| POST | `/create` | Yes | Create new product (Admin) |
| PUT | `/update/:id` | Yes | Update product by ID (Admin) |
| GET | `/get-all` | No | Get all products |
| DELETE | `/delete/:id` | Yes | Delete product by ID (Admin) |

### Order Routes

Base URL: `/api/orders`

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| POST | `/create` | Yes | Add item to cart |
| GET | `/getall` | Yes | Get all cart items |
| PUT | `/update` | Yes | Update cart item |
| DELETE | `/delete/:id` | Yes | Remove item from cart |
| DELETE | `/deleteall` | Yes | Clear entire cart |
| POST | `/createorder/:id` | Yes | Place order for cart/item |
| POST | `/payment` | Yes | Process payment |

### Management Routes

Base URL: `/api/management`

**Available Features:**
- Search products by name, description, or category
- Get all products (Admin/Testing)
- Get product details by name
- Filter products by category
- Filter products by price range (min-max)
- Filter products by rating range
- Get total product count per category
- Remove users (Admin/Manager)
- Remove admins (Manager only)
- Create product reviews (with duplicate prevention)

**Upcoming Dashboard Features:**
- Total revenue calculation
- Order status breakdown
- Daily sales tracking
- Daily sales average

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the request headers.

### How to Authenticate

1. Register or login to receive JWT tokens
2. Include the token in subsequent requests:
```
Authorization: Bearer <your-jwt-token>
```

### OTP Authentication Flow

1. Send OTP to user's contact (`/otp-send`)
2. Verify the OTP code (`/otp-verify`)
3. Complete registration or login
4. Receive JWT access and refresh tokens

### Token Refresh

When your access token expires, use the `/refresh-Token` endpoint with your refresh token to obtain new tokens without re-authenticating.

## 📁 Project Structure

```
project-root/
│
├── users/
│   ├── users.routs.js
│   ├── users.controller.js
│   └── users.schema.js
│
├── products/
│   ├── product.routs.js
│   ├── product.controller.js
│   └── product.schema.js
│
├── orders/
│   ├── order.routs.js
│   ├── order.controller.js
│   └── order.schema.js
│
├── management/
│   ├── management.repo.js
│   └── review.schema.js
│
├── middlewares/
│   └── jwt.auth.js
│
├── util/
│   ├── otp.sender.js
│   ├── otp.validation.js
│   └── user_admin_management.js
│
└── Backend/
    └── public/
        └── images/
            └── Logo_2.png
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Secrets
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OTP Configuration
OTP_EXPIRY=10m
OTP_LENGTH=6

# Email/SMS Service (for OTP)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Payment Gateway
PAYMENT_API_KEY=your-payment-api-key
PAYMENT_SECRET=your-payment-secret
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESM (ES6 Modules) syntax
- Use meaningful variable and function names
- Add comments for complex logic
- Write clean, maintainable code
- Test your changes before submitting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions, issues, or suggestions, please open an issue on the repository or contact the maintainers.

---

**Note:** Some admin dashboard features are currently under development (marked as TODO in the codebase). Stay tuned for updates!
