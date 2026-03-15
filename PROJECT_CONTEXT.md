# Anchor: Project Context & Overview

## What is Anchor?

**Anchor** is a full-stack, location-aware social networking platform designed to help users connect with people nearby, share updates, and build communities. It goes beyond traditional social media by incorporating geospatial features, allowing users to discover and interact with others based on their real-world proximity.

## Tech Stack (MERN+)

The platform is built using a modern, robust JavaScript ecosystem:

### Frontend
- **Framework:** React 19 with Vite (Fast development and optimized builds)
- **Styling:** Tailwind CSS (Utility-first styling for a sleek, responsive UI)
- **Animations:** Framer Motion (Smooth, dynamic UI transitions and micro-animations)
- **Routing:** React Router v7 (Client-side routing with protected and public route handling)
- **Mapping:** MapLibre GL (For displaying dynamic, interactive maps)
- **State/API:** Axios (API calls) and React Context API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (RESTful API development)
- **Database:** MongoDB with Mongoose ODM (NoSQL database for flexible data modeling)
- **Authentication:** JWT (JSON Web Tokens) for secure, stateless user sessions
- **Storage/Media:** Cloudinary (For uploading and serving user avatars and post images)

## Core Features

### 1. Geospatial Connections (The Map)
The standout feature of Anchor is its **Connect** page (`/connect`). 
- Users can view a dynamic map powered by MapLibre.
- The map displays nearby users as markers (using their custom avatars).
- Users can set a "range selector" (e.g., 10km radius) to filter who they see based on real-time geospatial queries (`$geoNear` in MongoDB using `2dsphere` indexes).
- Clicking on a user marker reveals a popup with their profile details (Name, location, avatar), fostering local community building.

### 2. Social Feed & Posts
- **Create & Share:** Users can create textual posts up to 800 characters and attach images.
- **Interactions:** Posts support liking, sharing, and a fully functional comments section.
- **Content:** The feed aggregates posts from the community, bridging the gap between local discovery and content sharing.

### 3. User Profiles & Authentication
- **Secure Auth:** Standard Signup/Login flows protected by JWT middleware.
- **Public & Private Profiles:** Users have personal dashboards to manage their data (Edit Profile, Upload Avatar) and public profile pages (`/profile/:username`) that anyone can view.
- **Avatars:** Support for custom uploaded Cloudinary avatars or fallback deterministic UI avatars.

### 4. Community & Support
- **Newsletters:** Users can opt-in to platform updates.
- **Contact/Feedback:** A dedicated contact form (`/contact`) supporting different submission types (Contact, Feedback, Suggestion).
- **Admin Dashboard:** Specific backend routes exist for administrators to view all users and read contact form submissions.

## Project Structure

The project follows a clean separation of concerns:

- **`/Frontend/`**: Contains the React application.
  - `src/components/`: Reusable UI elements (Navbar, Post, Comments, MapConnect, etc.).
  - `src/pages/`: Full-page views (Home, Connect, Profile, Auth, etc.).
  - `src/utils/` & `src/lib/`: Helper functions (e.g., resolving avatar URLs).
  
- **`/Backend/`**: Contains the Express server.
  - `src/models/`: Mongoose schemas (`User.js`, `Post.js`).
  - `src/controllers/`: Business logic for handling requests.
  - `src/routes/`: API endpoint definitions (`user.js`, `admin.js`).
  - `src/mildewares/`: Custom middleware (e.g., `authMiddleware` for validating JWTs).

## How to Run the Project Locally

1. **Backend:**
   - `cd Backend`
   - Configure `.env` with `MONGO_URI`, `JWT_SECRET`, and Cloudinary credentials.
   - Run `npm install` followed by `npm run dev` (Runs on http://localhost:PORT).
   
2. **Frontend:**
   - `cd Frontend`
   - Configure `.env` with `VITE_API_URL` pointing to the backend.
   - Run `npm install` followed by `npm run dev`.

---
*This document serves as a high-level overview of the Anchor architecture, feature set, and technical foundation.*
