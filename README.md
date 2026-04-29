# Stackraze

## Team Details

| Name | Roll Number |
|------|------------|
| Shreya Yadav | 2210990841 |
| Palak Bisht | 2210990631 |
| Tanisha Singla | 2210990893 |

---

## Project Type
Copyright



## Current Status
Waiting


**Stackraze**  is a full-stack community-driven social platform that enables users to connect, interact, and share content based on proximity and interests. It provides features like authentication, posting, commenting, real-time chat, geo-location-based user discovery, and newsletter engagement using modern web technologies.


---

## Features

| Feature | Description |
|---|---|
| Auth | JWT-based authentication with login, signup, OTP verification, and protected routes |
| Posts | Create, view, like, comment on, and delete posts with photo support |
| Save Posts | Bookmark any post; saved posts accessible from your profile |
| Comments | Expandable comment threads per post with avatar display |
| Connect | Discover nearby users on an interactive MapLibre map |
| Community | Real-time community chat and sidebar navigation for group interactions |
| Newsletters | Browse, read, and engage with informative newsletters |
| Profiles | Public profile pages with avatar, bio, own posts, and saved posts tabs |
| Settings | Manage account preferences, location updates, edit profile, and account deletion |
| Contact & FAQs | Contact/Feedback form and Frequently Asked Questions for support |
| Dark Mode | System-aware dark/light mode toggle throughout the UI |
| Geo Data | Users can set their location; proximity search powered by MongoDB 2dsphere index |

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| TailwindCSS v4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |
| MapLibre GL | Interactive map for Connect page |
| Axios | HTTP client (used in select areas) |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Stateless authentication |
| Socket.io | Real-time WebSocket communication |
| dotenv | Environment variable management |
| nodemon | Dev auto-restart |
| EJS | Server-side 404 view |
| CORS | Cross-origin request handling |

---

## Project Structure

```text
Stackraze/
├── Frontend/
│   └── src/
│       ├── api/               # API call wrappers
│       ├── assets/            # Static assets (images, videos, avatars, logos)
│       ├── components/        # Reusable UI Components
│       │   ├── about/         # About page sections (Hero, People, etc.)
│       │   ├── AuthPages/     # Authentication components
│       │   ├── community/     # CommunityChat, CommunitySidebar
│       │   ├── Connect/       # MapConnect, NearbyUserCard, UpdateLocation
│       │   ├── header/        # Navbar, Profile dropdown
│       │   ├── newsletters/   # NewsCard, SkeletonCard, sample
│       │   ├── post/          # Post cards, comments, upload, etc.
│       │   ├── profile/       # Profile header, tabs, edit modal
│       │   ├── settings/      # Settings options, location, delete account
│       │   ├── ui/            # Specialized UI (theme toggler, map, grids)
│       │   └── [root]         # CheckBoxes, ContactForm, Faqs, Sidebar, etc.
│       ├── config/            # Configurations (api.js)
│       ├── context/           # React Context (AuthContext, PopupContext)
│       ├── hooks/             # Custom hooks (useAvatarUpload)
│       ├── lib/               # Utility libraries
│       ├── pages/             # Route Pages
│       │   ├── about.jsx
│       │   ├── Auth.jsx
│       │   ├── comunity.jsx
│       │   ├── connect.jsx
│       │   ├── contact.jsx
│       │   ├── home.jsx
│       │   ├── Login.jsx
│       │   ├── newsLetters.jsx
│       │   ├── OtpVerification.jsx
│       │   ├── profile.jsx
│       │   ├── settings.jsx
│       │   └── Signup.jsx
│       └── utils/             # Helper functions (avatarHelper, cloudinaryUpload)
│
└── Backend/
    └── src/
        ├── config/            # Environment and passport configs
        ├── controllers/       # Route controllers
        │   ├── admin/
        │   ├── connect/
        │   ├── gridArt/
        │   ├── newsletter/
        │   ├── post/
        │   ├── user/
        │   └── community.js
        ├── mildewares/        # Middlewares (authMiddleware, admin.js)
        ├── models/            # Mongoose Schemas (user, post, community, message...)
        ├── routes/            # Express Routes
        │   ├── admin.js
        │   ├── community.js
        │   ├── news.js
        │   ├── newsletter.js
        │   └── user.js
        ├── utils/             # Backend utilities (emailService)
        ├── views/             # EJS templates (404.ejs)
        ├── app.js             # Main Express app setup
        ├── connectMongo.js    # DB connection logic
        └── sockets.js         # Socket.io configuration
```

---

## API Reference

