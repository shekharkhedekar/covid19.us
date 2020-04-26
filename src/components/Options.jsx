import React from 'react';

const Options = ({ inputs }) => (
  <div className="chart-options">
    <div className="form">
      <h2>Filters</h2>
      {inputs.map((i) => (i.shouldShow ? (
        <div className="form-row" key={i.label}>
          <div className="label">
            {i.label ? <span>{`${i.label}:`}</span> : null}
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
