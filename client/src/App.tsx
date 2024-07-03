import React from "react";

import logoRise360 from "./logo-rise-360.svg";
import logoRiseCom from "./logo-rise-com.svg";
import "./App.css";

import KnowledgeBlock from "./components/KnowledgeBlock";

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logoRiseCom} className="App-logo" alt="logo" />
                <h1>Rise Tech Challenge Solution</h1>
                <img src={logoRise360} className="App-logo" alt="logo" />
            </header>
            <section className="App-section">
                <div>
                    <KnowledgeBlock />
                </div>
            </section>
        </div>
    );
};

export default App;
