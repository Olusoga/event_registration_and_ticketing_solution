# Event Ticket Booking System

## Overview

Welcome to the Event Ticket Booking System! 🎟️ This Node.js application is crafted to provide a seamless experience for event ticket management, showcasing advanced development skills. The project emphasizes asynchronous programming, concurrency handling, and a clean RESTful API design—all while embracing Test-Driven Development (TDD) principles.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Design Choices](#design-choices)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Event Initialization**: Set up events with a specified number of tickets.
- **Concurrent Bookings**: Handle multiple ticket bookings simultaneously, ensuring users have a smooth experience.
- **Waiting List Management**: When tickets are sold out, users can easily join a waiting list to get notified when tickets become available.
- **Booking Cancellations**: Users can cancel their bookings, and those on the waiting list will automatically get the chance to purchase the newly available ticket.
- **Rate Limiting**: Protect the API from abuse with rate limiting.
- **Comprehensive Error Handling**: Every edge case is managed, ensuring clear and informative responses.
- **Swagger Documentation**: Easily explore and understand the API with automated documentation.

## Technologies Used

- **Node.js**: The backbone of the application, providing a non-blocking, event-driven architecture.
- **NestJS**: A powerful framework for building scalable server-side applications with a focus on modularity.
- **TypeORM**: For seamless database interactions and migrations.
- **PostgreSQL**: A robust RDBMS for storing our order details.
- **Swagger**: For generating interactive API documentation.
- **Jest**: To ensure that our code is well-tested and reliable.
- **Rate-limiter-flexible**: For enforcing rate limits on our API endpoints.
- **Class-validator**: To validate user inputs efficiently.

## Getting Started

Let’s get this project up and running!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/event-ticket-booking-system.git
   cd event-ticket-booking-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your database**:
   - Ensure you have PostgreSQL installed and running.
   - Create a new database and adjust the configuration in the `.env` file accordingly.

4. **Run the migrations**:
   ```bash
   npm run typeorm migration:run
   ```

5. **Start the application**:
   ```bash
   npm run start:dev
   ```

6. **Explore the API**:
   - Head over to `http://localhost:3000/api` to check out the interactive Swagger documentation.

## API Endpoints

Here’s a quick rundown of the available endpoints:

### 1. Initialize Event

- **POST** `/initialize`
- **Request Body**:
  ```json
  {
    "eventId": "string",
    "totalTickets": "number"
  }
  ```
- **Purpose**: Kickstarts a new event with the specified number of tickets.

### 2. Book Ticket

- **POST** `/book`
- **Request Body**:
  ```json
  {
    "userId": "string",
    "eventId": "string"
  }
  ```
- **Purpose**: Allows a user to book a ticket. If tickets are sold out, they’re added to the waiting list.

### 3. Cancel Booking

- **POST** `/cancel`
- **Request Body**:
  ```json
  {
    "userId": "string",
    "eventId": "string"
  }
  ```
- **Purpose**: Cancels a user’s booking and assigns the ticket to the next person on the waiting list, if applicable.

### 4. Get Event Status

- **GET** `/status/:eventId`
- **Purpose**: Fetches the current status of the event, including available tickets and the count of people on the waiting list.

## Design Choices

- **Concurrency Handling**: I’ve utilized optimistic locking and NestJS transactions to handle potential race conditions effectively. This ensures our ticket booking process is both reliable and efficient.
- **Data Management**: TypeORM has been my go-to for managing database interactions and schema migrations—making our lives easier when evolving the data model.
- **API Documentation**: Swagger is integrated to provide real-time documentation, making it easier for developers (and future me!) to understand how to interact with the API.
- **Rate Limiting**: I’ve added a layer of protection against potential abuse by implementing rate limiting with the `rate-limiter-flexible` library.

## Testing

Testing is at the heart of this project. Here’s how it’s structured:

- **Unit Tests**: Every core functionality has been meticulously tested.
- **Integration Tests**: Comprehensive coverage for all API endpoints—aiming for at least 80% coverage overall.
- **Run Tests**:
  ```bash
  npm run test
  ```

## Contributing

I’m always open to contributions! If you have suggestions or find issues, feel free to open a pull request or an issue on GitHub.

## License

This project is licensed under the MIT License. Check out the [LICENSE](LICENSE) file for details.

## Project Structure

Here's a quick overview of the project structure:

```
src
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── modules
│   ├── core
│   │   ├── core.service.ts
│   │   ├── core.service.spec.ts
│   │   ├── core.module.ts
│   │   ├── core.controller.ts
│   │   └── core.controller.spec.ts
│   ├── events
│   │   ├── events.controller.ts
│   │   ├── events.controller.spec.ts
│   │   ├── events.module.ts
│   │   ├── events.service.ts
│   │   └── events.service.spec.ts
│   ├── users
│   │   ├── users.controller.ts
│   │   ├── users.controller.spec.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── users.service.spec.ts
├── logger
│   ├── logger.module.ts
│   └── logger.service.ts
├── enums
│   └── booking-status.enum.ts
├── database
│   ├── entities
│   │   ├── booking.entity.ts
│   │   ├── event.entity.ts
│   │   ├── user.entity.ts
│   │   └── waiting_list.entity.ts
│   └── migrations/
├── config
│   └── typeorm.config.ts
├── common
│   └── all-exception-filter.ts

```

This structure promotes modularity and maintainability, allowing for easy navigation and updates to different parts of the application.
