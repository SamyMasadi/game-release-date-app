import React from 'react'
import { Redirect } from 'react-router-dom'
import './Login.css'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: ''
    }

    this.handleInputValueChange = this.handleInputValueChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  handleInputValueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleFormSubmit(event) {
    event.preventDefault()

    const cleanForm = this.validateForm()

    if (cleanForm.error) {
      this.setState({ message: cleanForm.error })
      return
    }

    const response = await fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanForm)
    })
    const responseJSON = await response.json()
    
    if (responseJSON.message) {
      this.setState({
        message: responseJSON.message,
        messageClass: 'errorAlert'
      })
      return
    }

    this.props.storeUserData(responseJSON.token, responseJSON.user)
  }

  validateForm() {
    const { email, password } = this.state
    const formValues = [email, password]

    for (let i = 0; i < formValues.length; i++) {
      if (!formValues[i] || !formValues[i].trim()) {
        return { error: 'Please fill out all fields.' }
      }
    }

    return {
      email: email.trim(),
      password: password.trim()
    }
  }
    
  render() {
    if (this.props.loggedIn) return <Redirect to="/" />

    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <h2 className="form-label">Log In</h2>
          <input 
            className="credentials-form form-field" 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={this.state.email} 
            onChange={this.handleInputValueChange} 
          />
          <input 
            className="credentials-form form-field" 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={this.state.password} 
            onChange={this.handleInputValueChange} 
          />
          <button className="credentials-form form-button" type="submit">Log In</button>
        </form>
        <div className={this.state.messageClass}>
          {this.state.message}
        </div>
      </div>
    )
  }

}

export default Login
