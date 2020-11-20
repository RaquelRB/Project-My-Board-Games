//EN INDEX
// {{!-- <div class="container">
//   <div class="row justify-content-around">
//     <div class="col-md-4">
//     </div>
//   </div>
// </div> --}}


//EN SCRIPT
document.addEventListener('DOMContentLoaded', () => {

  const URL = "https://api.boardgameatlas.com/api/"

  //List of all board games
  const boardGames = () => {

    axios.get(`${URL}search?client_id=HtEvNIGWc8`)
      .then((result) => {

        // document.getElementById('all-games').innerText=''

        result.data.games.forEach((game) => {
          // const gameCard = document.createElement('div')
          // gameCard.classList.add('card')
          // gameCard.id = `${game.id}`
          // document.querySelector('.col-md-4').append(gameCard)

          // const image = document.createElement('img')
          // image.classList.add('card-img-top')
          // document.getElementById(`${game.id}`).append(image)

          // const cardBody = document.createElement('div')
          // cardBody.classList.add('card-body')
          // cardBody.id = `${game.name}`
          // document.getElementById(`${game.id}`).append(cardBody)

          // const name = document.createElement('h5')
          // name.classList.add('card-title')
          // document.getElementById(`${game.name}`).append(name)

          // const players = document.createElement('p')
          // players.classList.add('card-text')
          // document.getElementById(`${game.name}`).append(players)

          // const time = document.createElement('p')
          // time.classList.add('card-text')
          // document.getElementById(`${game.name}`).append(time)

          // name.innerText = game.name
          // image.setAttribute ('src', game.image_url)
          // image.setAttribute ('alt', game.name)
          // players.innerText = `Players: ${game.min_players}-${game.max_players}`
          // time.innerText = `Play time: ${game.min_playtime}-${game.max_playtime}`
        })

      })
      .catch((err) => {
        console.log(err)
      })
  }

  boardGames()

}, false);
