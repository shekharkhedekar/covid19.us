export const AGGREGATE_OPTIONS = [
  { label: 'U.S.', value: 'state' },
  { label: 'States', value: 'county' },
  { label: 'Counties', value: 'none' },
];
export const SHORTCUTS = [
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
    name: 'New York',
    states: ['New York'],
    counties: [],
    aggregateBy: AGGREGATE_OPTIONS[1],
  },
  {
    name: 'Massachusetts',
    states: ['Massachusetts'],
    counties: [],
    aggregateBy: AGGREGATE_OPTIONS[1],
  },
  {
    name: 'Washington',
    states: ['Washington'],
    counties: [],
    aggregateBy: AGGREGATE_OPTIONS[1],
  },
  {
    name: 'Boston Area',
    states: ['Massachusetts'],
    counties: ['Suffolk', 'Norfolk, Middlesex', 'Essex'],
    aggregateBy: AGGREGATE_OPTIONS[1],
  },
  {
    name: 'SF Bay Area',
    states: ['California'],
    counties: ['Santa Clara', 'Alameda', 'San Francisco', 'Contra Costa', 'San Mateo', 'Marin'],
    aggregateBy: AGGREGATE_OPTIONS[1],
  },
];
