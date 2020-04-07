import React, { useState } from 'react';
import Select from 'react-select';

import Charts from './Charts';
import Options from './Options';
import Shortcuts from './Shortcuts';
import { states, data } from '../counties.json';
import { AGGREGATE_OPTIONS } from '../constants';

const mapStringToSelectOption = (k) => ({ value: k, label: k });

const ChartWithSelect = () => {
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [aggregateBy, setAggregateBy] = useState(AGGREGATE_OPTIONS[0]);

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
      shouldShow: (
        (!selectedStates.length
        || selectedStates.length > 1)
        && (!selectedCounties || !selectedCounties.length)),
      label: 'Combine states?',
      input: (
        <input
          type="checkbox"
          checked={aggregateBy === AGGREGATE_OPTIONS[0]}
          onChange={(e) => {
            const { checked } = e.target;
            setAggregateBy(AGGREGATE_OPTIONS[checked ? 0 : 1]);
          }}
        />
      ),
    },
    {
      shouldShow: selectedStates && Boolean(selectedStates.length) && selectedCounties && selectedCounties.length > 1,
      label: 'Combine counties?',
      input: (
        <input
          type="checkbox"
          onChange={(e) => {
            const { checked } = e.target;
            setAggregateBy(AGGREGATE_OPTIONS[checked ? 1 : 2]);
          }}
        />
      ),
    },
  ];
  const onShortcutChange = (s) => {
    setSelectedStates(s.states.map(mapStringToSelectOption));
    setSelectedCounties(s.counties.map(mapStringToSelectOption));
    setAggregateBy(s.aggregateBy);
  };


  return (
    <div className="container">
      <div style={{ display: 'flex' }}>
        <Options inputs={inputs} />
        <Shortcuts onChange={onShortcutChange} />
      </div>


      <Charts
        title={`United States${
          selectedStates && selectedStates.length ? ` > ${selectedStates.map((s) => s.label).join()}` : ''
        }${
          selectedCounties && selectedCounties.length ? ` > ${selectedCounties.map((s) => s.label).join()} counties` : ''
        }`}
        data={filteredData}
      />


    </div>
  );
};

export default ChartWithSelect;
