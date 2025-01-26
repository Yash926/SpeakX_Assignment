import React from "react"
import "./Header.css"

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="header-logo">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main-logo@3x.png-7MyLUCS2bqR09sGFfnA5ixWQRb5yCq.webp"
            alt="SpeakX"
            className="logo-image"
          />
        </a>
        <nav className="header-nav">
          <a href="https://www.speakx.in/app" rel="noreferrer" target="_blank"><button className="download-btn">Download Now</button></a>
        </nav>
      </div>
    </header>
  )
}

export default Header

