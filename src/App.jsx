import React from 'react';

import ChartWithSelect from './components/ChartWithSelect';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>
        US COVID-19 Data (
        <a href="https://github.com/nytimes/covid-19-data">source</a>
        )
      </h1>
      <ChartWithSelect />
    </div>
  );
}

export default App;
