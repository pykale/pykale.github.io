# KaleCancer interactive page

This directory contains the self-contained KaleCancer research narrative served at `/cancer/` by the PyKale Hugo site.

## Structure

- `index.html` contains the semantic page structure.
- `assets/css/cancer.css` contains presentation and responsive layout rules.
- `assets/js/cancer-data.js` contains the narrative, taxonomy, and map definitions.
- `assets/js/cancer.js` contains filtering, rendering, and interactions.
- `assets/images/` contains page-specific image assets.
- `metadata.json` provides machine-readable discovery and provenance metadata.
- `CITATION.cff` provides citation metadata for people and software tools.
- `LICENSE.md` records the licensing boundary between software, data, and visual assets.

All paths are relative so the page works locally and when deployed below the Hugo site's `/cancer/` route.

## FAIR considerations

The page applies FAIR principles within this directory:

- **Findable:** descriptive HTML metadata, stable project links, keywords, and a machine-readable metadata record.
- **Accessible:** static files use standard web formats and public HTTP links; core content remains available without an account.
- **Interoperable:** metadata uses Schema.org terms and JSON-LD, while citation information follows Citation File Format 1.2.
- **Reusable:** source and dataset provenance are explicit, and the MIT software licence is linked without applying it to the separately licensed HANCOCK data.

## Sources and licences

- [KaleCancer](https://github.com/pykale/cancer) is available under the [MIT License](https://github.com/pykale/cancer/blob/main/LICENSE).
- [HANCOCK](https://hancock.research.fau.eu/) is an independently published dataset and retains its own licence and attribution requirements.
- Third-party fonts are loaded from Google Fonts and remain subject to their respective font licences.

The page is research software and is not a clinical or diagnostic tool.

## Local verification

Serve the repository with Hugo or any static HTTP server. Opening the file directly also works because its scripts, styles, and images use relative paths.
