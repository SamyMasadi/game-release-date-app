/*
  The loading spinner source code comes from https://loading.io/css/
*/

import React from 'react'
import '../styles/LoadingSpinner.css'

function LoadingSpinner(props) {
  return (
    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )
}

export default LoadingSpinner