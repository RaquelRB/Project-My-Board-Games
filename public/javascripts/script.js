const URL = "https://api.boardgameatlas.com/api/"

const renderGames = (game) => {

  // -----Create block for each game-----
  const gameContainer = document.createElement('div')
  gameContainer.id = `${game.id}`
  gameContainer.classList.add('col')
  document.getElementById('all-games').append(gameContainer)

  // -----Create elements for each block-----
  const name = document.createElement('h3')
  const hr = document.createElement('hr')
  const players = document.createElement('p')
  const time = document.createElement('p')
  const buttonDetails = document.createElement('button')
  const image = document.createElement('img')

  document.getElementById(`${game.id}`).append(name)
  document.getElementById(`${game.id}`).append(hr)
  document.getElementById(`${game.id}`).append(players)
  document.getElementById(`${game.id}`).append(time)
  document.getElementById(`${game.id}`).append(buttonDetails)
  document.getElementById(`${game.id}`).append(image)

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

          document.getElementById('name').value = uniqueGame.name
          document.getElementById('image_url').value = uniqueGame.image_url
          document.getElementById('description').value = uniqueGame.description
          document.getElementById('min_players').value = uniqueGame.min_players
          document.getElementById('max_players').value = uniqueGame.max_players
          document.getElementById('min_playtime').value = uniqueGame.min_playtime
          document.getElementById('max_playtime').value = uniqueGame.max_playtime
          document.getElementById('min_age').value = uniqueGame.min_age
          document.getElementById('price').value = uniqueGame.price
          document.getElementById('rules_url').value = uniqueGame.rules_url
          document.getElementById('id').value = uniqueGame.id


          document.getElementById('button-add').innerHTML = "Add to my list"

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
    document.querySelector('.spinner-border').style.display = 'block'
    document.querySelector('.unique-container').style.display = 'none'

    axios.get(`${URL}search?client_id=HtEvNIGWc8`)
      .then((result) => {
        document.querySelector('.spinner-border').style.display = 'none'
        result.data.games.forEach((game) => {
          const divUniqueGame = document.getElementById('unique-container')
          divUniqueGame.style.display = 'none'
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
