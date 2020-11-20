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

router.get('/mylist', ensureLogin.ensureLoggedIn(), (req, res) => {
  BoardGame.find({})
  .then((boardgame)=>{
    res.render('auth/myList', {user: req.user}, {boardgames: boardgame});
  })
  
});

router.post('/mylist', (req,res,next)=>{
  const newBoardGame = req.body
  console.log(req.body)
  BoardGame.create(newBoardGame)
  .then((createdGame)=>{
    User.updateOne({$push: {boardgames: createdGame._id}})
    .then((result)=>{
      console.log(result)
    })
    res.redirect('/mylist')
  })
  .catch((err)=>{
    res.redirect('/login')
  })

})

module.exports = router;
