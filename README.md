Neurogine Food Menu Management System
A full-stack web application built for managing food menus, featuring secure JWT authentication, dynamic search and filtering, image uploads, application logging, and containerized deployment using Docker Compose.

=== Tech Stack ===
Backend: Spring Boot (Java 21), Spring Data MongoDB, Spring Security, JJWT / Custom Cryptography, SLF4J / Logback Logging.

Frontend: React, TypeScript, Vite, Axios, Modern Custom CSS.

Database: MongoDB.

Containerization: Docker & Docker Compose.

=== Features ===
JWT Authentication: Secure login and registration with token-based authorization and password hashing (BCrypt).

Menu Management (CRUD): Create, read, update, and delete menu items with validation.

Search, Filter & Sorting: Instant live search by name/description and category filtering (Food, Drink, Buffet, Dessert, Snack).

Image Uploads: Support for uploading menu item images with static resource handling and storage.

Application Logging: Integrated backend logging configured via Logback and SLF4J.

Clean & Responsive UI: Card-based layouts, custom confirmation dialog modals, and fully responsive design.

=== Project Architecture & Docker Services ===
The application runs inside a isolated bridge network (neurogine-net) managed by Docker Compose:

mongodb – MongoDB database container with persistent volume storage (mongo_data).

backend – Spring Boot REST API service running on port 8080.

frontend – React application served via port 3000.

=== Prerequisites ===
Make sure you have the following installed on your machine:

Docker & Docker Compose

=== Getting Started & Running the Application === 
Clone or open the project root directory where your docker-compose.yml file is located.

Build and start all containers in detached mode by running:
docker compose up --build

Access the application:

Frontend App: http://localhost:3000

Backend API / Swagger / Endpoints: http://localhost:8080

MongoDB: mongodb://localhost:27017

Stop the application:
To stop the containers without losing database data, run:
docker compose stop

To stop and remove containers completely, run:
docker compose down

====== Environment Variables ====
The backend service automatically picks up configuration from docker-compose.yml and application.yml:

SPRING_DATA_MONGODB_HOST: mongodb

SPRING_DATA_MONGODB_PORT: 27017

SPRING_DATA_MONGODB_DATABASE: menu_db
