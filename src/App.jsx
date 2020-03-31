import React, { useState } from 'react';
import {
  AreaChart, XAxis, YAxis, Tooltip, Area,
} from 'recharts';
import Select from 'react-select';

import './App.css';

import states from './counties.json';

const mapStringToSelectOption = (k) => ({ value: k, label: k });
export const ChartWithSelect = () => {
  const [state, setState] = useState('Washington');
  const [county, setCounty] = useState();
  const data = Object.values(states[state].dates).map((d) => {
    if (!county) {
      return d;
    }

    const filteredKeys = Object.keys(d).filter((k) => k.includes(county));
    const filtered = {};
    filteredKeys.forEach((k) => { filtered[k] = d[k]; });
    return filtered;
  });
  const getMax = (key) => data.reduce((acc, current) => {
    const keys = Object.keys(current).filter((k) => k.includes(key));
    const values = keys.map((key) => current[key]);
    return Math.max(acc, Math.round(Math.max.apply(null, values) * 1.1));
  }, 0);
  const props = {
    width: 700,
    height: 700,
    data,
    onClick: (v) => console.log('clicked', v),
  };
  return (
    <div>
      State:
      <Select options={Object.keys(states).map(mapStringToSelectOption)} value={mapStringToSelectOption(state)} onChange={(v) => setState(v.value)} />
      County:
      <Select options={Object.keys(states[state].counties).map(mapStringToSelectOption)} value={mapStringToSelectOption(county)} onChange={(v) => setCounty(v.value)} />
      <div style={{ display: 'flex' }}>
        <AreaChart
          {...props}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis domain={[0, getMax('cases')]} />

          <Tooltip />

          {Object.keys(states[state].keys).filter((k) => k.includes('cases')).map((k) => <Area type="monotone" dataKey={k} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />)}

        </AreaChart>
        <AreaChart
          {...props}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis domain={[0, getMax('deaths')]} />

          <Tooltip />

          {Object.keys(states[state].keys).filter((k) => k.includes('deaths')).map((k) => <Area type="monotone" dataKey={k} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />)}

        </AreaChart>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ChartWithSelect />
    </div>
  );
}

export default App;
