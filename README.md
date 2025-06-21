<h1 align="center"># ☁️ CloudIn – Cloud-Based Image Storing Platform </h1>

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
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_API_MEDIA_URL=
EXPO_PUBLIC_MAX_UPLOADS=
```

---

### Backend `application.properties`

> Place in `cloud_in_backend/src/main/resources/application.properties`

```properties
spring.application.name=
spring.data.mongodb.uri=
server.address=
server.port=
spring.servlet.multipart.max-file-size=
spring.servlet.multipart.max-request-size=
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
<p align="center">
  <img src="WhatsApp Image 2025-06-12 at 15.05.18_6d629820.jpg" alt="App Screenshot" width="500"/>
</p>
