const express = require('express');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const BoardGame = require('../models/BoardGame')
const Record = require('../models/Record')
const ensureLogin = require('connect-ensure-login');



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

router.get('/mylist/', ensureLogin.ensureLoggedIn(), (req, res) => {
  const user = req.user._id

  User.findOne({_id: user})
    .populate('boardgame_id')
    .then((result)=>{
      res.render('auth/myList', {boardgame_id: result.boardgame_id})
    })
    .catch((err)=>console.log(err))
})

router.post('/mylist', ensureLogin.ensureLoggedIn(), (req, res) => {
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


router.post('/delete-game/:_id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const gameId = req.params._id
  const userId = req.user._id

  BoardGame.findByIdAndDelete(gameId)
    .then(() => {
      User.findByIdAndUpdate(userId, {$pull: {boardgame_id: gameId}})
      .then(()=>res.redirect('/mylist'))
    })
    .catch((err) => console.log(err))
  
})

router.get('/game-records/:_id', (req, res, next) => {
  const gameId = req.params._id

  BoardGame.findById(gameId)
  .then((gameresult)=>{
    BoardGame.findById(gameId)
  .populate('records_id')
    .then((result) => {
        res.render('auth/gameRecords', {records_id: result.records_id, gameId: gameId, name: gameresult.name, image_url: gameresult.image_url})
    })
  })
    .catch((err) => console.log(err))
})

router.post('/game-records/:_id', (req, res, next) => {
  const gameId = req.params._id
  const { date, players, winner, scores, attachedFile} = req.body

  Record.create({ date, players, winner, scores, attachedFile, linkedGame: gameId})
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

router.get('/edit-record/:gameId/:recordId', (req,res,next)=>{
  // const gameId = req.params.gameId
  // const recordId = req.params.recordId

  // BoardGame.findById(gameId)
  // .populate('records_id')
  // .then((result)=>{
    
  //   const oneRecord = []
    
  //   result.records_id.forEach((item)=>{
  //     if (item._id=recordId){
  //       return oneRecord.push(item._id = recordId)
  //     }
  //   })
  //   console.log(oneRecord)
  //   res.render('auth/editRecord', {records_id: result.records_id}, oneRecord[0])
  // })
  // .catch((err)=> console.log(err))
})


router.post('/edit-record/:gameId/:recordId', (req, res, next) => {
  // const {date, players, winner, scores, attachedFile} = req.body
  // const { gameId, recordId } = req.params

  //   BoardGame.findById(gameId)
  //   .populate('records_id')
  //   .then((result)=>{
      
  //     const oneRecord = {date, players, winner, scores, attachedFile}
  
  //     result.records_id.forEach((item)=>{
  //       if (item._id=recordId){
  //         return findRecord.push(item)
  //       }
  //     })
  
  //     BoardGame.updateOne({_id: gameId}, {records_id: newArr})
  //     .then((result)=>{
  //       Record.findByIdAndDelete(recordId)
  //       .then(()=>{
  //         res.redirect(`/game-records/${gameId}`)
  //       })
  //     })
  //   })
  //   .catch((err)=>console.log(err))
})


module.exports = router;
