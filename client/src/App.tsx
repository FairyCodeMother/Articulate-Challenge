import React from 'react'

import logoRise360 from './logo-rise-360.svg'
import logoRiseCom from './logo-rise-com.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logoRiseCom} className="App-logo" alt="logo" />
        <h1>Rise Tech Challenge</h1>
        <img src={logoRise360} className="App-logo" alt="logo" />
      </header>
      <section className="App-section">
        {"Please populate this view with your implementation of the knowledge check block using the API available at "}
        <span className="App-code">
          {"/knowledge-check-blocks"}
        </span>
      </section>
    </div>
  )
}

export default App
