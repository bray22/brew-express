import express from "express";
import db from "../db/conn.mjs";
import passport from "passport";

const router = express.Router();
//const CLIENT_URL = "http://localhost:3000/"

// router.get("/login/success", (req,res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Successfully Logged In",
//       user: req.user
//     });
//     console.log("SUCCESS");
//   } else {
//     res.status(403).json({error: true, message: "Not Authorized"})
//   }
// });

router.get('/login/success', (req, res) => {
  // Extract the code from the request object
  const code = req.query.code;

  // Redirect the user to the status.html page with the code
  res.redirect(`/status.html?code=${code}`);
});

router.get("/login/failed", (req,res) => {
  res.status(401).json({
    error: true,
    message: "Login Failure"
  });
});

router.get("/google/callback", 
  passport.authenticate("google", {
    successRedirect: 'http://localhost:3000',
    failureRedirect: "login/failed"
  })
);

router.get("/google", 
  passport.authenticate("google", ["profile","email"])
);

router.get("/logout", (req, res) =>{  
  req.logout();
  res.redirect(CLIENT_URL);
});

export default router;
