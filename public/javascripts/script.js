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
  const button = document.createElement('button')

  document.getElementById(`${game.id}`).append(name)
  document.getElementById(`${game.id}`).append(image)
  document.getElementById(`${game.id}`).append(players)
  document.getElementById(`${game.id}`).append(time)
  document.getElementById(`${game.id}`).append(button)

  // -----Include content for each element-----
  name.innerText = game.name
  image.setAttribute('src', game.image_url)
  image.setAttribute('alt', game.name)
  players.innerText = `Players: ${game.min_players}-${game.max_players}`
  time.innerText = `Play time: ${game.min_playtime}-${game.max_playtime}`
  button.setAttribute('type', 'submit')
  button.setAttribute('class', `${game.id}`)
  button.innerText = 'Game details'

  // -----Configurate button for each game-----
  const gameButton = document.getElementsByClassName(`${game.id}`)

  const gameButtonArr = [...gameButton]

  gameButtonArr.forEach((btn) => {
    btn.addEventListener('click', () => {
      axios.get(`${URL}search?ids=${game.id}&client_id=HtEvNIGWc8`)
        .then((result) => {
          const uniqueGame = result.data.games[0].id
          console.log(uniqueGame)
          
          // document.querySelector('.find-nav').innerHTML = ''
          // document.querySelector('.game-container').innerHTML = ''

          // document.querySelector('.card-title').innerHTML = uniqueGame.name

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
        
        document.getElementById('all-games').innerText = ''
        result.data.games.forEach((game) => {
          renderGames(game)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  })

  boardGames()

}, false);
