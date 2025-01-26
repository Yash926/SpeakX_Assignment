import React from "react"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-left">
            <h2 className="footer-title">
              Become a Confident
              <br />
              English Speaker
            </h2>
            <div className="footer-links">
              <a href="/about" className="footer-link">
                About Us
              </a>
              <a href="/contact" className="footer-link">
                Contact Us
              </a>
              <a href="/terms" className="footer-link">
                Terms and Conditions
              </a>
              <a href="/privacy" className="footer-link">
                Privacy Policy
              </a>
              <a href="/refund" className="footer-link">
                Refund Policy
              </a>
              <a href="/deletion" className="footer-link">
                User Data Deletion Policy
              </a>
            </div>
          </div>
          <div className="footer-right">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-obEFkHDA5MABAudfQkdQnySeR4Ldzm.png"
              alt="SpeakX"
              className="footer-logo"
            />
            <p className="footer-address">
              Plot No 823P, Sector-47, Gurgaon,
              <br />
              Haryana, India, 122018
            </p>
            <button className="footer-download">Download Now!</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">COPYRIGHT ©2024 IVYPODS TECHNOLOGY PVT. LTD.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

