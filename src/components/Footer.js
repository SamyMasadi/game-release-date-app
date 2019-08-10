import React from 'react'
import '../styles/Footer.css'

function Footer(props) {
  let footerClass = "static-footer"
  if (props.fixedFooter) {
    footerClass = "fixed-footer"
  }
  const year = new Date().getFullYear()
  return (
    <div className={footerClass} id="footer-container">
      <div id="search-source">
        Search powered by <a href="https://www.giantbomb.com">GiantBomb.com</a>
      </div>
      <div id="copyright">&copy; {year} Samy Masadi.</div>
    </div>
  )

}

export default Footer