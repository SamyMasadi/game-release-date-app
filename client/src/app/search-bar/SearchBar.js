import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchButtonID: 'invalid-search-button',
      redirect: false
    }

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.pushHistoryState = this.pushHistoryState.bind(this)
  }

  componentDidMount() {
    document.getElementById('search-field').focus()
  }

  componentDidUpdate(prevProps) {
    let searchValue = this.props.searchBarValue
    let prevSearchValue = prevProps.searchBarValue
    // To ensure whitespace doesn't count as valid input.
    searchValue = searchValue.trim()
    prevSearchValue = prevSearchValue.trim()
    if (searchValue.length > 0 && prevSearchValue.length === 0) {
      this.setState({ searchButtonID: 'valid-search-button' })
    }
    if (searchValue.length === 0 && prevSearchValue.length > 0) {
      this.setState({ searchButtonID: 'invalid-search-button' })
    }
    
    // if (this.state.redirect) {
    //   this.setState({ redirect: false })
    // }
  }

  /**
   * Control form submits and ensure user doesn't submit empty strings or whitespace.
   * @param {Event} event a form submit event
   */
  handleSearchSubmit(event) {
    event.preventDefault()
    let newSearch = this.props.searchBarValue
    if(!newSearch || !newSearch.trim()) {
      return
    }
    newSearch = newSearch.trim()
    this.pushHistoryState(newSearch)
  }

  /**
   * Update url and history state with each search.
   * @param {string} newSearch a user-submitted search term
   */
  pushHistoryState(newSearch) {
    let newState = { searchTerm: newSearch }
    if (newSearch === this.props.searchTerm) {
      newState.results = this.props.location.state.results
    }
    const newLocation = '/search/' + newSearch
    this.props.history.push(newLocation, newState)
  }

  render() {
    return (
      <form onSubmit={this.handleSearchSubmit}>
        <input 
          className="search-bar" 
          id="search-field" 
          type="text" 
          value={this.props.searchBarValue} 
          onChange={this.props.handleSearchValueChange} 
          placeholder="Search games" 
          required
        />
        <button className="search-bar search-button" id={this.state.searchButtonID} type="submit">
          <div id="magnifying-glass"></div>
        </button>
      </form>
    )
  }

}

export default SearchBar