All user routes are prefixed with `/user`. Admin and specific feature routes may have their own prefixes.

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user/signup` | No | Register a new user |
| `POST` | `/user/login` | No | Login and receive JWT token |
| `POST` | `/user/verifyOTP` | No | Verify OTP for authentication |
| `GET` | `/user/userData` | Yes | Get logged-in user's full data |
| `PATCH` | `/user/updateData` | Yes | Update profile fields (name, username, email, avatar, about, password) |
| `GET` | `/user/profile?username=` | No | Get public profile by username |
| `DELETE`| `/user/deleteAccount` | Yes | Delete user account permanently |

### Posts

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user/post/create` | Yes | Create a new post |
| `GET` | `/user/post/allPosts?page=` | Yes | Paginated feed (10/page), includes `isSaved` flag per post |
| `GET` | `/user/post/userposts/:username` | Yes | All posts by a specific user, includes `isSaved` flag |
| `DELETE` | `/user/post/:id` | Yes | Delete a post by ID |
| `POST` | `/user/post/like/:id` | Yes | Toggle like/unlike on a post |
| `GET` | `/user/post/comments/:id` | Yes | Fetch all comments for a post |
| `POST` | `/user/post/comment/:id` | Yes | Add a comment to a post |

### Save Posts

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user/post/savepost/:id` | Yes | Save a post (adds to savedPosts via `$addToSet`) |
| `DELETE` | `/user/post/savepost/:id` | Yes | Unsave a post (removes from savedPosts via `$pull`) |
| `GET` | `/user/post/savedposts/:username` | Yes | Get all saved posts for a user (populated) |

### Connect / Geo

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/user/connect/nearby` | Yes | Get users within a radius (2dsphere query) |
| `GET` | `/user/userlocation` | Yes | Get current user's stored location |
| `POST` | `/user/connect/usergeodata` | Yes | Set/update user's geo coordinates |

### Contact & Misc

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user/contact/contactForm` | No | Submit contact/feedback/suggestion form |
| `GET` | `/user/grid` | No | Fetch grid art entries |
| `POST` | `/user/grid` | No | Add a grid art entry |

*(Note: API reference for Community, Newsletters, and Admin routes are configured in their respective route files: `community.js`, `newsletter.js`, `admin.js`.)*

---

## Data Models

### User
```text
name          String (max 50)
username      String (unique, lowercase)
email         String (unique, lowercase)
password      String (min 6)
avatar        String (URL or preset name)
about         String
posts         [ObjectId -> Post]
savedPosts    [ObjectId -> Post]
isAdmin       Boolean
isVerified    Boolean
location      { city, state, county, placeName, coordinates: [lat, lng] }
lastLogin     Date
```
> `location.coordinates` is indexed as **2dsphere** for geo queries.

### Post
```text
content       String (max 800, required)
photos        [String]     -- image URLs
author        ObjectId -> User
likes         [ObjectId -> User]
shares        Number
comments      [embedded Comment]
isNewLetter   Boolean
isPublic      Boolean
```

### Comment (embedded)
```text
userId        ObjectId -> User
username      String
avatar        String
text          String (max 300)
createdAt     Date
```

---

## Environment Variables

### Backend — `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/stackraze
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend — `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/stackraze.git
cd stackraze
```

### 2. Start the Backend
```bash
cd Backend
npm install
npm run dev       # runs with nodemon on PORT from .env
```

### 3. Start the Frontend
```bash
cd Frontend
npm install
npm run dev       # Vite dev server -> http://localhost:5173
```

---

## Authentication Flow

1. User signs up or logs in — server returns a **JWT token** and user object
2. Token is stored in `localStorage` and attached to all protected requests via `Authorization: Bearer <token>` header
3. `AuthContext` provides `{ user, token, login, logout, isAuthenticated }` globally
4. `ProtectedRoute` redirects unauthenticated users to `/login`
5. `PublicRoute` redirects already-authenticated users away from `/login` and `/signup`

---

## Save Posts — How It Works

1. The backend enriches each post in the feed/profile API response with `isSaved: true | false` by checking the logged-in user's `savedPosts` set — no extra client request needed
2. `Post.jsx` passes `initialSaved={!!post.isSaved}` (or `true` for the Saved tab) to the `SavePost` component
3. `SavePost.jsx` renders the bookmark icon filled or hollow based on `initialSaved`, and toggles via:
   - `POST /user/post/savepost/:id` — to save
   - `DELETE /user/post/savepost/:id` — to unsave
4. Optimistic UI: the icon flips immediately and reverts if the API call fails
5. The Saved Posts tab on a user's profile page lazy-fetches saved posts on first click and caches them for the session

---

## Connect Page — How It Works

1. User sets their location via `POST /user/connect/usergeodata`
2. MongoDB stores coordinates with a **2dsphere** index on `location.coordinates`
3. `GET /user/connect/nearby` performs a `$nearSphere` query with a configurable radius (km)
4. Results are rendered as pins on a **MapLibre GL** interactive map
5. A range slider below the map controls the search radius in real-time (debounced)

---

## License

ISC © Stackraze Contributors
