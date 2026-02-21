# MERN Blog App

A full-stack blog application built with the **MERN Stack** — MongoDB, Express, React, Node.js.

## Features
- JWT-based authentication (register, login, logout)
- bcrypt password hashing
- Create / Read / Update / Delete blog posts with image uploads
- Client-side image preview & validation
- Add / Edit / Delete comments
- User profile with avatar, bio, update & delete account
- Protected routes (React Router + JWT)
- Context API for global auth state
- Fully responsive — Bootstrap 5

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Context API, Bootstrap 5 |
| Backend | Node.js, Express, Passport-free JWT auth |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Uploads | Multer |

## Project Structure

```
mern-blog/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/   authController, postController, profileController
│   ├── middleware/    auth.js (JWT protect), upload.js (Multer)
│   ├── models/        User.js, Post.js (embedded comments)
│   ├── routes/        auth.js, posts.js, profile.js
│   └── uploads/       (image files stored here)
└── frontend/
    └── src/
        ├── App.js             (routes)
        ├── context/           AuthContext.js
        ├── utils/             api.js (axios instance)
        ├── components/
        │   └── layout/        Navbar, PrivateRoute, Alert
        └── pages/
            ├── Home.js
            ├── Login.js / Register.js
            ├── PostsList.js / PostDetail.js
            ├── CreatePost.js / EditPost.js
            └── Profile.js / EditProfile.js
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm run dev              # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start                # runs on http://localhost:3000
```

> Make sure MongoDB is running locally, or use a MongoDB Atlas connection string.

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/posts | No | Get all posts |
| GET | /api/posts/:id | No | Get post by ID |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes | Update post |
| DELETE | /api/posts/:id | Yes | Delete post |
| POST | /api/posts/:id/comments | Yes | Add comment |
| PUT | /api/posts/:id/comments/:cid | Yes | Update comment |
| DELETE | /api/posts/:id/comments/:cid | Yes | Delete comment |
| GET | /api/profile | Yes | Get profile + posts |
| PUT | /api/profile | Yes | Update profile |
| DELETE | /api/profile | Yes | Delete account |
