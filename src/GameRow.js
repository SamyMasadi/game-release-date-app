import React from 'react'

function GameRow(props) {
  return (
    <div className="row-container">
      <img alt="poster" src={props.game.image.thumb_url}/>
      <div className="row-content">
        {props.game.name}
        <p>{props.game.deck}</p>
      </div>
    </div>
  )
}

export default GameRow