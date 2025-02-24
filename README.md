# Project 3: Momentum Map Backend

This is the back-end of Project 3 - Momentum Map. This server uses Express to receive request and communicate with MongoDB.

# Technology

1. Node.js
2. Express.js
3. MongoDB
4. JWT Authentication
5. bcrypt

# Routes + Model + Descriptions:

Below are the routes used.

## Authentication

- POST /auth/sign-up : Registers new user.
- POST /auth/sign-in : User Login

## Users

Contains Username and hashed password.
Creates "User" reference for the below models.

- GET /users: Get all users.
- GET /users/:userId: Get a specific user via params.

## Values

Uses "User" reference
Contains 10 personal values.

- POST /values: Creates user values
- GET /values/:userId: Get values for a user
- GET /values/matches: find users with matching values.
- PUT /values/update: Update user values.

## Friends

Contains "User" reference in Recipient and Requester.

- POST /friends/request: Send a friend request.
- PUT /friends/accept: List pending friend request.
- PUT /friends/accept/update Accept Friend request.
- GET /friends/userId : Get all friends for a user.
- DELETE /friends/:userId: Remove a friend (Remove both* copies)
  *both: upon updating of status from "pending" to "accepted" in "/accept/update", it creates a copy of the same data with the recipient and requester reversely stored.

## Messages

Uses "User" reference for Sender and Receiver.

- POST /messages : Sends a message.
- GET /messages/:userId : Get messages for a user.
- DELETE /messages/:messageId : Delete a message.
