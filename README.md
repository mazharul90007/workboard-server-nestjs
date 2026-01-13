<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A task management scalable server-side application.</p>
    <p align="center">

# WORK BOARD SERVER

**WORK BOARD SERVER** - WORK BOARD SERVER is a full-featured backend API for a task management platform. The platform supports user and assigned task management using modern backend technologies.

🌐 **Frontend Live URL:** [https://workboard-client.vercel.app](https://workboard-client.vercel.app)  
🌐 **Backend Live URL:** [https://workboard-server-nestjs.onrender.com](https://workboard-server-nestjs.onrender.com)  
🌐 **Frontend Github URL:** [https://github.com/mazharul90007/work-board-client](https://github.com/mazharul90007/work-board-client)  
📚 **API Documentation:** [Postman Documentation](https://documenter.getpostman.com/view/40157327/2sBXVfkBth)

---

## 🚀 Features

### Role Based Authorization

[MEMBER, LEADER, ADMIN, SUPER_ADMIN]

### Authentication with JWT

- **Create User** (ADMIN & SUPER_ADMIN)
- **Login** (PUBLIC)
- **Update Token** (PUBLIC)

### Post Management

- **Create Task** (LEADER, ADMIN, SUPER_ADMIN)
- **Get all Tasks** (ALL LOGGEDIN USER)
- **Get a Specific Task by Id** (ALL LOGGEDIN USER)
- **Update a Specific Task by Id** (LEADER, ADMIN & SUPER_ADMIN)
- **Delete Task** (ADMIN & SUPER_ADMIN)

### User Management

- **Create User** (ADMIN & SUPER_ADMIN)
- **Get a Single User** (ADMIN & SUPER_ADMIN)
- **Get All Users** (ADMIN & SUPER_ADMIN)
- **Update User data** (ADMIN & SUPER_ADMIN)
- **Delete User** (ADMIN & SUPER_ADMIN)

### Permission & Access Controll Documentation : [Click Here](https://github.com/mazharul90007/workboard-server-nestjs/blob/main/PermissionAccess.md)

---

## 🗂️ Entity Relationship Diagram (ERD)

<p align="center">
  <img src="https://res.cloudinary.com/dp6urj3gj/image/upload/v1768283268/workboard-nest_fasl74.png" alt="Workboard ER Diagram" width="700"/>
</p>

---

## 🛠 Technology Stack

### Backend Framework

- **Node.js** - Runtime environment
- **Nest.js** (v11.0.1) - Web framework
- **TypeScript** - Type-safe JavaScript

### Database

- **PostgreSQL** - Relational database
- **prisma** - ORM(Object–Relational Mapping) tool

### Security & Validation

- **Passport.js** - Authentication middleware.
- **Class-validator** - Decorator-based data validation for all DTOs.
- **Bcrypt** - Secure password encryption.

### Development Tools

- **tsx** (v4.21.0) - TypeScript execution
- **dotenv** (v17.2.3) - Environment variable management

### Deployment

- **Render** - Serverless deployment platform

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** package manager
- **PostgreSQL** database (local or remote)
- **Git**

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mazharul90007/workboard-server-nest.git
cd workboard-server-nest
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=5173
DATABASE_URL="postgresql://user:password@localhost:5432/workboard"
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
EXPIRES_IN=1h
```

**Required Environment Variables:**

- `PORT` - Server port number (default: 5173)
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_ACCESS_SECRET` - Secret to generate access token
- `JWT_REFRESH_SECRET` - Secret to generate refresh token

### 4. Database Setup

**Generate Prisma Client**

```
npx prisma generate
```

**Run Migrations**

```
npx prisma migrate dev --name init
```

**Database Tables:**

- `users` - User accounts
- `tasks` - User assigned tasks

### 5. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist` folder.

---

## 🎯 Usage Instructions

### Development Mode

Run the server in development mode with hot-reload:

```bash
npm run start:dev
```

The server will start on `http://localhost:5173` (or your configured PORT).

### Production Mode

1. Build the project:

```bash
npm run build
```

2. Start the compiled server:

```bash
npm run start:prod
```

### API Base URL ({{base_url}})

- **Development:** `http://localhost:5173`
- **Production:** `https://workboard-server-nestjs.onrender.com`

### API Endpoints

#### 🔑 Authentication

- `POST {{base_url}}/auth/signup` - Register a new user (**Admin/SuperAdmin Only**).
- `POST {{base_url}}/auth/login` - Authenticate and receive JWT tokens.
- `POST {{base_url}}/auth/refresh-token` - Update access token from Refresh token.

#### 👥 Users

- `GET {{base_url}}/user` - List all users with filters (**Admin/SuperAdmin Only**).
- `GET {{base_url}}/user/:id` - Get profile details (Self or Admin)
- `PATCH {{base_url}}/user/:id` - Update user information
- `DELETE {{base_url}}/user/:id` - Soft delete a user and clear their tasks

#### 📝 Tasks

- `POST {{base_url}}/task` - Create and assign a new task.
- `GET {{base_url}}/task` - Get all tasks with pagination and filters.
- `GET {{base_url}}/task/:id` - Get specific task details.
- `PATCH {{base_url}}/task/:id` - Update task status or priority.
- `DELETE {{base_url}}/task/:id` - Permanently remove a task.

---

## 📖 API Documentation

For detailed API documentation, request/response examples, and testing, visit:
**[Postman Documentation](https://documenter.getpostman.com/view/40157327/2sBXVfkBth)**

---

## 📝 License

ISC

---

## 👤 Author

Mazharul Islam Sourabh

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## 📞 Support

For support, please visit the [API Documentation](https://documenter.getpostman.com/view/40157327/2sBXVfkBth) or contact the development team.
