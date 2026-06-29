# Library Management API

Library Management API is a Node.js and Express REST API for managing a small library system. It stores authors, books, categories, and borrow records in MongoDB using Mongoose models.

## Features

- Manage authors with create, read, update, patch, and delete operations.
- Manage book categories.
- Manage books with author and category references.
- Search, filter, sort, and paginate the books list.
- Borrow books and automatically decrease stock.
- Return borrowed books and automatically increase stock.
- Validate request bodies with `express-validator`.
- Return consistent status text values: `success`, `fail`, and `error`.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- express-validator
- cors
- morgan
- dotenv
- nodemon
- nodemailer

## Project Structure

```text
.
|-- app.js
|-- server.js
|-- package.json
|-- Routes/
|   |-- All_Routes.js
|   |-- Authors.js
|   |-- books.js
|   |-- borrow.js
|   `-- categories.js
|-- controllers/
|   |-- authors.controller.js
|   |-- books.controller.js
|   |-- borrow.controller.js
|   `-- categories.controller.js
|-- middleware/
|   |-- author.validator.js
|   |-- book.validator.js
|   |-- borrow.validator.js
|   `-- category.validator.js
|-- models/
|   |-- Author.model.js
|   |-- Book.model.js
|   |-- Borrow.model.js
|   `-- Category.model.js
`-- utils/
    `-- HttpStatusText.js
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root. Example keys used by this project:

```env
# MongoDB connection
MONGO_URI=your_mongodb_connection_string

# App
PORT=3000
JWT_SECRET=your_jwt_secret

# Email (NodeMailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Start the server:

```bash
npm start
```

The server runs on the value of `port` from `.env`, or `3000` if no port is provided.

## Application Flow

- `server.js` loads environment variables, connects to MongoDB, and starts the HTTP server.
- `app.js` creates the Express app, enables CORS, logging, and JSON parsing, then mounts all API routes.
- `Routes/All_Routes.js` mounts the main route groups:
  - `/authors`
  - `/books`
  - `/borrow`
  - `/categories`
- Controllers contain the request logic.
- Models define MongoDB collections.
- Middleware files define validation rules for incoming request bodies.

## API Endpoints

### Authors

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | `/authors`     | Get all authors      |
| POST   | `/authors`     | Create an author     |
| GET    | `/authors/:id` | Get one author by ID |
| PUT    | `/authors/:id` | Replace an author    |
| PATCH  | `/authors/:id` | Update an author     |
| DELETE | `/authors/:id` | Delete an author     |

Author body fields:

```json
{
  "name": "Author Name",
  "bio": "Optional author biography",
  "birthDate": "1990-01-01"
}
```

### Categories

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | `/categories`     | Get all categories     |
| POST   | `/categories`     | Create a category      |
| GET    | `/categories/:id` | Get one category by ID |
| PUT    | `/categories/:id` | Replace a category     |
| PATCH  | `/categories/:id` | Update a category      |
| DELETE | `/categories/:id` | Delete a category      |

Category body fields:

```json
{
  "name": "Science Fiction"
}
```

### Books

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | `/books`     | Get all books      |
| POST   | `/books`     | Create a book      |
| GET    | `/books/:id` | Get one book by ID |
| PUT    | `/books/:id` | Update a book      |
| PATCH  | `/books/:id` | Replace a book     |
| DELETE | `/books/:id` | Delete a book      |

Book body fields:

```json
{
  "title": "Book Title",
  "description": "Optional book description",
  "price": 100,
  "stock": 5,
  "publishedYear": 2024,
  "author": "author_mongodb_id",
  "category": "category_mongodb_id"
}
```

Books list query parameters:

| Query      | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| `search`   | Searches book titles with a case-insensitive regex              |
| `category` | Filters by category ID                                          |
| `minPrice` | Filters books with price greater than or equal to this value    |
| `maxPrice` | Filters books with price less than or equal to this value       |
| `sort`     | Sorts using a Mongoose sort string, such as `price` or `-price` |
| `page`     | Page number, default is `1`                                     |
| `limit`    | Number of books per page, default is `5`                        |

Example:

```text
GET /books?search=node&minPrice=50&maxPrice=300&sort=-price&page=1&limit=10
```

### Borrow

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | `/borrow`            | Get all borrow records |
| POST   | `/borrow`            | Borrow a book          |
| PATCH  | `/borrow/:id/return` | Return a borrowed book |

Borrow body fields:

```json
{
  "bookId": "book_mongodb_id",
  "borrowerName": "Borrower Name"
}
```

When a book is borrowed, the API checks that the book exists and has stock available. If successful, it decreases the book stock by one and creates a borrow record.

When a book is returned, the API marks the borrow record as `returned`, sets `returnDate`, and increases the related book stock by one.

## Data Models

### Author

| Field       | Type   | Notes             |
| ----------- | ------ | ----------------- |
| `name`      | String | Required, trimmed |
| `bio`       | String | Optional, trimmed |
| `birthDate` | Date   | Optional          |

### Category

| Field  | Type   | Notes                     |
| ------ | ------ | ------------------------- |
| `name` | String | Required, unique, trimmed |

### Book

| Field           | Type     | Notes                              |
| --------------- | -------- | ---------------------------------- |
| `title`         | String   | Required, trimmed                  |
| `description`   | String   | Optional, trimmed                  |
| `price`         | Number   | Required, minimum `0`              |
| `stock`         | Number   | Required, minimum `0`, default `0` |
| `publishedYear` | Number   | Optional                           |
| `author`        | ObjectId | Required, references `Author`      |
| `category`      | ObjectId | Required, references `Category`    |

### Borrow

| Field          | Type     | Notes                                            |
| -------------- | -------- | ------------------------------------------------ |
| `book`         | ObjectId | Required, references `Book`                      |
| `borrowerName` | String   | Required, trimmed                                |
| `borrowDate`   | Date     | Defaults to current date                         |
| `returnDate`   | Date     | Set when returned                                |
| `status`       | String   | `borrowed` or `returned`, defaults to `borrowed` |

## Response Format

Successful responses generally use:

```json
{
  "status": "success",
  "data": {}
}
```

Validation and not-found responses generally use:

```json
{
  "status": "fail",
  "data": {}
}
```

Server or creation errors may use:

```json
{
  "status": "error",
  "message": "Error message"
}
```
