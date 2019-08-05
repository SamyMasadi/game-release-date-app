import React from 'react'
import '../styles/SearchBar.css'

class SearchBar extends React.Component {

  componentDidMount() {
    document.getElementById("search-field").focus()
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
          required minLength="1"
        />
        <button className="search-bar" type="submit">Search</button>
      </form>
    )
  }

}

export default SearchBar