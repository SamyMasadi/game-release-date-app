import React from 'react'
import './App.css'
import GameRow from './GameRow.js'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { searchBarValue: "" }
    this.state.searchTerm = this.getSearchTermFromURL()

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.pushHistoryState = this.pushHistoryState.bind(this)
    this.performSearch = this.performSearch.bind(this)
    this.renderGameRows = this.renderGameRows.bind(this)
  }

  componentDidMount() {
    this.updateHistoryState("", [])
    if (this.state.searchTerm) {
      this.performSearch(this.state.searchTerm)
    }
    window.onpopstate = (event) => {
      this.setState({ searchBarValue: event.state.searchTerm })
      this.renderGameRows(event.state.searchTerm, event.state.results)
    }
    document.getElementById("search-field").focus()
  }

  getSearchTermFromURL() {
    const url = window.location.href
    const searchMarker = "search/"
    let startIndex = url.indexOf(searchMarker)
    if (startIndex === -1) {
      return null
    }
    startIndex += searchMarker.length
    const searchTerm = url.substring(startIndex)
    return searchTerm
  }

  handleChange(event) {
    this.setState({ searchBarValue: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    let newSearch = this.state.searchBarValue
    if(!newSearch || !newSearch.trim()) {
      return
    }
    newSearch = newSearch.trim()
    this.pushHistoryState(newSearch)    
  }

  pushHistoryState(newSearch) {
    const newURL = "/search/" + newSearch
    let newState = { searchTerm: newSearch }
    if (newSearch === this.state.searchTerm) {
      newState.results = window.history.state.results
    }
    window.history.pushState(newState, newSearch, newURL)
    if (newSearch !== this.state.searchTerm) {
      this.performSearch(newSearch)
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
        this.updateHistoryState(searchTerm, resultsJSON)
        this.renderGameRows(searchTerm, resultsJSON)
      })
      .catch(() => {
        alert('The search failed. Please try again.')
      })
  }

  updateHistoryState(searchTerm, gamesJSON) {
    window.history.replaceState(
      {
        searchTerm: searchTerm, 
        results: gamesJSON 
      }, 
      searchTerm
    )
  }

  renderGameRows(searchTerm, gamesJSON) {
    let gameRows = []
    gamesJSON.forEach(game => {
      const gameRow = <GameRow key={game.id} game={game}/>
      gameRows.push(gameRow)
    })
    this.setState({
      searchTerm: searchTerm, 
      rows: gameRows
    })
  }

  render() {
    return (
      <div className="App">
        
        <div id="header-container">
          <div><b>Video Game Search</b></div>
        </div>
        
        <form onSubmit={this.handleSubmit}>
          <input 
            className="search-bar" 
            id="search-field" 
            type="text" 
            value={this.state.searchBarValue} 
            onChange={this.handleChange} 
            placeholder="Search games" 
            required minLength="1"
          />
          <button className="search-bar" type="submit">Search</button>
        </form>

        <ul>
          {this.state.rows}
        </ul>

      </div>
    )
  }

}

export default App;
