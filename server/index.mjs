import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import 'express-async-errors';
import beers from './routes/beers.mjs';
import breweries from './routes/breweries.mjs';

const PORT = process.env.PORT || 80;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/beers', beers);
app.use('/breweries', breweries);

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

