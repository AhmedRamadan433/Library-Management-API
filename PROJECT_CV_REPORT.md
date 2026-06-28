# Books API Project Report

## 1. Project Overview

Books API is a backend REST API for managing a small library system. The project is built with Node.js, Express.js, MongoDB, and Mongoose. It supports authentication, protected API routes, book inventory management, authors, categories, and book borrowing/return workflows.

The project demonstrates practical backend development skills including RESTful API design, database modeling, authentication with JWT, password hashing, request validation, centralized error handling, and MongoDB relationships using Mongoose references.

## 2. CV Summary

Developed a secure RESTful Books/Libraries Management API using Node.js, Express.js, MongoDB, and Mongoose. Implemented JWT-based authentication, password hashing with bcrypt, protected routes, CRUD operations for books, authors, and categories, search/filter/sort/pagination for books, and a borrowing system that automatically updates book stock when books are borrowed or returned.

## 3. Recommended CV Bullet Points

- Built a RESTful Library Management API using Node.js, Express.js, MongoDB, and Mongoose.
- Implemented JWT authentication with protected routes for books, authors, categories, and borrow operations.
- Secured user credentials using bcrypt password hashing and password confirmation validation.
- Designed MongoDB schemas for users, books, authors, categories, and borrow records with relationships between collections.
- Developed CRUD APIs for books, authors, and categories with request validation using express-validator.
- Added book search, category filtering, price filtering, sorting, and pagination.
- Implemented borrow and return workflows that automatically decrease and increase book stock.
- Built centralized async error handling and reusable custom error responses.
- Used environment variables for database connection, server port, JWT secret, and token expiration settings.
- Organized the backend using a clean MVC-style structure with routes, controllers, models, middleware, and utilities.

## 4. Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token, bcryptjs |
| Validation | express-validator |
| Logging | morgan |
| Environment Config | dotenv |
| API Security Basics | CORS, protected routes |
| Development Tooling | nodemon |

## 5. Project Structure

```text
Books/
|-- app.js
|-- server.js
|-- package.json
|-- README.md
|-- Routes/
|   |-- All_Routes.js
|   |-- Auth.js
|   |-- Authors.js
|   |-- books.js
|   |-- borrow.js
|   `-- categories.js
|-- controllers/
|   |-- Auth.controller.js
|   |-- authors.controller.js
|   |-- books.controller.js
|   |-- borrow.controller.js
|   `-- categories.controller.js
|-- middleware/
|   |-- AsyncWrapper.js
|   |-- author.validator.js
|   |-- book.validator.js
|   |-- borrow.validator.js
|   `-- category.validator.js
|-- models/
|   |-- Author.model.js
|   |-- Book.model.js
|   |-- Borrow.model.js
|   |-- Category.model.js
|   `-- User.model.js
`-- utils/
    |-- AppError.js
    |-- HttpStatusText.js
    `-- handleValidationErrors.js
```

## 6. Application Flow

1. `server.js` loads environment variables using dotenv.
2. The application connects to MongoDB using Mongoose and the `db_uri` environment variable.
3. `app.js` creates the Express app and registers CORS, request logging, JSON body parsing, and all API routes.
4. Public authentication routes are mounted first:
   - `POST /signup`
   - `POST /login`
5. After authentication routes, the API applies JWT protection middleware.
6. Protected resources are mounted:
   - `/authors`
   - `/books`
   - `/borrow`
   - `/categories`
7. Unknown routes return a 404 response.
8. Central error middleware returns consistent JSON error responses.

## 7. Main Features

### Authentication and Authorization

- User signup endpoint creates new users.
- User login endpoint validates email and password.
- Passwords are hashed with bcrypt before being saved.
- JWT tokens are generated after signup and login.
- Main API resources are protected using a Bearer token.
- The protection middleware verifies the token, checks that the user still exists, and checks whether the password changed after the token was issued.

### Books Management

- Create, read, update, replace, and delete books.
- Each book is linked to an author and category using MongoDB ObjectId references.
- Books support:
  - Title
  - Description
  - Price
  - Stock
  - Published year
  - Author reference
  - Category reference
- Book list supports:
  - Search by title with case-insensitive regex.
  - Filter by category.
  - Filter by minimum and maximum price.
  - Sort by any supported Mongoose sort string.
  - Pagination with `page` and `limit`.
- Book responses populate author and category names.

### Authors Management

- Create authors.
- Get all authors.
- Get a single author by ID.
- Replace author data using PUT.
- Partially update author data using PATCH.
- Delete authors.
- Validates author name, bio, and birth date.

### Categories Management

- Create categories.
- Get all categories.
- Get a single category by ID.
- Replace category data using PUT.
- Partially update category data using PATCH.
- Delete categories.
- Category names are unique in the database.

### Borrowing System

- Borrow a book using a book ID and borrower name.
- Validate that the book exists before creating a borrow record.
- Prevent borrowing when stock is unavailable.
- Automatically decrease book stock after borrowing.
- Return a borrowed book.
- Prevent returning the same borrow record twice.
- Automatically increase book stock after returning.
- Store borrow date, return date, and borrow status.

### Validation and Error Handling

- Uses `express-validator` to validate request bodies.
- Validation errors are converted into structured API errors.
- Uses a reusable `AppError` class for operational errors.
- Uses an `AsyncWrapper` middleware to catch async controller errors.
- Centralized Express error middleware returns consistent JSON responses.

## 8. API Endpoints

### Public Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/signup` | Create a new user and return a JWT token |
| POST | `/login` | Authenticate user and return a JWT token |

