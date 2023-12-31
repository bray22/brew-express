import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import 'express-async-errors';
import beers from './routes/beers.mjs';
import breweries from './routes/breweries.mjs';
import login from './routes/login.mjs';
import users from './routes/users.mjs';
import posts from './routes/posts.mjs';
import favorites from './routes/favorites.mjs';
import reviews from './routes/reviews.mjs';
import sessions from './routes/sessions.mjs';
import recents from './routes/recents.mjs';
import fs from 'fs';
import https from 'https';
import auth from './routes/auth.mjs';
import passport from 'passport';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import User from './models/User.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const https_port = 443; // The default HTTPS port
const PORT = process.env.PORT || 8080;
const app = express();
const authRoute = express.Router();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.raystar.io/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.raystar.io/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

// Configure Passport to use the LocalStrategy for authentication
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = User.find((user) => user.username === username);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password' });
    }
    return done(null, user);
  })
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => user.id === id);
  done(null, user);
});

// Initialize session middleware
app.use(
  session({
    secret: 'create-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true
    user: { 'id': 123 },
    pageviews: 1
  })
);

// Serve static files (e.g., HTML, CSS, images) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/beers', beers);
app.use('/breweries', breweries);
app.use('/auth', auth);
app.use('/users', users);
app.use('/login', login);
app.use('/posts', posts);
app.use('/favorites', favorites);
app.use('/reviews', reviews);
app.use('/sessions', sessions);
app.use('/recents', recents);

app.get('/status.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'status.html' ));
});

// Global error handling
app.use((err, _req, res, _next) => {
  console.error(err); // Log the error for debugging
  res.status(500).send('Uh oh! An unexpected error occurred.');
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Catch-all route for undefined paths (all HTTP methods)
app.all('*', (req, res) => {
  res.status(404).send('Oops! The page you requested does not exist.');
});

httpsServer.listen(https_port, () => {
   console.log(`Server is running on https://www.raystar.io:${https_port}`);
});
