/* eslint-disable no-console */
const fs = require('fs');
const readline = require('readline');

const path = '../../covid-19-data/us-counties.csv';
const jsonPath = '../src/counties.json';
const readInterface = readline.createInterface({
  input: fs.createReadStream(path),
  console: false,
});

let i = 0;
const rawData = [];
let keys = [];
console.log('Reading lines...');
readInterface.on('line', (line) => {
  const lineArray = line.split(',');
  if (i === 0) {
    keys = lineArray;
  } else {
    const json = {};
    lineArray.forEach((l, idx) => {
      json[keys[idx]] = l;
    });
    rawData.push(json);
  }
  i += 1;
});

readInterface.on('close', () => {
  console.log('Generating JSON...');
  const states = {};
  let data = {};
  rawData.forEach((x) => {
    states[x.state] = states[x.state] || { counties: {}, dates: {}, keys: {} };
    states[x.state].counties[x.county] = true;
    data[x.date] = data[x.date] || { cases: {}, deaths: {} };
    data[x.date].cases[x.state] = data[x.date].cases[x.state] || {};
    data[x.date].cases[x.state][x.county] = parseInt(x.cases, 10);
    data[x.date].deaths[x.state] = data[x.date].deaths[x.state] || {};
    data[x.date].deaths[x.state][x.county] = parseInt(x.deaths, 10);
  });

  Object.keys(states).forEach((state) => {
    states[state] = {
      counties: Object.keys(states[state].counties),
    };
    data = Object.keys(data).map((date) => ({
      date,
      ...data[date],
    }));
  });
  console.log(`Writing ${jsonPath}...`);
  fs.writeFileSync(jsonPath, JSON.stringify({ states, data }, null, 2));
  console.log(`Wrote ${jsonPath}.`);
});
