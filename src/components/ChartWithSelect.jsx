import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import Charts from './Charts';
import Options from './Options';
import Shortcuts from './Shortcuts';
import { states, data } from '../counties.json';
import { AGGREGATE_OPTIONS } from '../constants';

const mapStringToSelectOption = (k) => ({ value: k, label: k });

const ChartWithSelect = () => {
  // State
  // const [states, setStates] = useState();
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [aggregateBy, setAggregateBy] = useState(AGGREGATE_OPTIONS[0]);
  const [activeDotValue, setActiveDotValue] = useState();
  const [countyPopulations, setCountyPopulations] = useState();
  const [isPerCapita, setIsPerCapita] = useState();
  console.log('data', data);

  useEffect(() => {
    const getCensusResults = async () => {
      const response = await fetch('https://api.census.gov/data/2019/pep/population?get=POP,NAME&for=county:*');
      const json = await response.json();
      const output = json.reduce((acc, current) => {
        const population = current[0];
        const countyState = current[1].split(',');
        const county = countyState[0];

        if (!countyState[1]) {
          return acc;
        }
        const state = countyState[1].replace(/\s/, '');
        acc[state] = acc[state] || {};
        acc[state][county] = population;
        return acc;
      }, {});
      setCountyPopulations(output);
    };


    getCensusResults();
  }, []);

  // State Helpers
  const includesState = (s) => (
    !selectedStates || !selectedStates.length || (selectedStates.map((st) => st.value).includes(s))
  );
  const includesCounty = (c) => (
    !selectedCounties
    || !selectedCounties.length || (selectedCounties.map((ct) => ct.value).includes(c))
  );
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
            // output[key] += d[k][state][county] / (isPerCapita ? countyPopulations[state][county] : 1);
          }
        });
      }
    });

    return output;
  };

  // Variables
  const filteredData = data.map((d) => ({ date: d.date, ...getData(d, 'newCases'), ...getData(d, 'newDeaths') }));
  console.log({ filteredData });
  const statesList = Object.keys(states).sort().map(mapStringToSelectOption);
  const countiesList = Object.keys(states).reduce((acc, s) => {
    const state = states[s];

    if (includesState(s)) {
      return acc.concat(state.counties);
    }
    return acc;
  }, []).sort().map(mapStringToSelectOption);
  const inputs = [
    {
      shouldShow: true,
      label: 'State',
      input: (
        <Select
          options={statesList}
          value={selectedStates}
          onChange={(v) => {
            setAggregateBy(AGGREGATE_OPTIONS[v && v.length ? 1 : 0]);
            setSelectedStates(v);
          }}
          isMulti
        />),
    },
    {
      shouldShow: selectedStates && Boolean(selectedStates.length),
      label: 'County',
      input: (
        <Select
          options={countiesList}
          value={selectedCounties}
          onChange={(v) => {
            setAggregateBy(AGGREGATE_OPTIONS[v && v.length ? 2 : 1]);
            setSelectedCounties(v);
          }}
          isMulti
        />),
    },
    {
      shouldShow: !selectedStates || !selectedStates.length,
      input: (
        <label className="label" htmlFor="states">
          <input
            name="states"
            type="checkbox"
            checked={aggregateBy === AGGREGATE_OPTIONS[0]}
            onChange={(e) => {
              const { checked } = e.target;
              setAggregateBy(AGGREGATE_OPTIONS[checked ? 0 : 1]);
            }}
          />
          {' '}
          Combine states into one line
        </label>
      ),
    },
    {
      shouldShow: true,
      input: (
        <label className="label" htmlFor="per-capita">
          <input
            name="per-capita"
            type="checkbox"
            checked={isPerCapita}
            onChange={(e) => {
              const { checked } = e.target;
              setIsPerCapita(Boolean(checked));
            }}
          />
          {' '}
          Use Per Capita
        </label>
      ),
    },
    {
      shouldShow: selectedStates && Boolean(selectedStates.length) && (!selectedCounties || selectedCounties.length === 0 || selectedCounties.length > 1),
      input: (
        <label className="label" htmlFor="counties">
          <input
            name="counties"
            type="checkbox"
            checked={aggregateBy === AGGREGATE_OPTIONS[1]}
            onChange={(e) => {
              const { checked } = e.target;
              setAggregateBy(AGGREGATE_OPTIONS[checked ? 1 : 2]);
            }}
          />
          {' '}
          Combine Counties into one line
        </label>
      ),
    },
  ];

  // Handlers
  const onShortcutChange = (s) => {
    setSelectedStates(s.states.map(mapStringToSelectOption));
    setSelectedCounties(s.counties.map(mapStringToSelectOption));
    setAggregateBy(s.aggregateBy);
  };
  const onDotMouseOver = (e) => { setActiveDotValue(e.value); };


  return (
    <div className="container">
      <div className="controls">
        <Options inputs={inputs} />
        <Shortcuts onChange={onShortcutChange} />
      </div>


      <Charts
        title={`United States${
          selectedStates && selectedStates.length ? ` > ${selectedStates.map((s) => s.label).join(', ')}` : ''
        }${
          selectedCounties && selectedCounties.length ? ` > ${selectedCounties.map((s) => s.label).join(', ')} counties` : ''
        }`}
        data={filteredData}
        onDotMouseOver={onDotMouseOver}
        activeDotValue={activeDotValue}
      />


    </div>
  );
};

export default ChartWithSelect;
