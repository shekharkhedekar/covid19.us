import React from 'react';

import { SHORTCUTS } from '../constants';

const Shortcuts = ({ onChange }) => (
  <div className="shortcuts">
    <div className="label">Shortcuts:</div>
    {SHORTCUTS.map((s) => (
      <div
        className="shortcut"
        role="button"
        onClick={() => onChange(s)}
      >
        {s.name}
      </div>
    ))}
  </div>
);

export default Shortcuts;
