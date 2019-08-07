import React from 'react'
import '../styles/App.css'
import Header from './Header.js'
import SearchBar from './SearchBar.js'
import ResultsArea from './ResultsArea.js'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { searchBarValue: "" }

    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.pushHistoryState = this.pushHistoryState.bind(this)
  }

  componentDidMount() {
    // User can initiate a search by visiting '/search/:term' directly
    const initialSearchTerm = this.getSearchTermFromURL()
    if (initialSearchTerm) {
      this.updateHistoryState(initialSearchTerm, null)
      this.setState({ searchTerm: initialSearchTerm })
    }
    else {
      this.updateHistoryState("", [])
    }

    // Update state based on history events because client doesn't reload or redirect.
    window.onpopstate = (event) => {
      this.setState({
        searchBarValue: event.state.searchTerm,
        searchTerm: event.state.searchTerm
      })
    }
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
    this.setState({ searchTerm: newSearch })
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

        <ResultsArea 
          searchTerm={this.state.searchTerm} 
          updateHistoryState={this.updateHistoryState} 
        />        
        
      </div>
    )
  }

}

export default App;