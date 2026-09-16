const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const isAdmin = require("../middleware/is-admin.js");
const User = require("../models/User.js");




router.get('/', (req, res) => {
    res.render('homepage.ejs')
})

router.get('/admin', isAdmin, async (req, res) => {
    const allUsers = await User.find()
    res.render('all-users.ejs', { allUsers: allUsers })
})


router.post('/toggle-admin', isAdmin, async (req, res) => {

    const toggledUsers = await User.findById(req.body.userId);

    toggledUsers.isAdmin = !toggledUsers.isAdmin
    await toggledUsers.save();

    res.redirect('/admin')
})


router.post('/delete-user', isAdmin, async (req, res) => {

    await User.findByIdAndDelete(req.body.userId);

    res.redirect('/admin')
})


module.exports = router;
