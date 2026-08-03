"""
Ripple -- data cleaning pipeline
---------------------------------
One-time, offline script. Not run in the browser (see README.md -> stack).

Usage:
    1. Manually export the chosen official datasets as CSV from
       https://stats.pacificdata.org/ into data-pipeline/raw/
    2. Run:  python clean_data.py
    3. Cleaned JSON lands in ../public/data/, ready for the frontend to
       fetch via src/utils/loadData.js

TODO once the hazard + two countries are locked (README -> "Scope (locked)"):
    - filter each raw CSV down to just those two countries
    - align on a shared event/year window
    - export one JSON file per dataset below
"""

import json
from pathlib import Path

import pandas as pd

RAW_DIR = Path(__file__).parent / "raw"
OUT_DIR = Path(__file__).parent.parent / "public" / "data"

# TODO: fill in once datasets are exported into raw/
DATASETS = {
    # "disaster_affected_persons.csv": "disaster_affected_persons.json",
    # "disaster_economic_loss.csv": "disaster_economic_loss.json",
    # "crop_yield.csv": "crop_yield.json",
    # "tourist_arrivals.csv": "tourist_arrivals.json",
    # "power_generation.csv": "power_generation.json",
}


def clean_one(csv_name: str, json_name: str) -> None:
    df = pd.read_csv(RAW_DIR / csv_name)
    # TODO: filter to the two locked countries + shared event window,
    # rename columns to whatever the frontend components expect.
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    df.to_json(OUT_DIR / json_name, orient="records")


def main() -> None:
    if not DATASETS:
        print("No datasets registered yet -- see TODOs in this file.")
        return
    for csv_name, json_name in DATASETS.items():
        clean_one(csv_name, json_name)
        print(f"wrote {json_name}")


if __name__ == "__main__":
    main()
