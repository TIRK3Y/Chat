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
- MongoDB running locally on the default port (the server connects to `mongodb://localhost:27017/testdb`)

### Install and run

```bash
cd chat
npm install
npm install cors body-parser
node server.js
```

`server.js` requires `cors` and `body-parser`, which are not listed in `package.json`, hence the second install command.

Open http://localhost:3000 in a browser.

### Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port (optional, defaults to 3000) |
| `JWT_SECRET` | Used by `middleware/auth.js` (the middleware is not currently wired into any route) |

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
- The MongoDB connection string and JWT secret are hard-coded in `server.js`.
- The `node_modules` directory is committed to the repository.

## License

No license has been specified for this project.
