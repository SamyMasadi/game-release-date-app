import React from 'react'
import "../src/Home.css"
import GameRow from '../src/GameRow.js'

const ENTER_KEY_CODE = 13

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.detectEnter = this.detectEnter.bind(this)
    this.performSearch = this.performSearch.bind(this)
  }

  /**
   * Next.js method used set up the search results from the server
   * @param {query} query Although the default use of the parameter is for a query
   * received from a request, any object can be passed, so I simply pass the 
   * search results from the server.
   * @return the json API results passed from the server
   */
  static async getInitialProps({ query }) {
    if (Object.entries(query).length > 0) {
      return { results: query }
    }
    return { results: null }
  }

  /**
   * Use to show the API search results, if any
   */
  componentDidMount() {
    if (!this.props.results) {
      return
    }

    var gameRows = []

    this.props.results.forEach(game => {
      const gameRow = <GameRow game={game} key={game.id}/>
      gameRows.push(gameRow)
    })

    this.setState({rows: gameRows})
  }

  /**
   * Searches initiate a server route.
   * Due to CORS limitations, all requests to Giant Bomb's API must be from the server.
   */
  performSearch() {
    var searchTerm = document.getElementById("search-bar").value
    if(!searchTerm || !searchTerm.trim()) {
      return
    }
    searchTerm = searchTerm.trim()
    console.log("Searching: " + searchTerm)
    window.location.href = "/search/" + searchTerm
  }

  detectEnter(event) {
    if(event.keyCode === ENTER_KEY_CODE) {
      this.performSearch()
    }
  }
    
  render() {
    return (
      <div className="Home">
        
        <div id="header-container">
          <div><b>Video Game Search</b></div>
        </div>
        
        <input id="search-bar" placeholder="Search games" onKeyDown={this.detectEnter}/>
        <button onClick={this.performSearch}>Search</button>

        {this.state.rows}

      </div>
    )
  }

}
  
export default Home