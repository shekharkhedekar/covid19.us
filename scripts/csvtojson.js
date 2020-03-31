
const fs = require('fs');
const readline = require('readline');

const path = '../../covid-19-data/us-counties.csv';
const jsonPath = '../src/counties.json';
const readInterface = readline.createInterface({
    input: fs.createReadStream(path),
    console: false
});

let = i = 0;
let rawData = [];
let keys = [];
readInterface.on('line', function(line) {
    const lineArray = line.split(',');
    if (i === 0) {
        keys = lineArray;
    } else {
        const json = {};
        lineArray.forEach((l,i) => {
            json[keys[i]] = l;
        });
        rawData.push(json)
    }
    i++;
});

readInterface.on('close', function() {
    const states = {}
    rawData.forEach(x => {
        states[x.state] = states[x.state] || {counties: {}, dates: {}, keys: {}};
        states[x.state].counties[x.county] = true;
        states[x.state].dates[x.date] = states[x.state].dates[x.date] || {date: x.date};
        states[x.state].dates[x.date][`${x.county}-cases`] = x.cases;
        states[x.state].dates[x.date][`${x.county}-deaths`] = x.deaths;
        states[x.state].keys[`${x.county}-cases`] = true;
        states[x.state].keys[`${x.county}-deaths`] = true;
    })

    fs.writeFileSync(jsonPath, JSON.stringify(states, null, 2))


})
