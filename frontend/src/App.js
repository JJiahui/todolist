import React from 'react';
// import './App.css';
import Jumbotron from "react-bootstrap/Jumbotron";
import ListContainer from './components/ListContainer';


function App() {
  return (
    <div className="App">
      <Jumbotron>
        <ListContainer/>
      </Jumbotron>
    </div>
  );
}

export default App;
