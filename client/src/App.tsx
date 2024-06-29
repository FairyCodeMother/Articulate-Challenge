import React from "react";

import logoRise360 from "./logo-rise-360.svg";
import logoRiseCom from "./logo-rise-com.svg";
import "./App.css";

import KnowledgeBlock from "./components/KnowledgeBlock";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logoRiseCom} className="App-logo" alt="logo" />
//         <h1>Rise Tech Challenge</h1>
//         <img src={logoRise360} className="App-logo" alt="logo" />
//       </header>
//       <section className="App-section">
//         {
//           "Please populate this view with your implementation of the knowledge check block using the API available at "
//         }
//         <p />
//         <a href="https://rise.articulate.com/share/YaZWnWdc2El8-M-4gcZ9eQD0lB9iRXDn#/lessons/lZ0qX7FvbGICXnk-30conqfR_JAFagbh">
//           Rise lesson
//         </a>
//         <p />
//         <span className="App-code">{"/knowledge-check-blocks"}</span>

//         {/*
//           - Block- container
//             - Block- col
//               - Quiz- card
//                 - Card- row
//                 - Card- media
//                  - Media zoom
//                 - Card- horiz rule
//                 - Card- interactive
//                   - Answer- choices
//                   - Answer- submit
//                   - Answer- feedback
//                   - Answer- retake
//         */}
//         <div></div>
//       </section>
//     </div>
//   );
// }

// export default App;

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logoRiseCom} className="App-logo" alt="logo" />
        <h1>Rise Tech Challenge</h1>
        <img src={logoRise360} className="App-logo" alt="logo" />
      </header>
      <section className="App-section">
        {
          "Please populate this view with your implementation of the knowledge check block using the API available at "
        }
        <p />
        <a href="https://rise.articulate.com/share/YaZWnWdc2El8-M-4gcZ9eQD0lB9iRXDn#/lessons/lZ0qX7FvbGICXnk-30conqfR_JAFagbh">
          Rise lesson
        </a>
        <p />
        <span className="App-code">{"/knowledge-check-blocks"}</span>

        <div>
          <KnowledgeBlock />
        </div>
      </section>
    </div>
  );
};

export default App;
