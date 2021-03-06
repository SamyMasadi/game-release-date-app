/*
  The loading spinner source code comes from https://loading.io/css/
*/

import React from 'react'
import './LoadingSpinner.css'

function LoadingSpinner(props) {
  return (
    <div className="spinner-container">
      <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default LoadingSpinner