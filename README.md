# Mobiloitte Assignment

This project is a RESTful API built with Node.js, Express, TypeScript, MongoDB, RabbitMQ, and Redis. It includes user authentication, JWT token generation, and protected routes. Docker is used for containerization.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Testing](#testing)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- User registration and login
- Password hashing with bcrypt
- JWT token generation and validation
- Protected routes
- MongoDB for data storage
- RabbitMQ for messaging
- Redis for caching
- Docker for containerization
- Swagger API documentation

## Prerequisites

- Node.js (>= 14.x)
- Docker
- Docker Compose
- MongoDB
- RabbitMQ
- Redis

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/mobiloitte-assignment.git
   cd mobiloitte-assignment
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ``` 
3. **Create a .env file in the root directory with the following variables:**
   ```bash
   NODE_ENV=development
   PORT=8000
   MONGO_URI=
   MONGO_INITDB_ROOT_USERNAME=
   MONGO_INITDB_ROOT_PASSWORD=
   JWT_EXPIRE=
   JWT_COOKIE_EXPIRE=
   REDIS_HOST =
   REDIS_PORT =
   REDIS_PASSWORD =
   RABBITMQ_URI =
   RABBITMQ_DEFAULT_USER=
   RABBITMQ_DEFAULT_PASS=
   ```
## Usage
  # Running Locally
  1. **Start the server:**

   ```bash
   npm run dev
  ```
 1. **Access the API at http://localhost:8000.**
  ## API Documentation
  - Access the Swagger UI for API documentation at http://localhost:8000/api-docs.

## Routes
Auth Routes
* POST /api/v1/auth/register: Register a new user
  * Request Body:
  ```bash
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "password": "Password123@",
    }
   ```
* POST /api/v1/auth/login: Login a user
  * Request Body:
    ```bash
    {
      "email": "jane.doe@example.com",
      "password": "Password123@"
    }
    ```
* GET /api/v1/auth/me: Get current logged user information (Protected)
   * Headers:
       ```bash
       Authorization: Bearer <your-jwt-token>
       ```
### User Routes
* GET /api/v1/users: Get all users (Protected)
   * Headers:
       ```bash
       Authorization: Bearer <your-jwt-token>
       ```
* POST /api/v1/users: Create a new user (Protected)
   * Headers:
       ```bash
       Authorization: Bearer <your-jwt-token>
       ```
    * Request Body:
        ```bash
        {
          "name": "Jane Doe",
          "email": "jane.doe@example.com",
          "password": "Password123@",
         }
        ```
* GET /api/v1/users/{id} : Get a user by ID (Protected)
     * Headers:
         ```bash
           Authorization: Bearer <your-jwt-token>
         ```
* PUT /api/v1/users/{id} : Update a user by ID (Protected)
    * Headers:
         ```bash
         Authorization: Bearer <your-jwt-token>
         ```
   * Request Body:
    ```bash
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "password:"NewPassword123!"
    }
    ```
* DELETE /api/v1/users/{id} Delete a user by ID (Protected)
     * Headers:
         ```bash
         Authorization: Bearer <your-jwt-token>
         ```
## Testing

  ```bash
    npm test
  ```
## Docker
  # Building and Running with Docker Compose
  1. **Build and start the containers:**

   ```bash
   docker-compose up --build
  ```
or
```bash
   npm run docker:compose:up
  ```
2. **The API will be accessible at http://localhost:8000.**
## Environment Variables
Make sure to set the following environment variables in your .env file:
 ```bash
   NODE_ENV=development
   PORT=8000
   MONGO_URI=
   MONGO_INITDB_ROOT_USERNAME=
   MONGO_INITDB_ROOT_PASSWORD=
   JWT_EXPIRE=
   JWT_COOKIE_EXPIRE=
   REDIS_HOST =
   REDIS_PORT =
   REDIS_PASSWORD =
   RABBITMQ_URI =
   RABBITMQ_DEFAULT_USER=
   RABBITMQ_DEFAULT_PASS=
   ```
