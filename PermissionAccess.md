# 🔐 Permission & Access Control Documentation

This document provides a detailed breakdown of the Authorization and Access Control Logic (ACL) implemented in the WorkBoard API. It is intended for developers and QA engineers to understand the security constraints applied to each endpoint.

---

## 🎭 Role Definitions

| Role            | Description                                                           |
| :-------------- | :-------------------------------------------------------------------- |
| **SUPER_ADMIN** | Global system owner. Overrides all ownership checks.                  |
| **ADMIN**       | System administrator. Full access to all user and task data.          |
| **LEADER**      | Project supervisor. Can manage tasks they created or are assigned to. |
| **MEMBER**      | Standard user. Restricted to viewing and executing assigned tasks.    |

---

## 🔑 Authentication Access

### Signup (User Creation)

- **Endpoint:** `POST /auth/signup`
- **Access:** `ADMIN`, `SUPER_ADMIN`
- **Constraint:** Access is denied to `LEADER` and `MEMBER` roles.
- **Business Logic:** If the email exists with a `DELETED` status, the system reactivates the account instead of creating a duplicate.

### Login

- **Endpoint:** `POST /auth/login`
- **Access:** `PUBLIC`
- **Logic:** Requires valid credentials. Returns JWT Access Token and Refresh Token.

### Access Token Refresh

- **Logic**: Synchronous verification of the long-lived Refresh Token.
- **Validation**: If the token is tampered with or expired, a `401 Unauthorized` is thrown immediately.
- **Output**: Returns a fresh `accessToken` with a shorter lifespan (typically 1h).

---

## 👥 User Management Access

### View User List

- **Endpoint:** `GET /user`
- **Access:** `ADMIN`, `SUPER_ADMIN`
- **Logic:** Non-admins receive a `403 Forbidden` error.

### View Single Profile

- **Endpoint:** `GET /user/:id`
- **Access:** `ADMIN`, `SUPER_ADMIN` OR `Owner`
- **Constraint:** A `MEMBER` or `LEADER` can only access this endpoint if the `:id` matches their own User ID.

### Update User Data

- **Endpoint:** `PATCH /user/:id`
- **Access:** `ADMIN`, `SUPER_ADMIN` OR `Owner`
- **Logic:** - `ADMIN` can update any user's role, status, or details.
  - `Owner` can update their own profile details.
  - Password updates trigger automatic re-hashing via `bcrypt`.

### Soft Delete User

- **Endpoint:** `DELETE /user/:id`
- **Access:** `ADMIN`, `SUPER_ADMIN`
- **Constraint:** Strict admin-only.
- **Logic:** Uses a Database Transaction. It permanently deletes all tasks where the target user was the assigner or assignee, then sets the user's status to `DELETED`.

### Upload Profile Photo

- **Endpoint:** `PATCH /user/profile-image/:id`
- **Method:** `multipart/form-data`
- **Access:** Any logged-in user (MEMBER AND LEADER updates their own profile, ADMIN can update any user profile photo).
- **Body Key:** `file` (The image file)
- **Constraints:** Max 5MB, formats: .jpg, .jpeg, .png.

---

## 📝 Task Management Access (Detailed Logic)

### Create Task

- **Endpoint:** `POST /task`
- **Access:** `LEADER`, `ADMIN`, `SUPER_ADMIN`
- **Constraint:** `MEMBER` role cannot create tasks.
- **Logic:** The `assignedById` is automatically locked to the ID of the authenticated user making the request.

### View Task List

- **Endpoint:** `GET /task`
- **Access:** `ALL AUTHENTICATED`
- **Filtering Logic:** - **Admins/SuperAdmins:** Can see every task in the database.
  - **Leaders/Members:** The query is automatically filtered to show only tasks where `assignedToId == currentUserId` OR `assignedById == currentUserId`.

### View Single Task

- **Endpoint:** `GET /task/:id`
- **Access:** `Involved Parties` or `Admin`
- **Logic:** Access is granted only if the user is the one who created the task, the one assigned to it, or holds an Admin role. Others receive `403 Forbidden`.

### Update Task

- **Endpoint:** `PATCH /task/:id`
- **Access:** `ADMIN`, `SUPER_ADMIN`, or `The Creator (Assigner)`
- **Detailed Constraints:**
  - **ADMIN / SUPER_ADMIN:** Can update **any** task in the system regardless of who created it.
  - **LEADER:** Can only update a task **IF** they are the `assignedBy` (the creator) of that specific task. If a Leader tries to update a task created by an Admin or another Leader, access is denied.
  - **MEMBER:** No update permissions.
- **Logic:** If `assignedToId` is changed, the system validates that the new user exists and is active.

### Delete Task (Permanent)

- **Endpoint:** `DELETE /task/delete/:id`
- **Access:** `ADMIN`, `SUPER_ADMIN`, or `The Creator (Assigner)`
- **Constraint:** Same ownership logic as the **Update Task** endpoint. A Leader cannot delete a task they did not personally create.

---

## ⚠️ Common Error States

| Status Code        | Meaning                  | Context                                                                          |
| :----------------- | :----------------------- | :------------------------------------------------------------------------------- |
| `401 Unauthorized` | Invalid Token            | Missing or expired JWT.                                                          |
| `403 Forbidden`    | Insufficient Permissions | A Leader trying to delete an Admin's task, or a Member trying to access `/user`. |
| `404 Not Found`    | Resource Missing         | Requesting a Task or User ID that does not exist in the database.                |
| `409 Conflict`     | Data Collision           | Trying to create a user with an email that is already active.                    |

---

## 🛠 Database Integrity Rules

1. **Uniqueness:** The `memberId` is a 6-digit numeric string. The `AuthService` runs a `while` loop to verify uniqueness against the database before every user creation.
2. **Atomicity:** All "Delete User" operations are wrapped in `this.prisma.$transaction`. This ensures that if the task deletion fails, the user is not accidentally marked as deleted, keeping the data consistent.
