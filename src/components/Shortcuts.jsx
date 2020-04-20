import React from 'react';

import { SHORTCUTS } from '../constants';

const Shortcuts = ({ onChange }) => (
  <div className="shortcuts">
    <h2>Quick Links</h2>
    {SHORTCUTS.map((s) => (
      <button
        type="button"
        key={s.name}
        className="shortcut"
        onClick={() => onChange(s)}
      >
        {s.name}
      </button>
    ))}
  </div>
);

export default Shortcuts;
