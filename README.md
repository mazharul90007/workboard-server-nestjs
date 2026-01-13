<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
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
- **Login** (ONLY REGISTERD USER)

### Post Management

- **Create Task** (LEADER, ADMIN, SUPER_ADMIN)
- **Get all Tasks** (ALL LOGGEDING USER)
- **Get a Specific Task by Id** (ALL LOGGEDIN USER)
- **Update a Specific Task by Id** (LEADER, ADMIN & SUPER_ADMIN)
- **Delete Task** (ADMIN & SUPER_ADMIN)

### User Management

- **Create User** (ADMIN & SUPER_ADMIN)
- **Get a Single User** (ADMIN & SUPER_ADMIN)
- **Get All Users** (ADMIN & SUPER_ADMIN)
- **Update User data** (ADMIN & SUPER_ADMIN)
- **Delete User** (ADMIN & SUPER_ADMIN)

---

## 🗂️ Entity Relationship Diagram (ERD)

<p align="center">
  <img src="https://res.cloudinary.com/dp6urj3gj/image/upload/v1766420684/Screenshot_2025-12-22_at_10.23.28_PM_y7kkgi.png" alt="Workboard ER Diagram" width="700"/>
</p>

---

## 🛠 Technology Stack

### Backend Framework

- **Node.js** - Runtime environment
- **Express.js** (v5.2.1) - Web framework
- **TypeScript** - Type-safe JavaScript

### Database

- **PostgreSQL** - Relational database
- **prisma** - ORM(Object–Relational Mapping) tool

### Validation

- **Zod** - TypeScript-first schema validation library

### Development Tools

- **tsx** (v4.21.0) - TypeScript execution
- **dotenv** (v17.2.3) - Environment variable management

### Deployment

- **Vercel** - Serverless deployment platform

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
git clone <repository-url>
cd workboard-server
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
CONNECTION_STR=your postgresql server connection url
```

**Required Environment Variables:**

- `PORT` - Server port number (default: 5173)
- `CONNECTION_STR` - PostgreSQL database connection string

### 4. Database Setup

The application automatically initializes the database tables on startup. Ensure your PostgreSQL database is running and accessible.

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
npm run dev
```

The server will start on `http://localhost:5173` (or your configured PORT).

### Production Mode

1. Build the project:

```bash
npm run build
```

2. Start the server:

```bash
node dist/src/server.js
```

### API Base URL ({{base_url}})

- **Development:** `http://localhost:5173/api/v1`
- **Production:** `https://workboard-server.vercel.app/api/v1`

### API Endpoints

#### Users

- `POST {{base_url}}/user` - Create a User.
- `GET {{base_url}}/user` - Get all users.
- `GET {{base_url}}/user/:id` - Get a specific User by his userId.
- `PATCH {{base_url}}/user/update/:id` - Update user
- `DELETE {{base_url}}/user/:id` - Delete a User

#### Tasks

- `POST {{base_url}}/task` - Create a task.
- `GET {{base_url}}/task` - Get all tasks.
- `GET {{base_url}}/task/:id` - Get a specific task by his taskId.
- `PATCH {{base_url}}/task/:id` - Update a specific task
- `DELETE {{base_url}}/task/:id` - Delete a task

---

## 📖 API Documentation

For detailed API documentation, request/response examples, and testing, visit:
**[Postman Documentation](https://documenter.getpostman.com/view/40157327/2sB3dWsnQB)**

---

## 📝 License

ISC

---

## 👤 Author

Mazharul Islam Sourabh

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📞 Support

For support, please visit the [API Documentation](https://documenter.getpostman.com/view/40157327/2sB3dWsnQB) or contact the development team.
