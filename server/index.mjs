import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import 'express-async-errors';
import beers from './routes/beers.mjs';
import breweries from './routes/breweries.mjs';
import login from './routes/login.mjs';
import users from './routes/users.mjs';
import fs from 'fs';
import https from 'https';
import auth from './routes/auth.mjs';
import passport from 'passport';
import passportSetup from "./passport.cjs";
import cookieSession from 'cookie-session';
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

if (process.env.ENVIRONMENT === "Prod") {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.raystar.io/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/www.raystar.io/fullchain.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
}


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

// app.use(
//   cookieSession({
//     name: 'session',
//      keys: 'wolf',
//      maxAge: 100

//    })
// )

// Initialize session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true
    user: { 'id': 123 },
    pageviews:1

  })
);

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

if (process.env.ENVIRONMENT === "Prod") {
  httpsServer.listen(https_port, () => {
    //console.log(`Server is running on https://www.raystar.io:${https_port}`);
  });
}