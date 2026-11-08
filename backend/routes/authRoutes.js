const r=require('express').Router(),passport=require('passport'),auth=require('../controllers/authController'),protect=require('../middleware/auth');
r.post('/register',auth.register);r.post('/login',auth.login);r.get('/me',protect,auth.me);r.post('/forgot-password',auth.forgot);r.post('/reset-password',auth.reset);
r.get('/google',(req,res,next)=>{if(!process.env.GOOGLE_CLIENT_ID)return res.status(503).send('Google OAuth is not configured');passport.authenticate('google',{scope:['profile','email'],session:false})(req,res,next);});
r.get('/google/callback',passport.authenticate('google',{failureRedirect:`${process.env.FRONTEND_URL}/login?oauth=failed`,session:false}),auth.oauthSuccess);
r.get('/github',(req,res,next)=>{if(!process.env.GITHUB_CLIENT_ID)return res.status(503).send('GitHub OAuth is not configured');passport.authenticate('github',{scope:['user:email'],session:false})(req,res,next);});
r.get('/github/callback',passport.authenticate('github',{failureRedirect:`${process.env.FRONTEND_URL}/login?oauth=failed`,session:false}),auth.oauthSuccess);
module.exports=r;
