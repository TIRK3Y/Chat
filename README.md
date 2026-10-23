# Chat

An early-stage real-time chat application built with Node.js, Express, Socket.IO and MongoDB. It provides user registration and login with bcrypt-hashed passwords and JWT tokens, and a static Bootstrap front end with a chat window that exchanges messages over WebSockets.

## Features

- User registration and login endpoints (`POST /register`, `POST /login`)
- Password hashing with bcrypt and JWT issuance on login
- Socket.IO server that verifies the JWT on each incoming message, stores it in MongoDB and broadcasts it to a room
- Mongoose models for users, messages and chat rooms
- Static front end (HTML, Bootstrap 4, jQuery) with login and sign-up modals and a message panel, served by Express from `public/`
- Helper script to generate a random secret key (`generateSecretKey.js`)

## Tech stack

- Node.js, Express 4
- Socket.IO 4
- MongoDB with Mongoose 7
- bcrypt, jsonwebtoken
- Bootstrap 4 and jQuery (loaded from CDNs)

## Getting started

### Prerequisites

- Node.js and npm
- MongoDB (local by default: `mongodb://localhost:27017/testdb`, configurable with `MONGO_URI`)

### Install and run

```bash
cd chat
cp .env.example .env    # then set JWT_SECRET, e.g. from: node generateSecretKey.js
npm install
node server.js
```

Open http://localhost:3000 in a browser.

### Environment variables

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string (optional, defaults to the local `testdb`) |
| `JWT_SECRET` | Secret used to sign and verify login tokens (required) |
| `PORT` | Server port (optional, defaults to 3000) |

## Project structure

```
chat/
  server.js              Express and Socket.IO server, auth endpoints
  middleware/auth.js     JWT verification middleware
  models/                User, Message and ChatRoom models
  public/                Static front end (index.html, messages.html, scripts and styles)
  generateSecretKey.js   Prints a random hex key
```

## Notes

This project is a work in progress. These gaps remain before it runs end to end:

- The front end does not send the JWT or a room ID with messages, so the server rejects them.
- No socket handler joins clients to rooms, and the online-users list is never populated.
- Passwords are hashed both in the `/register` route and in the User model's pre-save hook, so logging in with a newly registered account fails.
- The Message model expects ObjectId references for `user` and `roomId`, but the server stores the username string.

## License

No license has been specified for this project.
