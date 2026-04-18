const express = require('express');
const passport = require('passport');
const { handleUserSignup, handleUserLogin, handleVerifyOtp, handleResendOtp, handleGoogleCallback, handleUserData, handleCreateContact, handleUpdateUserData, handleGetProfileByUsername, handleSavePostToUserData, handleUnsavePost, handleGetSavedPosts } = require('../controllers/user/user');
const { handleCreatePost, handleGetAllPosts, handleDeletePost, handleLikePost, handleGetUSerPosts, handleGetPostComments, handleAddComment } = require('../controllers/post/post');
const { handleGetNearbyUsers, handleGetUserLocation, handleSetUserGeodata } = require("../controllers/connect/geoDataHandeler");
const { handleAddGridArt, handleGetGrids } = require("../controllers/gridArt/grid")
const authMiddleware = require('../mildewares/authMiddleware');


const router = express.Router();

// Authentication routes + OTP Flow
router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.post('/verify-otp', handleVerifyOtp);
router.post('/resend-otp', handleResendOtp);

// Google OAuth routes (stateless session)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`, session: false }), handleGoogleCallback);

// User data routes & account management (protected)
router.get('/userData', authMiddleware, handleUserData);
router.patch('/updateData', authMiddleware, handleUpdateUserData);
router.get('/profile', handleGetProfileByUsername);

// Saved posts (acts like bookmarks)
router.post('/post/savepost/:id', authMiddleware, handleSavePostToUserData);
router.delete('/post/savepost/:id', authMiddleware, handleUnsavePost);
router.get('/post/savedposts/:username', authMiddleware, handleGetSavedPosts);

// Post system (feed + interactions)
router.post('/post/create', authMiddleware, handleCreatePost);
router.get('/post/allPosts', authMiddleware, handleGetAllPosts);
router.post('/post/like/:id', authMiddleware, handleLikePost);
router.get('/post/userposts/:username', authMiddleware, handleGetUSerPosts);
router.delete('/post/:id', handleDeletePost);
router.get('/post/comments/:id', authMiddleware, handleGetPostComments);
router.post('/post/comment/:id', authMiddleware, handleAddComment);

// Misc features (contact + grid art)
router.post('/contact/contactForm', handleCreateContact);
router.post('/grid', handleAddGridArt);
router.get('/grid', handleGetGrids);

// Geo-based features (nearby users + location)
router.get("/connect/nearby", authMiddleware, handleGetNearbyUsers);
router.get("/userlocation", authMiddleware, handleGetUserLocation);
router.post("/connect/usergeodata", authMiddleware, handleSetUserGeodata);


module.exports = router;