### Protected Authors Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/authors` | Get all authors |
| POST | `/authors` | Create a new author |
| GET | `/authors/:id` | Get author by ID |
| PUT | `/authors/:id` | Replace author data |
| PATCH | `/authors/:id` | Partially update author data |
| DELETE | `/authors/:id` | Delete author |

### Protected Books Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/books` | Get books with search, filters, sorting, and pagination |
| POST | `/books` | Create a new book |
| GET | `/books/:id` | Get book by ID |
| PUT | `/books/:id` | Replace book data |
| PATCH | `/books/:id` | Partially update book data |
| DELETE | `/books/:id` | Delete book |

### Protected Categories Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/categories` | Get all categories |
| POST | `/categories` | Create a new category |
| GET | `/categories/:id` | Get category by ID |
| PUT | `/categories/:id` | Replace category data |
| PATCH | `/categories/:id` | Partially update category data |
| DELETE | `/categories/:id` | Delete category |

### Protected Borrow Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/borrow` | Get all borrow records |
| POST | `/borrow` | Borrow a book |
| GET | `/borrow/:id` | Get borrow record by ID |
| PATCH | `/borrow/:id/return` | Return a borrowed book |

## 9. Database Models

### User

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, trimmed |
| `password` | String | Required, hidden by default using `select: false` |
| `passwordConfirm` | String | Required during signup, validates password match |
| `passwordChangedAt` | Date | Used to invalidate old JWT tokens |
| `createdAt`, `updatedAt` | Date | Added by timestamps |

### Book

| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | Required, trimmed |
| `description` | String | Optional, trimmed |
| `price` | Number | Required, minimum 1 |
| `stock` | Number | Required, minimum 0 |
| `publishedYear` | Number | Optional |
| `author` | ObjectId | Required, references Author |
| `category` | ObjectId | Required, references Category |
| `createdAt`, `updatedAt` | Date | Added by timestamps |

### Author

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, trimmed |
| `bio` | String | Optional, trimmed |
| `birthDate` | Date | Optional |
| `createdAt`, `updatedAt` | Date | Added by timestamps |

### Category

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, unique, trimmed |
| `createdAt`, `updatedAt` | Date | Added by timestamps |

### Borrow

| Field | Type | Notes |
| --- | --- | --- |
| `book` | ObjectId | Required, references Book |
| `borrowerName` | String | Required, trimmed |
| `borrowDate` | Date | Defaults to current date |
| `returnDate` | Date | Set when the book is returned |
| `status` | String | `borrowed` or `returned` |
| `createdAt`, `updatedAt` | Date | Added by timestamps |

## 10. Security Features

- JWT-based route protection.
- Bearer token authorization header support.
- Password hashing using bcrypt.
- Password field hidden by default in user queries.
- Password confirmation validation during signup.
- Token invalidation logic when a password changes.
- Request validation before database writes.
- Environment variables for sensitive configuration.
- `.env` and `node_modules` are ignored by Git.

## 11. Backend Concepts Demonstrated

- REST API design.
- MVC-style project organization.
- Express routing and middleware.
- MongoDB schema design with Mongoose.
- One-to-many style references between books, authors, categories, and borrow records.
- Authentication and protected resources.
- Async error handling pattern.
- Custom error class.
- Validation middleware.
- Query building for search, filtering, sorting, and pagination.
- Inventory/state update workflow for borrowing and returning books.

## 12. Strengths of the Project

- Clear separation between routes, controllers, models, middleware, and utilities.
- Practical library domain with real backend workflows.
- Authentication is integrated into the application instead of leaving all routes public.
- Book listing includes common production-style query features.
- Borrow/return logic changes stock automatically, which demonstrates business logic handling.
- Validation exists for create and update operations.
- Error handling is centralized and reusable.
- Mongoose population is used to return related author/category/book data in readable form.

## 13. Suggested Improvements

These are optional improvements that can make the project stronger for production or portfolio presentation:

- Add automated tests using Jest, Supertest, or a similar testing framework.
- Add API documentation with Swagger/OpenAPI.
- Add role-based authorization, such as admin and regular user permissions.
- Add refresh tokens or stronger token lifecycle management.
- Add rate limiting and security headers using packages such as `helmet` and `express-rate-limit`.
- Normalize response status text casing to one convention, such as `success`, `fail`, and `error`.
- Add indexes for frequently searched fields such as book title and category.
- Add transaction support for borrow/return stock updates to make inventory changes safer under concurrent requests.
- Add request validation for signup and login.
- Add deployment notes and example Postman collection.

## 14. Portfolio Description

Books API is a secure backend system for managing a library inventory. It includes user authentication, protected resource access, CRUD operations for authors, books, and categories, and a borrowing workflow that updates stock automatically. The API was built with Express.js and MongoDB using a modular structure that separates routes, controllers, models, validation middleware, and utilities.

## 15. Short LinkedIn / GitHub Description

Built a Node.js/Express REST API for a library management system with MongoDB and Mongoose. Features include JWT authentication, bcrypt password hashing, protected routes, CRUD operations, validation, search/filter/sort/pagination, and book borrow/return stock management.

## 16. Skills to List on CV

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- JWT Authentication
- bcrypt Password Hashing
- Express Middleware
- API Validation
- Error Handling
- MVC Architecture
- CRUD Operations
- Pagination, Filtering, Sorting
- Git and Environment Configuration

## 17. Final CV Entry Example

**Books API - Library Management Backend**

Built a secure RESTful backend API using Node.js, Express.js, MongoDB, and Mongoose for managing books, authors, categories, and borrowing records. Implemented JWT authentication, bcrypt password hashing, protected routes, request validation, centralized error handling, book search/filter/sort/pagination, and inventory updates when books are borrowed or returned.

