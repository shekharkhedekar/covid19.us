import React from 'react';

const Options = ({ inputs }) => (
  <div className="chart-options">
    <div className="form">
      <h2>Filters</h2>
      {inputs.map((i) => (i.shouldShow ? (
        <div className="form-row">
          <div className="label">
            {i.label}
            :
          </div>
          <div className="select">
            {i.input}
          </div>
        </div>
      ) : null))}
    </div>
  </div>
);

export default Options;
