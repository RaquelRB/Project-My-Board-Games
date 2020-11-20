const URL = "https://api.boardgameatlas.com/api/"

const renderGames = (game) => {

  // -----Create block for each game-----
  const gameContainer = document.createElement('div')
  gameContainer.id = `${game.id}`
  gameContainer.classList.add('col')
  document.querySelector('.row').append(gameContainer)

  // -----Create elements for each block-----
  const name = document.createElement('h3')
  const image = document.createElement('img')
  const players = document.createElement('p')
  const time = document.createElement('p')
  const buttonDetails = document.createElement('button')

  document.getElementById(`${game.id}`).append(name)
  document.getElementById(`${game.id}`).append(image)
  document.getElementById(`${game.id}`).append(players)
  document.getElementById(`${game.id}`).append(time)
  document.getElementById(`${game.id}`).append(buttonDetails)

  // -----Include content for each element-----
  name.innerText = game.name
  image.setAttribute('src', game.image_url)
  image.setAttribute('alt', game.name)
  players.innerText = `Players: ${game.min_players}-${game.max_players}`
  time.innerText = `Play time: ${game.min_playtime}-${game.max_playtime}`
  buttonDetails.setAttribute('type', 'submit')
  buttonDetails.setAttribute('class', `${game.id}`)
  buttonDetails.innerText = 'Game details'

  // -----Configurate button for each game-----
  const gameButton = document.getElementsByClassName(`${game.id}`)

  const gameButtonArr = [...gameButton]

  gameButtonArr.forEach((btn) => {
    btn.addEventListener('click', () => {
      axios.get(`${URL}search?ids=${game.id}&client_id=HtEvNIGWc8`)
        .then((result) => {

          const divAllGames = document.getElementById('all-games')
          divAllGames.style.display = 'none'

          const divUniqueGame = document.getElementById('unique-container')
          divUniqueGame.style.display = 'block'

          const uniqueGame = result.data.games[0]

          const gameIdp = document.getElementById('gameId')
          gameIdp.innerText = uniqueGame.id
          gameIdp.style.visibility = 'hidden'

          const cardImage = document.querySelector('.card-img')
            cardImage.setAttribute('src', uniqueGame.image_url)
            cardImage.setAttribute('alt', uniqueGame.name)

          const cardTitle = document.querySelector('.card-title')
          cardTitle.innerHTML = uniqueGame.name

          const cardText = document.querySelectorAll('.card-text')
          cardText[0].innerHTML = uniqueGame.description
          cardText[1].innerHTML = `Players: ${uniqueGame.min_players}-${uniqueGame.max_players}`
          cardText[2].innerHTML = `Play time: ${uniqueGame.min_playtime}-${uniqueGame.max_playtime}`
          cardText[3].innerHTML = `Min age: ${uniqueGame.min_age}`
          cardText[4].innerHTML = `Price from: ${uniqueGame.price}`
          cardText[5].innerHTML = "Game rules"
          document.getElementById('game-rules').href =uniqueGame.rules_url

        })
        .catch((err) => {
          console.log(err)
        })
    })
  })
}

//-----VIEWERS IN WEB PAGE-----

document.addEventListener('DOMContentLoaded', () => {

  //List of all board games
  const boardGames = () => {
    axios.get(`${URL}search?client_id=HtEvNIGWc8`)
      .then((result) => {
        result.data.games.forEach((game) => {
          renderGames(game)
          const divUniqueGame = document.getElementById('unique-container')
          divUniqueGame.style.display = 'none'
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //Search game by name
  document.getElementById('search-game-button').addEventListener('click', () => {
    const gameName = document.getElementById('search-game-input').value

    axios.get(`${URL}search?name=${gameName}&client_id=HtEvNIGWc8`)
      .then((result) => {
        const divAllGames = document.getElementById('all-games')
        divAllGames.style.display = ''
        document.getElementById('all-games').innerText = ''

        result.data.games.forEach((game) => {
          renderGames(game)
          const divUniqueGame = document.getElementById('unique-container')
          divUniqueGame.style.display = 'none'
        })
      })
      .catch((err) => {
        console.log(err)
      })
  })

  boardGames()

}, false);
