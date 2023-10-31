const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: "1047398369277-bu4148048i9okalv31f58au345uf67ss.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      scope:["profile", "email"]
    },
    function(accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
)

passport.serializeUser((user, done)=>{
  done(null, user);
});

passport.deserializeUser((user, done)=>{
  done(null, user);
});