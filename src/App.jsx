import React, { useState } from 'react';
import {
  LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid,
} from 'recharts';
import Select from 'react-select';

import './App.css';

import { states, data } from './counties.json';

const AGGREGATE_OPTIONS = [
  { label: 'U.S.', value: 'state' },
  { label: 'States', value: 'county' },
  { label: 'Counties', value: 'none' },
];
const SHORTCUTS = [
  {
    name: 'U.S.',
    states: [],
    counties: [],
    aggregateBy: AGGREGATE_OPTIONS[0],
  },
  {
    name: 'California',
    states: ['California'],
    counties: [],
    aggregateBy: AGGREGATE_OPTIONS[1],
  },
  {
    name: 'SF Bay Area',
    states: ['California'],
    counties: ['Santa Clara', 'Alameda', 'San Francisco', 'Contra Costa', 'San Mateo', 'Marin'],
    aggregateBy: AGGREGATE_OPTIONS[2],
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload.length) {
    return null;
  }

  const sorted = payload.sort((a, b) => (a.value > b.value ? -1 : 1));

  const date = new Date(label);
  return (
    <div className="tooltip">
      {sorted.map((item) => (
        <p>
          <span className="tooltip-label">
            {date.toLocaleDateString()}
          </span>
          {' '}
          <strong>{item.value.toLocaleString()}</strong>
          {' '}
          {item.name.replace(/-/g, ' ').replace('combined', '')}
        </p>
      ))}

    </div>
  );
};

const getMax = (key) => data.reduce((acc, current) => {
  const keys = Object.keys(current).filter((k) => k.includes(key));
  const values = keys.map((key) => current[key]);
  return Math.max(acc, Math.round(Math.max.apply(null, values) * 1.1));
}, 0);

const Chart = ({ name, chartProps, data }) => (
  <div>
    <h3 className="chart-title">
      {name}
    </h3>
    <LineChart
      {...chartProps}
    >
      <XAxis dataKey="date" angle={-45} textAnchor="end" />
      <YAxis
        domain={[0, getMax(name)]}
        interval={0}
      />
      <CartesianGrid />
      <Tooltip content={CustomTooltip} />

      {Object.keys(data[data.length - 1]).filter((k) => k.includes(name)).map((k) => (<Line type="natural" dataKey={k} stroke="#8884d8" />))}

    </LineChart>
  </div>
);

const mapStringToSelectOption = (k) => ({ value: k, label: k });
export const ChartWithSelect = () => {
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [aggregateBy, setAggregateBy] = useState(AGGREGATE_OPTIONS[0]);

  const includesState = (s) => !selectedStates || !selectedStates.length || (selectedStates.map((st) => st.value).includes(s));
  const includesCounty = (c) => !selectedCounties || !selectedCounties.length || (selectedCounties.map((ct) => ct.value).includes(c));

  const getData = (d, k) => {
    const output = {};
    Object.keys(d[k]).forEach((state) => {
      if (includesState(state)) {
        Object.keys(d[k][state]).forEach((county) => {
          if (includesCounty(county)) {
            let key;
            switch (aggregateBy.value) {
              case 'state':
                key = k;
                break;
              case 'county':
                key = `${state} ${k}`;
                break;
              default:
                key = `${county}, ${state} ${k}`;
            }
            output[key] = output[key] || 0;
            output[key] += d[k][state][county];
          }
        });
      }
    });

    return output;
  };
  const filteredData = data.map((d) => ({ date: d.date, ...getData(d, 'cases'), ...getData(d, 'deaths') }));
  const statesList = Object.keys(states).map(mapStringToSelectOption);
  const countiesList = Object.keys(states).reduce((acc, s) => {
    const state = states[s];

    if (includesState(s)) {
      return acc.concat(state.counties);
    }
    return acc;
  }, []).map(mapStringToSelectOption);


  const props = {
    width: 700,
    height: 700,
    data: filteredData,
    onClick: (v) => console.log('clicked', v),
    margin: {
      top: 25, right: 30, left: 70, bottom: 100,
    },
  };
  return (
    <div className="container">
      <div style={{ display: 'flex' }}>

        <div className="form">


          <div className="form-row">
            <div className="label">Narrow by State:</div>
            <div className="select">
              <Select
                options={statesList}
                value={selectedStates}
                onChange={(v) => {
                  setAggregateBy(AGGREGATE_OPTIONS[v ? 1 : 0]);
                  setSelectedStates(v);
                }}
                isMulti
              />
            </div>
          </div>

          {selectedStates && Boolean(selectedStates.length) && (
            <div className="form-row">
              <div className="label">Narrow by County:</div>
              <div className="select">
                <Select
                  options={countiesList}
                  value={selectedCounties}
                  onChange={(v) => {
                    setAggregateBy(AGGREGATE_OPTIONS[v ? 2 : 1]);
                    setSelectedCounties(v);
                  }}
                  isMulti
                />
              </div>
            </div>
          )}
        </div>


        <div className="shortcuts">
          <div className="label">Shortcuts:</div>
          {SHORTCUTS.map((s) => (
            <div
              className="shortcut"
              role="button"
              onClick={() => {
                setSelectedStates(s.states.map(mapStringToSelectOption));
                setSelectedCounties(s.counties.map(mapStringToSelectOption));
                setAggregateBy(s.aggregateBy);
              }}
            >
              {s.name}
            </div>
          ))}

        </div>
      </div>

      <h2>
        {selectedStates && selectedStates.length ? selectedStates.map((s) => s.label).join() : 'The U.S.'}
        {selectedCounties && selectedCounties.length ? ` (${selectedCounties.map((s) => s.label).join()} counties)` : ''}
      </h2>
      <div style={{ display: 'flex' }}>
        <Chart name="cases" chartProps={props} data={filteredData} />
        <Chart name="deaths" chartProps={props} data={filteredData} />
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
