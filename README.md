# ☁️ CloudIn – Cloud-Based Image Storing Platform

CloudIn is a full-stack application designed to let users upload, view, and manage images in the cloud. It features a Spring Boot backend and an Expo (React Native) frontend.

---

## 📚 Table of Contents

- [✨ Introduction](#-introduction)
- [🚀 Get Started](#-get-started)
  - [📦 Backend Setup (Spring Boot)](#-backend-setup-spring-boot)
  - [📱 Frontend Setup (Expo React Native)](#-frontend-setup-expo-react-native)
- [🔐 Environment Variables](#-environment-variables)
  - [Frontend `.env`](#frontend-env)
  - [Backend `application.properties`](#backend-applicationproperties)
- [📂 Project Structure](#-project-structure)
- [🛠️ Technologies Used](#️-technologies-used)

---

## ✨ Introduction

CloudIn is a cloud-based image storing platform that allows users to:

- Upload and delete images
- View images in a gallery
- Persist image data securely using MongoDB and Cloudinary

It is composed of:
- A **Spring Boot** backend for image and user API
- An **Expo React Native** frontend for mobile and web interface

---

## 🚀 Get Started

### 📦 Backend Setup (Spring Boot)

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/cloud_in.git
   cd cloud_in/cloud_in_backend
   ```

2. Install dependencies and run:
   - Using Maven:
     ```bash
     ./mvnw spring-boot:run
     ```

   - Or via your IDE (IntelliJ/VSCode): Run `CloudInBackendApplication.java`

---

### 📱 Frontend Setup (Expo React Native)

1. Navigate to frontend directory:
   ```bash
   cd cloud_in/cloud_in_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (see below)

4. Start the app:
   ```bash
   npx expo start
   ```

---

## 🔐 Environment Variables

### Frontend `.env`

> Place in `cloud_in_frontend/.env`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmVuZXdpbmctc2VhZ3VsbC01OC5jbGVyay5hY2NvdW50cy5kZXYk
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.163:8080/api/urls
EXPO_PUBLIC_API_MEDIA_URL=http://192.168.0.163:8080/api/media
EXPO_PUBLIC_MAX_UPLOADS=2
```

---

### Backend `application.properties`

> Place in `cloud_in_backend/src/main/resources/application.properties`

```properties
spring.application.name=cloud_in_backend
spring.data.mongodb.uri=mongodb+srv://swarnakarharshendu:27MH0isCGPTpiAU9@cluster0.sdmds.mongodb.net/cloud-in?retryWrites=true&w=majority
server.address=0.0.0.0
server.port=8080
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

⚠️ **Never commit these values directly. Use `.env` and `.gitignore` to keep them secure.**

---

## 📂 Project Structure

```
cloud_in/
│
├── cloud_in_backend/     # Spring Boot backend
│   └── src/main/java/... # Controllers, Models, Repos
│
├── cloud_in_frontend/    # Expo React Native frontend
│   └── app/              # UI and screens
│
├── .gitignore
└── README.md
```

---

## 🛠️ Technologies Used

- **Frontend:** Expo + React Native + NativeWind
- **Backend:** Spring Boot + MongoDB + Cloudinary
- **Auth:** Clerk.dev
- **Database:** MongoDB Atlas
- **Image Hosting:** Cloudinary


---
