import React from 'react'
import GameRow from './GameRow.js'
import '../styles/SearchResults.css'

function SearchResults(props) {

  let gameRows = []
  props.gamesJSON.forEach(game => {
    const gameRow = <GameRow key={game.id} game={game}/>
    gameRows.push(gameRow)
  })
  
  return (
    <ul className="results-container">
      {gameRows}
    </ul>
  )

}

export default SearchResults