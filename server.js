// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./db.js')
const Entry = require('./models/Entry.js')
const User = require('./models/User.js')

// middleware imports
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// routes Imports
const authController = require("./routes/auth.routes.js");
const indexController = require("./routes/index.routes.js");
const entriesController = require("./routes/entries.routes.js");
const router = require("./routes/auth.routes.js");


// Middleware
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use(passUserToView)










// Routes go here
app.use('/auth',authController)
app.use('/',indexController)
app.use('/entries', entriesController)


app.get('/entries/new', isSignedIn, (req, res)=> {
  res.render('submission.ejs')
})

app.post('/entries/new', isSignedIn, async (req, res)=> {
console.log(req.session.user._id)

const newEntry = await Entry.create({
  title: req.body.title,
  entryBody: req.body.entryBody,
  isPublic: req.body.isPublic,
  owner: req.session.user._id
})
res.redirect('/entries')
console.log(req.body)
})

app.get('/entries', async (req, res)=>{
  
  const allEntries = await Entry.find({isPublic: true})
  console.log(allEntries)
  res.render('all-entries.ejs', {allEntries})
})




app.get('/my-entries', isSignedIn, async (req, res)=>{

const myEntries = await Entry.find({owner: req.session.user._id})

res.render('my-entries.ejs', {myEntries})
})























// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();