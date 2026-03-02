const express = require('express');
const { handleUserSignup, handleUserLogin, handleUserData, handleCreateContact,handleUpdateUserData,handleGetProfileByUsername } = require('../controllers/user/user');
const { handleCreatePost, handleGetAllPosts, handleDeletePost, handleLikePost,handleGetUSerPosts } = require('../controllers/post/post');
const {handleGetNearbyUsers,handleGetUserLocation, handleSetUserGeodata} = require("../controllers/connect/geoDataHandeler")
const authMiddleware = require('../mildewares/authMiddleware');


const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/userData', authMiddleware, handleUserData);
router.patch('/updateData',authMiddleware,handleUpdateUserData);
router.get('/profile',handleGetProfileByUsername);

router.post('/post/create', authMiddleware, handleCreatePost);
router.get('/post/allPosts', authMiddleware, handleGetAllPosts);
router.post('/post/like/:id', authMiddleware, handleLikePost);
router.get('/post/userposts/:username',authMiddleware, handleGetUSerPosts);
router.delete('/post/:id', handleDeletePost);

router.post('/contact/contactForm', handleCreateContact);


router.get("/connect/nearby", authMiddleware, handleGetNearbyUsers);
router.get("/userlocation",authMiddleware,handleGetUserLocation);
router.post("/connect/usergeodata",authMiddleware,handleSetUserGeodata);


module.exports = router;
