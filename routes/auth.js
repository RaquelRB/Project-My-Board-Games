const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const BoardGame = require('../models/BoardGame')
const Record = require('../models/Record')
const ensureLogin = require('connect-ensure-login');
const uploadCloud = require('../config/cloudinary.js');

router.get('/signup', (req, res, next) => {
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

router.get('/login', (req, res, next) => {
  res.render('auth/login', { errorMessage: req.flash('error') })
})

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

const checkForAuthentification = (req,res,next)=>{
  if(req.isAuthenticated()){
    return next()
  } else {
    res.redirect('/login')
  }
}

router.get('/mylist/', checkForAuthentification, (req, res) => {
  const userId = req.user._id
  const user = req.user

  User.findOne({_id: userId})
    .populate('boardgame_id')
    .then((result)=>{
      res.render('auth/myList', {boardgame_id: result.boardgame_id, user})
    })
    .catch((err)=>console.log(err))
})

router.post('/mylist', (req, res) => {
  const { name, image_url, description, min_players, max_players, min_playtime, max_playtime, min_age, price, rules_url, id} = req.body
  const userId = req.user._id

  BoardGame.create({name, image_url, description, min_players, max_players, min_playtime, max_playtime, min_age, price, rules_url, id})
    .then((createdGame) => {
      User.findByIdAndUpdate(userId, { $push: { boardgame_id: createdGame._id } })
        .then(() => {
          res.redirect('/mylist')
        })
    })
    .catch((err) => res.send(err))
})

router.post('/delete-game/:_id', (req, res, next) => {
  const gameId = req.params._id
  const userId = req.user._id

  BoardGame.findByIdAndDelete(gameId)
    .then(() => {
      User.findByIdAndUpdate(userId, {$pull: {boardgame_id: gameId}})
      .then(()=>{
        Record.deleteMany({linkedGame: gameId})
        .then(()=>{
          res.redirect('/mylist')
        })
      })
    })
    .catch((err) => console.log(err))
})

router.get('/game-records/:_id', checkForAuthentification, (req, res, next) => {
  const gameId = req.params._id
  const user = req.user
  BoardGame.findById(gameId)
  .then((gameresult)=>{
    BoardGame.findById(gameId)
  .populate('records_id')
    .then((result) => {
        res.render('auth/gameRecords', {records_id: result.records_id, gameId: gameId, name: gameresult.name, image_url: gameresult.image_url, user})
    })
  })
    .catch((err) => console.log(err))
})

router.post('/game-records/:_id', uploadCloud.single('attachedFile_path'), (req, res, next) => {
  const gameId = req.params._id
  const { date, players, winner, scores} = req.body

  const attachedFile_name = req.file ? req.file.originalname : "default.jpg"
  const attachedFile_path = req.file ? req.file.path : "/images/default.jpg"
  
  Record.create({ date, players, winner, scores, attachedFile_name, attachedFile_path, linkedGame: gameId})
    .then((createdRecord) => {
      BoardGame.findByIdAndUpdate(gameId, { $push: { records_id: createdRecord._id} })
        .then((result) => {
          res.redirect(`/game-records/${gameId}`)
        })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/delete-record/:gameId/:recordId', (req, res, next) => {
  const {gameId, recordId} = req.params

  BoardGame.findById(gameId)
  .populate('records_id')
  .then((result)=>{
    
    const newArr = []

    result.records_id.forEach((item)=>{
      if (item._id!=recordId){
        return newArr.push(item)
      }
    })

    BoardGame.updateOne({_id: gameId}, {records_id: newArr})
    .then((result)=>{
      Record.findByIdAndDelete(recordId)
      .then(()=>{
        res.redirect(`/game-records/${gameId}`)
      })
    })
  })
  .catch((err)=>console.log(err))
})

router.get('/edit-record/:_id', checkForAuthentification, (req,res,next)=>{
  // const gameId = req.params.gameId
  const recordId = req.params._id
  const user = req.user

  Record.findById(recordId)
  .then((result)=>{
    res.render('auth/editRecord', {result, user})
  })
})

router.post('/edit-record/:_id', uploadCloud.single('attachedFile_path'), (req, res, next) => {

  let {date, players, winner, scores, linkedGame, att_name, att_path} = req.body
  const recordId = req.params._id

  const attachedFile_name = req.file ? req.file.originalname : att_name
  const attachedFile_path = req.file ? req.file.path : att_path

  Record.create({date, players, winner, scores, attachedFile_name, attachedFile_path, linkedGame})
  .then((newRecordCreated)=>{
    BoardGame.findById(linkedGame)
    .populate('records_id')
    .then((result)=>{
        const newRecordArr = []

        result.records_id.forEach((item)=>{
          if (item._id!=recordId){
            return newRecordArr.push(item)
          }
        })
    
        newRecordArr.push(newRecordCreated)
    
        BoardGame.updateOne({_id: linkedGame}, {records_id: newRecordArr})
        .then((result)=>{
          Record.findByIdAndDelete(recordId)
          .then(()=>{
            res.redirect(`/game-records/${linkedGame}`)
          })
        })
      })
      .catch((err)=>console.log(err))
    })
  })


module.exports = router;
