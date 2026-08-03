"""
Ripple -- data cleaning pipeline
---------------------------------
One-time, offline script. Not run in the browser (see README.md -> stack).

Usage:
    1. Export each dataset below as CSV from https://stats.pacificdata.org/
       (direct links in README.md -> "Data Sources") into
       data-pipeline/raw/, renamed exactly as the keys in DATASETS below
       (e.g. disaster_affected_persons.csv).
    2. Run:  python clean_data.py
    3. Cleaned JSON lands in ../public/data/, ready for the frontend to
       fetch via src/utils/loadData.js

NOTE ON RAW COLUMN NAMES: Pacific Data Hub / .Stat Explorer CSV exports
commonly use GEO_PICT (or REF_AREA) for country, TIME_PERIOD for year, and
OBS_VALUE for the number -- this script assumes those first. Each export
can differ slightly, so on first run this prints the columns it actually
found in every file; if a KeyError below points you at that printout,
add the real header name to the *_COL_CANDIDATES lists.
"""

import json
from pathlib import Path

import pandas as pd

RAW_DIR = Path(__file__).parent / "raw"
OUT_DIR = Path(__file__).parent.parent / "public" / "data"

# Locked scope -- see README.md -> "Scope (locked)"
NATIONS = ["Solomon Islands", "Vanuatu", "Fiji", "Tonga"]

# Alternate codes some PDH exports use instead of full country names --
# extend a list here if a particular dataset uses a different scheme.
NATION_CODES = {
    "Solomon Islands": ["SB", "SLB"],
    "Vanuatu": ["VU", "VUT"],
    "Fiji": ["FJ", "FJI"],
    "Tonga": ["TO", "TON"],
}

# raw filename in data-pipeline/raw/ -> (output json name, field name).
# Field names must match src/utils/metrics.js exactly.
DATASETS = {
    "disaster_affected_persons.csv": ("disaster_affected_persons.json", "affected_persons"),
    "disaster_economic_loss.csv": ("disaster_economic_loss.json", "economic_loss_usd_million"),
    "crop_yield.csv": ("crop_yield.json", "crop_yield_index"),
    "tourist_arrivals.csv": ("tourist_arrivals.json", "tourist_arrivals_index"),
    "power_generation.csv": ("power_generation.json", "power_generation_index"),
}

COUNTRY_COL_CANDIDATES = ["GEO_PICT", "REF_AREA", "Pacific Island Countries and territories", "Country"]
TIME_COL_CANDIDATES = ["TIME_PERIOD", "Year"]
VALUE_COL_CANDIDATES = ["OBS_VALUE", "Value"]


def _find_col(df, candidates, label):
    for c in candidates:
        if c in df.columns:
            return c
    raise KeyError(
        f"Couldn't find a {label} column. Columns in this file are: "
        f"{list(df.columns)} -- add the real name to the candidates list at the top of this file."
    )


def _matches_nation(raw_value, nation) -> bool:
    raw_value = str(raw_value).strip()
    if raw_value.lower() == nation.lower():
        return True
    return raw_value.upper() in NATION_CODES.get(nation, [])


def clean_one(csv_name: str, json_name: str, field_name: str) -> None:
    df = pd.read_csv(RAW_DIR / csv_name)
    print(f"\n{csv_name}: columns found -> {list(df.columns)}")

    country_col = _find_col(df, COUNTRY_COL_CANDIDATES, "country")
    time_col = _find_col(df, TIME_COL_CANDIDATES, "year")
    value_col = _find_col(df, VALUE_COL_CANDIDATES, "value")

    rows = []
    for nation in NATIONS:
        mask = df[country_col].apply(lambda v: _matches_nation(v, nation))
        matched = df[mask]
        print(f"  {nation}: {len(matched)} rows matched")
        for _, r in matched.iterrows():
            rows.append(
                {
                    "nation": nation,
                    "year": int(r[time_col]),
                    field_name: r[value_col],
                }
            )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUT_DIR / json_name, "w") as f:
        json.dump(rows, f, indent=2)
    print(f"  wrote {json_name} ({len(rows)} rows total)")


def main() -> None:
    any_found = False
    problems = []
    for csv_name, (json_name, field_name) in DATASETS.items():
        path = RAW_DIR / csv_name
        if not path.exists():
            print(f"Skipping {csv_name} -- not found in {RAW_DIR}. See README.md -> Data Sources.")
            continue
        any_found = True
        try:
            clean_one(csv_name, json_name, field_name)
        except KeyError as e:
            print(f"  PROBLEM in {csv_name}: {e}")
            problems.append(csv_name)

    if not any_found:
        print("\nNo raw CSVs found yet -- export them into data-pipeline/raw/ first.")
    elif problems:
        print(f"\n{len(problems)} file(s) need a column-name fix before rerunning: {problems}")
    else:
        print("\nAll datasets cleaned with no problems.")


if __name__ == "__main__":
    main()
