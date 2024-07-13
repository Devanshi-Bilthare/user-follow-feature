var express = require('express');
var router = express.Router();
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('../model/userModel')

passport.use(new localStrategy(User.authenticate()))

/* GET home page. */
router.get('/',isLoggedIn, async function(req, res, next) {
  const user= await req.user
  const allUsers = await User.find()
  res.render('index',{user,allUsers} );
});

router.get('/signup',(req,res)=>{
  res.render('signup')
})

router.post('/signup',async(req,res)=>{
  try{
    const {name,username,email,password} = req.body
    await User.register({name,username,email},password)
    res.redirect('/login')
  }catch(err){
    res.send(err)
  }
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}),(req,res)=>{})


router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/logout',(req,res)=>{
  req.logout(()=>{
    res.redirect('/login')
  })
})

router.get('/follow/:id',async(req,res)=>{
  try{
    const curUser = await req.user
    const user = await User.findById(req.params.id)
    if(!user.followers.includes(curUser._id)){
      await user.followers.push(curUser._id)
      await user.save()
    }

    if(!curUser.following.includes(user._id)){
      await curUser.following.push(user._id)
      await curUser.save()
    }

    
    res.redirect('/')
    
    
    
    
  }catch(err){
    res.send(err)
  }
})

router.get('/unfollow/:id', async (req, res) => {
  try {
    const curUser = await req.user;
    const user = await User.findById(req.params.id);
    

    const followerIndex = user.followers.indexOf(curUser._id.toString());
    if (followerIndex > -1) {
      user.followers.splice(followerIndex, 1);
    }

    const followingIndex = curUser.following.indexOf(user._id.toString());
    if (followingIndex > -1) {
      curUser.following.splice(followingIndex, 1);
    }

    await curUser.save();
    await user.save();

    res.redirect('/');
  } catch (err) {
    res.status(500).send(err);
  }
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login')
  }
}


module.exports = router;
