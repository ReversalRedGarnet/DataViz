// Shared metric definitions used by RippleChain and ComparisonView.
// Filenames match the DATASETS TODO list in data-pipeline/clean_data.py.
// Currently backed by DUMMY data in public/data/ -- see README TODOs.
export const METRICS = [
  {
    key: 'affected_persons',
    file: 'disaster_affected_persons.json',
    field: 'affected_persons',
    label: 'People affected',
  },
  {
    key: 'economic_loss',
    file: 'disaster_economic_loss.json',
    field: 'economic_loss_usd_million',
    label: 'Economic loss (US$M)',
  },
  {
    key: 'crop_yield',
    file: 'crop_yield.json',
    field: 'crop_yield_index',
    label: 'Crop yield index',
  },
  {
    key: 'tourist_arrivals',
    file: 'tourist_arrivals.json',
    field: 'tourist_arrivals_index',
    label: 'Tourist arrivals index',
  },
  {
    key: 'power_generation',
    file: 'power_generation.json',
    field: 'power_generation_index',
    label: 'Power generation index',
  },
]
