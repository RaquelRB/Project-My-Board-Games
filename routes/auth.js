const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const BoardGame = require('../models/BoardGame')
const Record = require('../models/Records')
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
                res.redirect('/login')
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

router.get('/logout', (req,res)=>{
  req.logout()
  res.redirect('/')
})


router.get('/mylist', ensureLogin.ensureLoggedIn(), (req, res)=>{

  BoardGame.find({owner: req.user._id})
  .then((result)=>{
    res.render('auth/myList', {boardgames: result})
  })
  .catch((err)=>{
    res.send(err)
  })
})


router.post('/mylist', ensureLogin.ensureLoggedIn(), (req, res)=>{
  const {name, image_url, description, min_age, price, rules_url,id} = req.body
  const userId = req.user._id

  BoardGame.create({name, image_url, description, min_age, price, rules_url,id,owner: userId})
  .then((createdGame)=>{
    User.findByIdAndUpdate(userId, {$push: {boardgames: createdGame._id}})
    .then(()=>{
      res.redirect('/mylist')
    })
  })
  .catch((err)=>res.send(err))
})

// router.get('/game-records/:_id', (req,res,next)=>{
//   const gameId= req.params._id
  
//   BoardGame.findOne({_id: gameId})
//   .then((result)=>{
//     if(result.owner.toString() == req.user._id.toString()){
//       res.render('auth/gameRecords')
//     } else {
//       res.redirect('auth/myList')
//     }
//   })
// })


router.get('/game-records/:_id', (req,res,next)=>{
  const gameId= req.params._id
  
  BoardGame.findOne({_id: gameId})
  .then((result)=>{

    if(result.owner.toString() == req.user._id.toString()){
      console.log(`${result.records}`)
      res.render('auth/gameRecords', {result})
    } else {
      res.redirect('/myList')
    }
  })
  .catch((err)=>console.log(err))
})


router.post('/game-records/:_id', (req,res,next)=>{

  const {date, winner, scores, attachedFile, boardgames} = req.body

  Record.create({date, winner, scores, attachedFile, boardgames})
  .then((createdRecord)=>{
    BoardGame.findByIdAndUpdate(boardgames, {$push: {records: createdRecord}})
    .then((result)=>{
      console.log(result)
      res.redirect(`/game-records/${boardgames}`)
    })
  })
  .catch((err)=>{
    console.log(err)
  })
})


module.exports = router;
