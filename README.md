# LogiFleet Backend API

LogiFleet is a comprehensive RESTful API designed for fleet management. It handles the lifecycle of trucks, trailers, and tires, manages driver trips, generates mission order PDFs, and automates maintenance alerts based on mileage rules.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication with Role-Based Access Control (Admin/Driver).
- **Vehicle Management**:
  - **Trucks**: CRUD operations, status tracking (Available, In Service, Maintenance).
  - **Trailers**: Management of trailer capacity and attachment status.
  - **Tires**: Tracking of tire mileage, expected life, and maintenance status.
- **Trip Management**:
  - Create and manage trips.
  - Automatic mileage calculation upon trip finalization.
  - **PDF Generation**: Downloadable Mission Orders for drivers.
- **Maintenance System**:
  - Configurable maintenance rules (Oil change, Tires, Technical review).
  - **Automated Alerts**: System checks mileage against rules to generate alerts.
  - **Cron Jobs**: Daily automated checks for tire health.
- **Reporting**: Dashboard statistics for total kilometers, fuel consumption, and pending maintenance.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Testing**: [Jest](https://jestjs.io/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Code Quality**: [SonarQube](https://www.sonarqube.org/)
- **PDF Generation**: PDFKit
- **Scheduling**: Node-cron

## 📂 Project Structure

```bash
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
└── app.js
test/
```

## ⚙️ Environment Variables (Summary)

To run this project, you will need to add the following environment variables to your `.env` file (see `.env.example`):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port number for the server | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/logifleet` |
| `JWT_SECRET` | Secret key for signing tokens | `your_super_secret_key` |
| `JWT_EXPIRES_IN` | Token expiration time | `1d` |

## 🚀 Getting Started (Quickstart)

### Local Installation (Manual)

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/logifleet-backend.git
    cd logifleet-backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment**

    Create a `.env` file in the root directory and fill in the variables as shown above.

4. **Run the server**

    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

### 🐳 Docker Setup (Containerized)

The project includes a [`Dockerfile`](Dockerfile) and `docker-compose.yml` for easy deployment.

1. **Build and Run with Docker Compose**

    ```bash
    docker-compose up --build
    ```

2. **Run with Dockerfile only**

    ```bash
    # Build the image
    docker build -t logifleet-api .

    # Run the container
    docker run -p 3000:3000 --env-file .env logifleet-api
    ```

## 🧪 Testing (Jest)

This project uses **Jest** for unit and integration testing.

```bash
npm test

npm test -- --coverage
```

## 🔍 SonarQube Analysis (Code Quality)

We use SonarQube to ensure code quality, security, and test coverage.

![SonarQube Dashboard](https://github.com/user-attachments/assets/sonarqube-screenshot.png)

### Prerequisites for SonarQube

1. A running SonarQube server (e.g., via Docker: `docker run -d --name sonarqube -p 9000:9000 sonarqube`).
2. `sonar-scanner` installed globally or configured in your CI/CD pipeline.

### Running the SonarQube Analysis

1. **Generate Coverage Report**:
    Ensure you have generated the `lcov.info` file using Jest:

    ```bash
    npm test -- --coverage
    ```

2. **Run the Scanner**:
    Execute the scanner pointing to your SonarQube server.

    ```bash
    sonar-scanner \
      -Dsonar.projectKey=LogiFleet \
      -Dsonar.sources=src \
      -Dsonar.tests=test \
      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
      -Dsonar.host.url=http://localhost:9000 \
      -Dsonar.login=YOUR_SONAR_TOKEN
    ```

## 📡 API Endpoints (Reference)

### Authentication Endpoints

- `POST /api/register` - Register a new user.
- `POST /api/login` - Login and receive JWT.
- `GET /api/profile` - Get current user profile.

### Truck Endpoints

- `GET /api/trucks` - Get all trucks (Admin).
- `POST /api/trucks` - Create a truck (Admin).
- `PUT /api/trucks/:id` - Update truck details.
- `DELETE /api/trucks/:id` - Delete a truck.

### Trailer Endpoints

- `GET /api/trailers` - Get all trailers.
- `POST /api/trailers` - Create a trailer.
- `PUT /api/trailers/:id` - Update trailer.

### Tire Endpoints

- `GET /api/tires` - Get all tires.
- `POST /api/tires` - Register a new tire.
- `GET /api/tires/:id/maintenance` - Check maintenance status for a specific tire.

### Trip Endpoints

- `GET /api/trip` - Get trips assigned to the logged-in driver.
- `POST /api/trip` - Create a new trip (Admin).
- `PUT /api/trip/:id` - Update trip status (Driver).
- `GET /api/trip/:id/pdf` - Download Mission Order PDF.

### Maintenance & Reports Endpoints

- `GET /api/maintenance/rules` - View maintenance rules.
- `GET /api/maintenance/alerts` - View active alerts.
- `GET /api/// filepath: c:\YCODE\LogiFleet\BackEnd\README.MD

```bash
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
└── app.js
test/
```

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file (see `.env.example`):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port number for the server | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/logifleet` |
| `JWT_SECRET` | Secret key for signing tokens | `your_super_secret_key` |
| `JWT_EXPIRES_IN` | Token expiration time | `1d` |

## 🚀 Getting Started

### Local Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/logifleet-backend.git
    cd logifleet-backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment**
    Create a `.env` file in the root directory and fill in the variables as shown above.

4. **Run the server**

    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

### 🐳 Docker Setup

The project includes a [`Dockerfile`](Dockerfile) and `docker-compose.yml` for easy deployment.

1. **Build and Run with Docker Compose**

    ```bash
    docker-compose up --build
    ```

2. **Run with Dockerfile only**

    ```bash
    # Build the image
    docker build -t logifleet-api .

    # Run the container
    docker run -p 3000:3000 --env-file .env logifleet-api
    ```

## 🧪 Testing

This project uses **Jest** for unit and integration testing.

```bash
npm test

npm test -- --coverage
```

## 🔍 SonarQube Analysis

We use SonarQube to ensure code quality, security, and test coverage.

![SonarQube Dashboard](https://github.com/user-attachments/assets/sonarqube-screenshot.png)

### Prerequisites

1. A running SonarQube server (e.g., via Docker: `docker run -d --name sonarqube -p 9000:9000 sonarqube`).
2. `sonar-scanner` installed globally or configured in your CI/CD pipeline.

### Running the Analysis

1. **Generate Coverage Report**:
    Ensure you have generated the `lcov.info` file using Jest:

    ```bash
    npm test -- --coverage
    ```

2. **Run the Scanner**:
    Execute the scanner pointing to your SonarQube server.

    ```bash
    sonar-scanner \
      -Dsonar.projectKey=LogiFleet \
      -Dsonar.sources=src \
      -Dsonar.tests=test \
      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
      -Dsonar.host.url=http://localhost:9000 \
      -Dsonar.login=YOUR_SONAR_TOKEN
    ```

## 📡 API Endpoints

### Authentication

- `POST /api/register` - Register a new user.
- `POST /api/login` - Login and receive JWT.
- `GET /api/profile` - Get current user profile.

### Trucks

- `GET /api/trucks` - Get all trucks (Admin).
- `POST /api/trucks` - Create a truck (Admin).
- `PUT /api/trucks/:id` - Update truck details.
- `DELETE /api/trucks/:id` - Delete a truck.

### Trailers

- `GET /api/trailers` - Get all trailers.
- `POST /api/trailers` - Create a trailer.
- `PUT /api/trailers/:id` - Update trailer.

### Tires

- `GET /api/tires` - Get all tires.
- `POST /api/tires` - Register a new tire.
- `GET /api/tires/:id/maintenance` - Check maintenance status for a specific tire.

### Trips

- `GET /api/trip` - Get trips assigned to the logged-in driver.
- `POST /api/trip` - Create a new trip (Admin).
- `PUT /api/trip/:id` - Update trip status (Driver).
- `GET /api/trip/:id/pdf` - Download Mission Order PDF.

### Maintenance & Reports

- `GET /api/maintenance/rules` - View maintenance rules.
- `GET /api/maintenance/alerts` - View active alerts.
