import React from 'react'
import { Redirect } from 'react-router-dom'
import './Login.css'
import Message from '../message/Message'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: '',
      messageClass: 'hidden'
    }

    this.handleInputValueChange = this.handleInputValueChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.loginError = this.loginError.bind(this)
  }

  handleInputValueChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleFormSubmit(event) {
    event.preventDefault()

    const cleanForm = this.validateForm()
    if (cleanForm.error) { return this.loginError(cleanForm.error) }

    let responseJSON
    try {
      const response = await fetch('/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanForm)
      })
      responseJSON = await response.json()
    } catch (error) {
      const message = 'Log in failed. Please try again.'
      return this.loginError(message)
    }
    if (responseJSON.message) { return this.loginError(responseJSON.message) }

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

  loginError(message) {
    this.setState({
      message: message,
      messageClass: 'errorAlert'
    })
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
        <Message messageClass={this.state.messageClass} message={this.state.message} />
      </div>
    )
  }

}

export default Login
