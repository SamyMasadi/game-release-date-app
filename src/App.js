import React from 'react';
import './App.css';
import GameRow from './GameRow.js'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }
  
  performSearch(searchTerm) {    
    if(!searchTerm || !searchTerm.trim()) {
      this.setState({rows: null})
      return
    }
    console.log("Searching: " + searchTerm)
    const queryURL = "/search/" + searchTerm
    fetch(queryURL)
      .then(response => {
        return response.json()
      })
      .then(myJson => {
        let currentSearchValue = document.getElementById("search-bar").value
        if(!currentSearchValue || !currentSearchValue.trim()) {
          return
        }
        const results = myJson.results
        var gameRows = []

        results.forEach((game) => {
          const gameRow = <GameRow game={game} key={game.id}/>
          gameRows.push(gameRow)
        })

        this.setState({rows: gameRows})
      })
      .catch(() => {
        alert('The search failed. Please try again.')
      })
  }

  searchChangeHandler(event) {
    const boundObject = this
    const searchTerm = event.target.value
    boundObject.performSearch(searchTerm)
  }

  render() {
    return (
      <div className="App">
        
        <div id="header-container">
          <div><b>Video Game Search</b></div>
        </div>

        <input id="search-bar" onChange={this.searchChangeHandler.bind(this)} placeholder="Enter search term"/>

        {this.state.rows}

      </div>
    );
  }

}

export default App;
