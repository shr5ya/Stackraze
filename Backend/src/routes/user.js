const express = require('express');
const passport = require('passport');
const { handleUserSignup, handleUserLogin, handleVerifyOtp, handleResendOtp, handleGoogleCallback, handleUserData, handleCreateContact, handleUpdateUserData, handleGetProfileByUsername, handleSavePostToUserData, handleUnsavePost, handleGetSavedPosts } = require('../controllers/user/user');
const { handleCreatePost, handleGetAllPosts, handleDeletePost, handleLikePost, handleGetUSerPosts, handleGetPostComments, handleAddComment } = require('../controllers/post/post');
const { handleGetNearbyUsers, handleGetUserLocation, handleSetUserGeodata } = require("../controllers/connect/geoDataHandeler");
const { handleAddGridArt, handleGetGrids } = require("../controllers/gridArt/grid")
const authMiddleware = require('../mildewares/authMiddleware');


const router = express.Router();

// Auth routes
router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.post('/verify-otp', handleVerifyOtp);
router.post('/resend-otp', handleResendOtp);

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), handleGoogleCallback);

// User data routes
router.get('/userData', authMiddleware, handleUserData);
router.patch('/updateData', authMiddleware, handleUpdateUserData);
router.get('/profile', handleGetProfileByUsername);
router.post('/post/savepost/:id', authMiddleware, handleSavePostToUserData);
router.delete('/post/savepost/:id', authMiddleware, handleUnsavePost);
router.get('/post/savedposts/:username', authMiddleware, handleGetSavedPosts);

router.post('/post/create', authMiddleware, handleCreatePost);
router.get('/post/allPosts', authMiddleware, handleGetAllPosts);
router.post('/post/like/:id', authMiddleware, handleLikePost);
router.get('/post/userposts/:username', authMiddleware, handleGetUSerPosts);
router.delete('/post/:id', handleDeletePost);
router.get('/post/comments/:id', authMiddleware, handleGetPostComments);
router.post('/post/comment/:id', authMiddleware, handleAddComment);

router.post('/contact/contactForm', handleCreateContact);
router.post('/grid', handleAddGridArt);
router.get('/grid', handleGetGrids);


router.get("/connect/nearby", authMiddleware, handleGetNearbyUsers);
router.get("/userlocation", authMiddleware, handleGetUserLocation);
router.post("/connect/usergeodata", authMiddleware, handleSetUserGeodata);


module.exports = router;
