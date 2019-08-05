import React from 'react'
import GameRow from './GameRow.js'
import '../styles/SearchResults.css'

class SearchResults extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}

    this.performSearch = this.performSearch.bind(this)
    this.renderGameRows = this.renderGameRows.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!window.history.state.results) {
      this.performSearch(this.props.searchTerm)
      return
    }
    if (this.props.searchTerm !== prevProps.searchTerm) {
      this.renderGameRows(window.history.state.results)
    }
  }
    
  performSearch(searchTerm) {
    console.log("Searching: " + searchTerm)
    const queryURL = "/api/" + searchTerm
    fetch(queryURL)
      .then(response => {
        return response.json()
      })
      .then(resultsJSON => {
        this.props.updateHistoryState(searchTerm, resultsJSON)
        this.renderGameRows(resultsJSON)
      })
      .catch(() => {
        alert('The search failed. Please try again.')
      })
  }

  renderGameRows(gamesJSON) {
    let gameRows = []
    gamesJSON.forEach(game => {
      const gameRow = <GameRow key={game.id} game={game}/>
      gameRows.push(gameRow)
    })
    this.setState({ rows: gameRows })
  }

  render() {
    return (
      <ul>
        {this.state.rows}
      </ul>
    )
  }

}

export default SearchResults