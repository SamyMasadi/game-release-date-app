import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Header from './header/Header'
import Login from './login/Login'
import Register from './register/Register'
import Search from './search/Search'
import Footer from './footer/Footer'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { fixedFooter: true }

    this.setFixedFooter = this.setFixedFooter.bind(this)
    this.storeUserData = this.storeUserData.bind(this)
  }

  setFixedFooter(fixed) {
    this.setState({ fixedFooter: fixed })
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.setState({ token, user })
  }

  render() {

    return (
      
      <div className="App">

        <Header/>

        <Router>
          <Switch>
            <Route 
              path="/login"
              render={props => <Login storeUserData={this.storeUserData} loggedIn={this.state.token} {...props} />}
            />
            <Route 
              path="/register"
              render={props => <Register storeUserData={this.storeUserData} loggedIn={this.state.token} {...props} />}
            />
            <Route 
              exact path="/search/:term"
              render={props => <Search setFixedFooter={this.setFixedFooter} {...props} />}
            />
            <Route 
              path="/"
              render={props => <Search setFixedFooter={this.setFixedFooter} {...props} />}
            />
          </Switch>
        </Router>

        <Footer fixedFooter={this.state.fixedFooter}/>
        
      </div>
      
    )
  }

}

export default App
