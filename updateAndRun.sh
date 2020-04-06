#!/bin/bash
echo "Pulling the latest data..."
cd ../covid-19-data
git pull
echo "Successfully pulled the latest data."
cd ../covid19.us/scripts
node csvtojson.js
cd ..
atom .
npm start
