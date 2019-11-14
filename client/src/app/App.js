import React from 'react'
import './App.css'
import Header from './header/Header'
import SearchBar from './search-bar/SearchBar'
import Prompt from './prompt/Prompt'
import SearchResults from './search-results/SearchResults'
import LoadingSpinner from './loading-spinner/LoadingSpinner'
import Footer from './footer/Footer'

const defaultState = {
  searchTerm: "",
  searchBarValue: "",
  resultsArea: <Prompt/>,
  fixedFooter: true
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = defaultState

    this.handleHistoryEvent = this.handleHistoryEvent.bind(this)
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.pushHistoryState = this.pushHistoryState.bind(this)
    this.performSearch = this.performSearch.bind(this)
  }

  componentDidMount() {
    // Update state based on history events because client doesn't reload or redirect.
    window.onpopstate = (event) => {
      if (this.state.searchTerm === event.state.searchTerm) {
        return
      }
      this.handleHistoryEvent(event.state)
    }

    // Need a case for user leaving to another site and returning
    if (window.history.state) {
      this.handleHistoryEvent(window.history.state)
      const results = window.history.state.results
      if (results && results.length > 0) return
    }
    
    // User can initiate a search by visiting '/search/:term' directly
    const initialSearchTerm = this.getSearchTermFromURL()
    if (initialSearchTerm) {
      this.performSearch(initialSearchTerm)
      return
    }
    
    this.updateHistoryState("", [])
  }

  /**
   * Updates the page state based on the info stored in history states.
   * @param state an HTML5 history api state
   */
  handleHistoryEvent(state) {
    const searchTerm = state.searchTerm
    const results = state.results
    if (searchTerm && searchTerm !== "") {
      if (results && results.length > 0) {
        this.setState({
          searchTerm: searchTerm,
          searchBarValue: searchTerm,
          resultsArea: <SearchResults gamesJSON={results}/>,
          fixedFooter: false
        })        
      }
      else {
        /* There may be cases where user initiated a search,
        but navigated away before API response could be saved in history state. */
        this.performSearch(searchTerm)
      }
      return
    }    
    this.setState(defaultState)
  }

  /**
   * In case the user directly visits '/search/:term',
   * the method will parse the url for the search term.
   * @return the search term as a string or null
   */
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

  /**
   * Manages the state of the search bar value as the user makes changes to the input.
   * @param {Event} event an input change event
   */
  handleSearchValueChange(event) {
    this.setState({ searchBarValue: event.target.value })
  }

  /**
   * Control form submits and ensure user doesn't submit empty strings or whitespace.
   * @param {Event} event a form submit event
   */
  handleSearchSubmit(event) {
    event.preventDefault()
    let newSearch = this.state.searchBarValue
    if(!newSearch || !newSearch.trim()) {
      return
    }
    newSearch = newSearch.trim()    
    this.pushHistoryState(newSearch)
    if (newSearch !== this.state.searchTerm) {
      this.performSearch(newSearch)
    }    
  }

  /**
   * When the user submits a new search, make a request to the app server
   * to initiate a search using Giant Bomb's API. Upon receiving results,
   * render results info and update state.
   * @param {string} searchTerm a user-submitted search term
   */
  performSearch(searchTerm) {
    this.setState({
      resultsArea: <LoadingSpinner/>,
      fixedFooter: true
    })
    console.log("Searching: " + searchTerm)
    const queryURL = "/api/" + searchTerm
    fetch(queryURL)
      .then(response => {
        return response.json()
      })
      .then(resultsJSON => {
        this.updateHistoryState(searchTerm, resultsJSON)
        const results = <SearchResults gamesJSON={resultsJSON}/>
        this.setState({
          searchTerm: searchTerm,
          resultsArea: results,
          fixedFooter: false
        })
      })
      .catch(() => {
        alert('The search failed. Please try again.')
      })
  }

  /**
   * Update url and history state with each search.
   * @param {string} newSearch a user-submitted search term
   */
  pushHistoryState(newSearch) {
    let newState = { searchTerm: newSearch }
    if (newSearch === this.state.searchTerm) {
      newState.results = window.history.state.results
    }
    const newURL = "/search/" + newSearch
    window.history.pushState(newState, newSearch, newURL)
  }

  /**
   * Update history state to include API results
   * @param {string} searchTerm a user-submitted search term
   * @param gamesJSON API results for the search query
   */
  updateHistoryState(searchTerm, gamesJSON) {
    window.history.replaceState(
      {
        searchTerm: searchTerm, 
        results: gamesJSON 
      }, 
      searchTerm
    )
  }

  render() {
    return (
      <div className="App">
        
        <Header/>
        
        <SearchBar 
          handleSearchSubmit={this.handleSearchSubmit} 
          searchBarValue={this.state.searchBarValue} 
          handleSearchValueChange={this.handleSearchValueChange} 
        />

        {this.state.resultsArea}

        <Footer fixedFooter={this.state.fixedFooter}/>
        
      </div>
    )
  }

}

export default App;