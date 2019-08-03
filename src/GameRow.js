import React from 'react'

function GameRow(props) {

  return (
    <li className="row-container">
      <img alt="cover" src={props.game.image.thumb_url}/>
      <div className="row-content">
        <b>{props.game.name}</b>
        <p>{props.game.deck}</p>
        <a href={props.game.site_detail_url}>
          <button>More info</button>
        </a>
      </div>
    </li>
  )

}

export default GameRow