# Pastebin-Lite (MERN Stack)

A simple Pastebin-like web application built using the MERN stack (MongoDB, Express, React, Node.js).
Users can create text pastes, receive a shareable link, and view pastes with optional expiration constraints such as time-to-live (TTL) and maximum view count.

## Features

Create a text paste

Generate a shareable URL

View paste via API or HTML page

Optional constraints:

Time-based expiry (TTL)

View count limit

Paste becomes unavailable once any constraint is triggered

Safe rendering (no script execution)

Health check endpoint for automated testing

## Tech Stack

-- Backend

Node.js

Express.js

MongoDB (Mongoose)

dotenv

-- Frontend

React

Tailwind CSS

##vRunning the App Locally
1. Clone the repository
git clone https://github.com/your-username/pastebin-lite.git
cd pastebin-lite

2. Start Backend
cd backend
npm install
npm run dev

3. Start Frontend
cd client
npm install
npm run dev

## API Endpoints
-- Health Check
GET /api/healthz

-- Create Paste
POST /api/pastes

-- Fetch Paste (API)
GET /api/pastes/:id

-- View Paste (HTML)
GET /p/:id

## Persistence Layer

MongoDB is used as the persistence layer via Mongoose.

Reason:

Works reliably in serverless and deployed environments

Data persists across requests and server restarts

Simple schema for TTL and view count logic

## Design Decisions

TTL is calculated using expiresAt timestamp

View count is enforced atomically using MongoDB $inc

Deterministic testing supported via TEST_MODE and x-test-now-ms header

No in-memory storage used (safe for serverless deployment)

SPA fallback configured safely for React routing
