import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import 'express-async-errors';
import beers from './routes/beers.mjs';
import breweries from './routes/breweries.mjs';
import fs from 'fs';
import https from 'https';
import auth from './routes/auth.mjs';
import passport from 'passport';
import passportSetup from "./passport.cjs";
import cookieSession from 'cookie-session';
const https_port = 443; // The default HTTPS port
const PORT = process.env.PORT || 8080;
const app = express();
const authRoute = express.Router();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.raystar.io/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.raystar.io/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

app.use(
  cookieSession({
    name: 'session',
     keys: 'wolf',
     maxAge: 100

   })
)

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/beers', beers);
app.use('/breweries', breweries);
app.use('/auth', auth);

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
