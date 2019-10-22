import React from 'react'
import '../styles/SearchBar.css'

class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = { searchButtonID: "invalid-search-button" }
  }

  componentDidMount() {
    document.getElementById("search-field").focus()
  }

  componentDidUpdate(prevProps) {
    let searchValue = this.props.searchBarValue
    let prevSearchValue = prevProps.searchBarValue
    // To ensure whitespace doesn't count as valid input.
    searchValue = searchValue.trim()
    prevSearchValue = prevSearchValue.trim()
    if (searchValue.length > 0 && prevSearchValue.length === 0) {
      this.setState({ searchButtonID: "valid-search-button" })
    }
    if (searchValue.length === 0 && prevSearchValue.length > 0) {
      this.setState({ searchButtonID: "invalid-search-button" })
    }
  }

  render() {
    return (
      <form onSubmit={this.props.handleSearchSubmit}>
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