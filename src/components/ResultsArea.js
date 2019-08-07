import React from 'react'
import SearchResults from './SearchResults.js'
import LoadingSpinner from './LoadingSpinner.js'

class ResultsArea extends React.Component {

  constructor(props) {
    super(props)
    const empty = (
      <div></div>
    )
    this.state = { resultsArea: empty }

    this.performSearch = this.performSearch.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!window.history.state.results && this.state === prevState) {
      this.setState({ resultsArea: <LoadingSpinner/> })
      this.performSearch(this.props.searchTerm)
      return
    }
    if (this.props.searchTerm !== prevProps.searchTerm) {
      const results = <SearchResults gamesJSON={window.history.state.results}/>
      this.setState({ resultsArea: results })
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
        const results = <SearchResults gamesJSON={resultsJSON}/>
        this.setState({ resultsArea: results })
      })
      .catch(() => {
        alert('The search failed. Please try again.')
      })
  }

  render() {
    return this.state.resultsArea
  }

}

export default ResultsArea