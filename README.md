<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/MoonTory/rate-limited-api">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">rate-limited-api</h3>

  <p align="center">
    Example  rate-limited application developed with NodeJS & Redis
    <br />
    <a href="https://github.com/MoonTory/rate-limited-api"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/MoonTory/rate-limited-api/issues">Report Bug</a>
    ·
    <a href="https://github.com/MoonTory/rate-limited-api/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

# Table of Contents

- [Table of Contents](#table-of-contents)
	- [Description](#description)
	- [Motivation](#motivation)
	- [Application Overview](#application-overview)
		- [Core Package](#core-package)
			- [Rate-limiter Middlewares](#rate-limiter-middlewares)
			- [Scalability](#scalability)
		- [Client Package](#client-package)
		- [Containerization](#containerization)
	- [Requirements](#requirements)
	- [Prerequisites](#prerequisites)
	- [How to Run the Demo](#how-to-run-the-demo)
		- [Public Endpoints:](#public-endpoints)
		- [Private Endpoints:](#private-endpoints)
		- [Rate Limit Exceeded Response:](#rate-limit-exceeded-response)
	- [Built With](#built-with)
	- [Author(s)](#authors)
	- [License](#license)

## Description

'rate-limited-api' is a test project designed for a job interview to demonstrate an ability to implement a rate-limiting functionality in a Node.js server, without the use of any third-party rate-limiter libraries. The project is an Express.js server with custom middleware to rate limit concurrent user requests. The project repository is organized as a Yarn workspace and contains two packages, 'client' and 'core'. The 'client' package is a simple Node.js script that tests the API, while the 'core' package contains the server API, written in Typescript.

## Motivation

This project was created to show off an ability to adhere to strict requirements, and to demonstrate skills in planning and organizing a project. It is not just about the implementation of the rate-limiter, but also about project organization and the use of workspaces.

## Application Overview

The application is divided into two main packages: `core` and `client`.

### Core Package

The `core` package is the primary server, written in TypeScript.

#### Rate-limiter Middlewares

Three different rate-limiter middlewares were implemented:

1. **Fixed Window**: This approach divides time into fixed windows (e.g., every minute) and allows a specific number of requests in each window. Once the limit is reached, all further requests are blocked until the next window. Located at `./packages/core/server/middleware/rate-limit.middleware.ts`.
2. **Sliding Window**: Unlike the fixed window, the sliding window looks at a rolling time frame. If a user hits their limit, they would need to wait until their oldest request falls out of the current window before they can send another. Located at `./packages/core/server/middleware/rate-limit-sliding.middleware.ts`.

3. **Token Bucket**: In this method, tokens are added to a bucket at a fixed rate. A request consumes a token to proceed. If the bucket is out of tokens, the request is throttled. This offers some flexibility as it can allow for brief bursts of traffic. Located at `./packages/core/server/middleware/rate-limit-bucket.middleware.ts`.

Leveraging Redis' MULTI/EXEC transaction functionality, these middlewares ensure atomicity and concurrency between requests, effectively limiting the number of concurrent user requests to prevent server overloads.

#### Scalability

If needed, this solution could be further scaled by replicating the number of Docker containers running or using Node.js `cluster` mode to add more concurrency to the server. Since we are using Redis transactions, atomicity would be maintained across all containers, providing a robust and scalable solution for handling high load scenarios.

### Client Package

The `client` package is a simple Node.js script that sends requests to the server, serving to test the rate-limiting functionality.

### Containerization

All components of the application are containerized using Docker, allowing for quick and easy setup for development purposes using Docker Compose. This project structure ensures a high degree of scalability and ease of deployment, making it suitable for real-world applications beyond its original scope as a demonstration and test project.

## Requirements

The following requirements were addressed in the development of this project:

1. Implement a basic auth middleware. It could be just an uuid token passed in headers, or it could be a jwt. No need to implement login/register routes. You can just store the token somewhere (env, app, db).
2. Implement 2 types of routes: public and private. Private routes should use the auth middleware.
3. Implement a rate limiter. It should check a token limit for private routes and a ip limit for public routes.
4. The rate limit is set to 200 requests per hour per token
5. The rate limit is set to 100 requests per hour per IP
6. The token limit and IP limit values can be configured from the environment.
7. When a user reaches the limit, an error message is shown indicating the current limit for that user account and when (time) the user can make the next request.
8. Concurrency is kept in mind. The solution can handle multiple requests at the same time.
9. Performance was taken into consideration.
10. (Bonus) An optional task to create a different weight of request rate for every URL was also included: 1/2/5 points per request (assuming 5 different end points) depending on the end point.

## Prerequisites

- Node.js v18.13.0 or above. Use Node Version Manager to switch to the correct version with `nvm use 18.13.0`, or ensure your system has the latest version of Node.js installed.
- Docker installed on your machine.
- Docker Compose installed on your machine.

## How to Run the Demo

Follow these steps to get the demo up and running:

1. **Clone the Repository:**
   `git clone [repository-url]`

2. **Prerequisites:**
   Ensure you have `Node.js` and `Docker` installed. You can check by running:
   `node -v`
   `docker -v`

3. **Install Yarn:**
   If Yarn isn't installed, install it globally using: `npm install -g yarn`

4. **Install Dependencies:**
   Navigate to the project's root directory and run: `yarn`

5. **Setup Environment Variables:**
   Duplicate `.env.example` and rename the copy to `.env`. The variables are already set with default values, but you can modify them if needed.

6. **Start the Server:**
   Run the following command to build Docker images and run the server along with Redis containers: `yarn dev`

7. **Run the Client:**
   In a new terminal window, navigate to the client package directory: `cd packages/client`
   Then, start the client test script: `yarn start`

8. **Demo Output:**
   The script's output should resemble the image below:

<p align="center">
<img src="./assets/demo-output.png" alt="alt text" width="200"/>
</p>

9. **Alternative Testing Tools:**
   You can also test using tools like Apache Benchmark (pre-installed on MacOS) or the npm library `autocannon`.

### Public Endpoints:

The following are the available public endpoints:

- `http://localhost/v1/public/fixed/one`
- `http://localhost/v1/public/fixed/two`
- `http://localhost/v1/public/fixed/five`
- `http://localhost/v1/public/sliding/one`
- `http://localhost/v1/public/sliding/one`
- `http://localhost/v1/public/sliding/two`
- `http://localhost/v1/public/sliding/five`
- `http://localhost/v1/public/bucket/one`
- `http://localhost/v1/public/bucket/two`
- `http://localhost/v1/public/bucket/five`

### Private Endpoints:

Private endpoints require a valid JWT bearer token set in the headers.

> **Note:** Generate a new JWT token inside the `client` directory by running `npm run generate:jwt` or use the provided token in the example .env file.

- `http://localhost/v1/private/fixed/one`
- `http://localhost/v1/private/fixed/two`
- `http://localhost/v1/private/fixed/five`
- `http://localhost/v1/private/sliding/one`
- `http://localhost/v1/private/sliding/one`
- `http://localhost/v1/private/sliding/two`
- `http://localhost/v1/private/sliding/five`
- `http://localhost/v1/private/bucket/one`
- `http://localhost/v1/private/bucket/two`
- `http://localhost/v1/private/bucket/five`

### Rate Limit Exceeded Response:

If the rate limit is exceeded, the server will respond with a `429` error. The error body will look something like:

```json
{
	"retryAfter": 2864,
	"message": "Rate limit exceeded",
	"nextValidRequestTime": "2023-08-07T13:58:21.835Z"
}
```

- `retryAfter`: Represents the seconds remaining until the user can attempt another request.
- `nextValidRequestTime`: Indicates the exact time (in UTC) when the next request can be made.

## Built With

- [Typescript](https://www.typescriptlang.org/)
- [NodeJs](https://nodejs.org/en/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com)
- [Nginx](https://nginx.org/en/docs/)

## Author(s)

- **Gustavo Quinta** - _Initial work_ - [MoonTory](https://github.com/moontory)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
