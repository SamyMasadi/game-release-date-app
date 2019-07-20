import React from 'react'

class GameRow extends React.Component {
  viewGameInfo() {
    window.location.href = this.props.game.site_detail_url
  }

  render() {
    return (
      <div className="row-container">
        <img alt="cover" src={this.props.game.image.thumb_url}/>
        <div className="row-content">
          <b>{this.props.game.name}</b>
          <p>{this.props.game.deck}</p>
          <input type="button" onClick={this.viewGameInfo.bind(this)} value="More info"/>
        </div>
      </div>
    )
  }
}

export default GameRow