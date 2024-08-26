# Web Crawler Frontend

## Table of Contents

- [Project Setup](#project-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Building the Application](#building-the-application)
  - [Running the Application Locally](#running-the-application-locally)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [API](#api)
- [Testing](#testing)
- [License](#license)
- [Author](#author)

## Project Setup

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 18.x or higher
- **Yarn**: Latest version

### Installation

1. **Clone the repository**:

```bash
git clone git@github.com:polrb5/web-crawler-frontend.git
cd web-crawler-frontend

```

2. **Install dependencies using Yarn:**:
   ```sh
   yarn install
   ```

#### Building the Application

To build the application (lint JavaScript and compile LESS files), run:

```sh
yarn build
```

#### Running the Application Locally

1. **Set up environment variables**: Create a `.env` file in the root directory with the following content::

   ```bash
    VITE_API_URL=http://your-api-url
   ```

   Replace http://your-api-url with the actual API URL you want to use. You can use the provided .env.templaate file as a template.

2. **Start the server**:
   ```bash
   yarn dev
   ```

## Usage

The Web Crawler Frontend provides an interface for users to interact with the web crawling service. Key features include:

- **User Registration and Login**: Allows users to register and log in to obtain authentication tokens.
- **Crawl Job Management**: Users can create crawl jobs by providing a URL, which the application then processes to find and store URLs from the specified site.
- **Job Status Retrieval**: Users can query the status and results of their crawl jobs.

The application provides endpoints to perform these actions, manage user authentication, and interact with the web crawling service.

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **TypeScript**: For type-safe development
- **Vite**: Build tool and development server
- **React Router DOM**: Routing library for React
- **Sass**: CSS preprocessor
- **Vitest**: Testing framework

## API

### Endpoints

#### `POST /graphql`

All API interactions are performed through a single GraphQL endpoint. Below are the key operations supported by the API:

#### **Create Job**

- **Mutation**: `createCrawlJob`
- **Description**: Creates a new crawl job with the provided URL.
- **Arguments**:
  - `url` (String): The root URL to crawl.
- **Response**:

  - `id` (String): Unique identifier of the job.
  - `url` (String): The URL that was crawled.
  - `status` (String): Status of the job.

  Example Request:

  ```graphql
  mutation {
    createCrawlJob(url: "https://example.com") {
      id
      url
      status
    }
  }
  ```

#### **Get Job Status**

- **Query**: `getCrawlJob`
- **Description**: Retrieves the status and results of a specific crawl job.
- **Arguments**:
  - `id` (String): The unique identifier of the job.
- **Response**:
  - `status` (String): Current status of the job (e.g., `PENDING`, `COMPLETED`, `FAILED`).
  - `foundUrls` (Array of Strings): List of URLs found during the crawl.

_Example Request_:

```graphql
query {
  getCrawlJob(id: "job-id") {
    status
    foundUrls
  }
}
```

#### **Mutation: login**

- **Description**: Authenticates a user and returns an authentication token.
- **Arguments**:
  - `email` (String): The user's email address.
  - `password` (String): The user's password.
- **Response**:
  - `token` (String): Authentication token for the user.

_Example Request_:

```graphql
mutation {
  login(email: "user@example.com", password: "password123") {
    token
  }
}
```

#### **Mutation: register**

- **Description**: Registers a new user and returns an authentication token.
- **Arguments**:
  - `email` (String): The user's email address.
  - `password` (String): The user's password.
- **Response**:
  - `token` (String): Authentication token for the user.

_Example Request_:

```graphql
mutation {
  register(email: "newuser@example.com", password: "password123") {
    token
  }
}
```

#### **Logout**

- **Action**: Removes the authentication token from local storage.

## Testing

- **Run Tests**:
  ```bash
  yarn test
  ```
- **Run Tests in watch Mode**:
  ```bash
  yarn test:watch
  ```

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License - see the LICENSE file for details.

## Author

Pol Reig
[polreigbroto@gmail.com](polreigbroto@gmail.com)
