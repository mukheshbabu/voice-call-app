import React from 'react'

const Footer = () => {
  return (
    <footer>
      <hr />
      <div className='wrapper footerWrapper'>
        <p>&copy; 2024 All Rights Reserved</p>
        <div className='footer__right'>
          <a href="/terms">Terms</a>
          <a href="privacyPolicy">Privacy Policy</a>
          <a href="/cookie">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
