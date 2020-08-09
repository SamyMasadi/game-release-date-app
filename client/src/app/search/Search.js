import React from 'react'
import SearchBar from '../search-bar/SearchBar'
import Prompt from '../prompt/Prompt'
import Message from '../message/Message'
import SearchResults from '../search-results/SearchResults'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'

class Search extends React.Component {

  defaultState = {
    searchBarValue: '',
    resultsArea: <Prompt/>
  }

  constructor(props) {
    super(props)
    this.state = this.defaultState

    this.handleHistoryEvent = this.handleHistoryEvent.bind(this)
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this)
    this.performSearch = this.performSearch.bind(this)
    this.searchError = this.searchError.bind(this)
    this.updateHistoryState = this.updateHistoryState.bind(this)
  }

  componentDidMount() {
    // Need a case for user leaving to another site and returning
    if (this.props.location.state) {
      this.handleHistoryEvent(this.props.location.state)
      const results = this.props.location.state.results
      if (results && results.length > 0) return
    }

    // User can initiate a search by visiting '/search/:term' directly
    if (this.props.match.params.term) {
      this.performSearch(this.props.match.params.term)
      return
    }

    this.updateHistoryState('', {})
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.handleHistoryEvent(this.props.location.state)
    }
  }

  /**
   * Updates the page state based on the info stored in history states.
   * @param state an HTML5 history api state
   */
  handleHistoryEvent(state) {
    const searchTerm = state.searchTerm
    const results = state.results
    if (searchTerm && searchTerm !== '') {
      if (results && results.length > 0) {
        this.props.setFixedFooter(false)
        this.setState({
          searchBarValue: searchTerm,
          resultsArea: <SearchResults gamesJSON={results}/>
        })
      }
      else {
        /* There may be cases where user initiated a search,
        but navigated away before API response could be saved in history state. */
        this.performSearch(searchTerm)
      }
      return
    }
    this.props.setFixedFooter(true)
    this.setState(this.defaultState)
  }

  /**
   * Manages the state of the search bar value as the user makes changes to the input.
   * @param {Event} event an input change event
   */
  handleSearchValueChange(event) {
    this.setState({ searchBarValue: event.target.value })
  }

  /**
   * When the user submits a new search, make a request to the app server
   * to initiate a search using Giant Bomb's API. Upon receiving results,
   * render results info and update state.
   * @param {string} searchTerm a user-submitted search term
   */
  async performSearch(searchTerm) {
    this.props.setFixedFooter(true)
    this.setState({
      resultsArea: <LoadingSpinner/>
    })
    console.log('Searching: ' + searchTerm)
    const queryURL = '/api/' + searchTerm
    let resultsJSON
    try {
      const response = await fetch(queryURL)
      resultsJSON = await response.json()
    } catch (error) {
      return this.searchError()
    }
    if (resultsJSON.message) { return this.searchError() }
    this.updateHistoryState(searchTerm, resultsJSON)
    this.props.setFixedFooter(false)
    const results = <SearchResults gamesJSON={resultsJSON}/>
    this.setState({ resultsArea: results })
  }

  searchError() {
    this.props.setFixedFooter(true)
    const error = <Message message='The search failed. Please try again.' messageClass='errorAlert' />
    this.setState({ resultsArea: error })
  }

  /**
   * Update history state to include API results
   * @param {string} searchTerm a user-submitted search term
   * @param gamesJSON API results for the search query
   */
  updateHistoryState(searchTerm, gamesJSON) {
    this.props.history.replace(
      this.props.location.pathname,
      {
        searchTerm: searchTerm, 
        results: gamesJSON 
      }
    )
  }

  render() {
    return (
      <div>
        <SearchBar 
          searchTerm={this.props.match.params.term} 
          history={this.props.history}
          location={this.props.location}
          searchBarValue={this.state.searchBarValue}
          handleSearchValueChange={this.handleSearchValueChange}
        />
        {this.state.resultsArea}
      </div>      
    )
  }

}

export default Search
