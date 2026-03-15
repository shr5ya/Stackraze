# Algyñ

**Algyñ** is a full-stack community social platform where people can share posts, connect with nearby users, bookmark content, comment, and build a profile — all in one place.

---

## Features

| Feature | Description |
|---|---|
| Auth | JWT-based authentication with login, signup, and protected routes |
| Posts | Create, view, like, comment on, and delete posts with photo support |
| Save Posts | Bookmark any post; saved posts accessible from your profile |
| Comments | Expandable comment threads per post with avatar display |
| Connect | Discover nearby users on an interactive MapLibre map |
| Profiles | Public profile pages with avatar, bio, own posts, and saved posts tabs |
| Edit Profile | In-modal profile editor (name, username, email, about, avatar via Cloudinary) |
| Contact | Contact/Feedback/Suggestion form with type selector |
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
| dotenv | Environment variable management |
| nodemon | Dev auto-restart |
| EJS | Server-side 404 view |
| CORS | Cross-origin request handling |

---

## Project Structure

```
Algyñ/
├── Frontend/                  # React + Vite app
│   └── src/
│       ├── pages/             # Page-level components
│       │   ├── home.jsx       # Feed (paginated all posts)
│       │   ├── profile.jsx    # User profile (public)
│       │   ├── connect.jsx    # Nearby users map
│       │   ├── contact.jsx    # Contact / feedback form
│       │   ├── about.jsx      # About page
│       │   ├── Login.jsx
│       │   └── Signup.jsx
│       ├── components/
│       │   ├── post/
│       │   │   ├── Post.jsx            # Full post card with all interactions
│       │   │   ├── PostContent.jsx     # Rendered post text
│       │   │   ├── PostMoreOptions.jsx # Delete / report dropdown
│       │   │   ├── PostSkeleton.jsx    # Loading placeholder
│       │   │   ├── postImages.jsx      # Image carousel
│       │   │   ├── Comments.jsx        # Expandable comments section
│       │   │   ├── SavePost.jsx        # Bookmark toggle button
│       │   │   └── UploadPost.jsx      # Post creation form
│       │   ├── profile/
│       │   │   ├── profileTop.jsx      # Avatar, name, bio, edit button
│       │   │   ├── UserPosts.jsx       # Posts / Saved tabs
│       │   │   └── EditProfileModal.jsx
│       │   ├── Connect/
│       │   │   └── MapConnect.jsx      # MapLibre map + range selector
│       │   ├── header/
│       │   │   ├── navbar.jsx
│       │   │   └── Profile.jsx         # Navbar avatar dropdown
│       │   ├── about/                  # About page sections
│       │   ├── Sidebar.jsx             # Navigation sidebar
│       │   ├── ProtectedRoute.jsx      # Auth guard wrapper
│       │   └── ThemeToggle.jsx
│       ├── context/
│       │   └── AuthContext.jsx         # Global auth state (user, token)
│       ├── config/
│       │   └── api.js                  # API_URL constant
│       └── utils/
│           └── avatarHelper.js         # Resolve avatar URL / preset name
│
└── Backend/                   # Express REST API
    └── src/
        ├── models/
        │   ├── user.js         # User schema
        │   └── post.js         # Post + embedded Comment schema
        ├── controllers/
        │   ├── user/user.js    # Auth, profile, save/unsave
        │   ├── post/post.js    # CRUD, likes, comments, isSaved flag
        │   ├── connect/        # Geo-location handlers
        │   └── gridArt/        # Grid art handlers
        ├── routes/
        │   └── user.js         # All user + post routes
        ├── mildewares/
        │   └── authMiddleware.js
        └── app.js              # Express app setup
```

---

## API Reference

All routes are prefixed with `/user`.

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user/signup` | No | Register a new user |
| `POST` | `/user/login` | No | Login and receive JWT token |
| `GET` | `/user/userData` | Yes | Get logged-in user's full data |
| `PATCH` | `/user/updateData` | Yes | Update profile fields (name, username, email, avatar, about, password) |
| `GET` | `/user/profile?username=` | No | Get public profile by username |

### Posts

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/user/post/create` | Yes | Create a new post |
| `GET` | `/user/post/allPosts?page=` | Yes | Paginated feed (10/page), includes `isSaved` flag per post |
| `GET` | `/user/post/userposts/:username` | Yes | All posts by a specific user, includes `isSaved` flag |
| `DELETE` | `/user/post/:id` | No | Delete a post by ID |
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

---

## Data Models

### User
```
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
```
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
```
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
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/algyn
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
git clone https://github.com/your-username/algyn.git
cd algyn
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

ISC © Algyñ Contributors
