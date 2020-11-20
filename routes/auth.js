const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const BoardGame = require('../models/BoardGame')
const ensureLogin = require('connect-ensure-login');



router.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  if (username === '' || password === '') {
    res.render('auth/signup', { errorMessage: 'You have to fill all the fields' })
    return
  }

  User.findOne({ username })
    .then((result) => {
      if (!result) {
        bcrypt.hash(password, 10)
          .then((hashedPassword) => {
            User.create({ username, password: hashedPassword })
              .then(() => {
                res.redirect('/')
              })
          })
      } else {
        res.render('auth/signup', { errorMessage: 'This user already exists. Please, try again' })
      }
    })
    .catch((err) => res.send(err));
});

router.get('/login', (req,res,next)=>{
  res.render('auth/login', {errorMessage: req.flash('error')})
})

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

const checkForAuthentification = (req,res,next)=>{
  if(req.isAuthenticated()){
    return next()
  } else {
    res.redirect('/login')
  }
}

router.get('/mylist', checkForAuthentification, (req, res)=>{

  BoardGame.find({owner: req.user._id})
  .then((result)=>{
    res.render('auth/myList', {boardgames: result})
  })
  .catch((err)=>{
    res.send(err)
  })
})


router.post('/mylist', checkForAuthentification, (req, res)=>{
  const {name, image_url, description, min_age, price, rules_url,id} = req.body
  const userId = req.user._id

  BoardGame.create({name, image_url, description, min_age, price, rules_url,id,owner: userId})
  .then((createdGame)=>{
    User.updateOne({$push: {boardgames: createdGame._id}})
    .then(()=>{
      res.redirect('/mylist')
    })
  })
  .catch((err)=>res.send(err))
})


module.exports = router;
