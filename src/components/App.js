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
    const initialSearchTerm = this.getSearchTermFromURL()
    if (initialSearchTerm) {
      this.updateHistoryState(initialSearchTerm, null)
      this.setState({ searchTerm: initialSearchTerm })
    }
    else {
      this.updateHistoryState("", [])
    }
    window.onpopstate = (event) => {
      this.setState({
        searchBarValue: event.state.searchTerm,
        searchTerm: event.state.searchTerm
      })
    }
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

  handleSearchValueChange(event) {
    this.setState({ searchBarValue: event.target.value })
  }

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

  pushHistoryState(newSearch) {
    let newState = { searchTerm: newSearch }
    if (newSearch === this.state.searchTerm) {
      newState.results = window.history.state.results
    }
    const newURL = "/search/" + newSearch
    window.history.pushState(newState, newSearch, newURL)
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