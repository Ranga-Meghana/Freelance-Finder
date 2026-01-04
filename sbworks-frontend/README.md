# React + TypeScript + Vite

SB Works – MERN Freelancing Platform

SB Works is a full-stack freelancing web application built using the MERN stack.
It connects clients with freelancers, allowing clients to post jobs and freelancers to apply, bid, and collaborate securely on projects.

The platform follows a client–server architecture, uses RESTful APIs, and stores data in MongoDB with proper schema design and relationships.

Tech Stack
Frontend

React.js

HTML5, CSS3, JavaScript

Bootstrap

Material UI

Axios

React Router

Backend

Node.js

Express.js

JWT Authentication

Database

MongoDB

Mongoose ODM

User Roles

Client

Post jobs

View applicants

Accept or reject freelancers

Review completed work

Freelancer

Browse available jobs

Apply for jobs

Track application status

View feedback and notifications

Admin

Manage users

Block/unblock accounts

Monitor jobs and platform activity

Core Features
Authentication & Authorization

Secure signup and login

JWT-based authentication

Role-based access control

Job Management

Clients can post jobs with budget and description

Freelancers can apply to jobs

Application status tracking (applied / accepted / rejected)

Notifications

Clients receive notifications when freelancers apply

Freelancers receive notifications on application updates

Reviews & Ratings

Clients can review freelancers after job completion

Freelancer profiles track completed jobs

Admin Controls

View all users

Block users when required

View all posted jobs

Database Collections (MongoDB)

Users

Jobs

Bids

Reviews

Notifications

Payments

Each collection uses:

ObjectId references

Indexing for performance

Timestamps for tracking activity

Project Structure
SB-Works/
│
├── sbworks-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
│
├── sbworks-frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│
└── README.md

Setup Instructions
Backend Setup
cd sbworks-backend
npm install
node index.js


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Frontend Setup
cd sbworks-frontend
npm install
npm run dev

API Architecture

RESTful APIs using Express.js

Axios for frontend–backend communication

Protected routes using JWT middleware

