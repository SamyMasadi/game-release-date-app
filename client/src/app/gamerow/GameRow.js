import React from 'react'
import './GameRow.css'

function GameRow(props) {

  return (
    <li className="row-container">
      <img alt="cover" src={props.game.image.thumb_url}/>
      <div className="row-content">
        <h4>{props.game.name}</h4>
        <p>{props.game.deck}</p>
        <a href={props.game.site_detail_url}>
          <button><b>More info</b></button>
        </a>
      </div>
    </li>
  )

}

export default GameRow