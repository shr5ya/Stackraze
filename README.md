# Anchor Backend API Routes

This document lists all currently available backend routes from `Backend/src/routes`.

## Base URL

- Local: `http://localhost:<PORT>`
- Route groups:
1. User routes are mounted at `/user`
2. Admin routes are mounted at `/admin`

## Authentication

Protected routes use `authMiddleware` and support either:
1. Header: `Authorization: Bearer <JWT_TOKEN>`
2. Request body: `{ "token": "<JWT_TOKEN>" }`

## User Routes (`/user`)

| Method | Full Route | Auth | Purpose |
|---|---|---|---|
| POST | `/user/signup` | No | Create a new user account |
| POST | `/user/login` | No | Login and get JWT token |
| GET | `/user/userData` | Yes | Get current user profile data |
| POST | `/user/post/create` | Yes | Create a post |
| GET | `/user/post/allPosts` | Yes | Get all posts |
| POST | `/user/post/like/:id` | Yes | Like a post by id |
| DELETE | `/user/post/:id` | No | Delete a post by id |
| POST | `/user/contact/contactForm` | No | Submit contact form |
| GET | `/user/connect/nearby` | Yes | Get nearby users using geospatial query |
| GET | `/user/userlocation` | Yes | Get current authenticated user location |
| POST | `/user/connect/usergeodata` | Yes | Set/update current authenticated user location |

### Query Params for Nearby Users

Route: `GET /user/connect/nearby`

- `lat` (number, required)
- `lng` (number, required)
- `rangeKm` (number, optional, default `10`)

Example:

```http
GET /user/connect/nearby?lat=37.7749&lng=-122.4194&rangeKm=10
Authorization: Bearer <JWT_TOKEN>
```

### Body Example for Setting User Geodata

Route: `POST /user/connect/usergeodata`

```json
{
  "token": "<JWT_TOKEN>",
  "location": {
    "city": "San Francisco",
    "state": "California",
    "county": "San Francisco County",
    "placeName": "Golden Gate Park",
    "coordinates": [-122.4862, 37.7694]
  }
}
```

## Admin Routes (`/admin`)

| Method | Full Route | Auth | Purpose |
|---|---|---|---|
| GET | `/admin/allusers` | No* | Get all users |
| GET | `/admin/contactFroms` | No* | Get all contact form submissions |

`*` These routes currently do not use auth middleware in code.

## Source of Truth

- `Backend/src/app.js`
- `Backend/src/routes/user.js`
- `Backend/src/routes/admin.js`
