# Coco Chess Engine website

The public homepage for **Coco Chess Engine**, a free, open-source C++20 UCI
chess engine with NNUE evaluation and Lazy SMP multithreading.

- [Visit the website](https://notkaede-11.github.io/coco-engine-website/)
- [Engine source and setup guide](https://github.com/NotKaede-11/Coco-Engine)
- [Download Coco](https://github.com/NotKaede-11/Coco-Engine/releases/latest)

This repository contains the website only. Engine binaries and release evidence
are maintained in the engine repository.

## Development

```sh
python -m http.server 8765 --directory website
python scripts/check_website.py
node --test scripts/test_website_download.mjs
python scripts/check_public_files.py
```

Open http://localhost:8765/. The site uses static HTML, CSS and JavaScript with
self-hosted fonts; no package installation or build is needed. The main content
and release links work without JavaScript. Optional platform detection stays
in the browser and does not send device information to a server.

## Publishing

GitHub Pages uses GitHub Actions. Pushes to main validate and deploy only the
website directory. Pull requests validate without deploying. In repository
Settings > Pages, use GitHub Actions as the source.

The canonical address, social URLs, structured data and sitemap must stay in
sync. After changing the public address, update scripts/check_website.py too.
Update release.json and the visible release details when a new engine ships.

The project's nested robots.txt does not control crawling: crawlers consult
https://notkaede-11.github.io/robots.txt. Verify that policy after deployment.
Submit the sitemap through verified Google Search Console and Bing Webmaster
Tools properties. Submission does not guarantee indexing or AI citations.

## Assets and license

Website code is licensed under GPL-3.0; see LICENSE. The hat is the creator's
original Coco logo. Amiri and Gloock fonts retain their included SIL Open Font
Licenses. Asset sources are recorded in website/assets/provenance.json.
No AI-generated illustration is included. Coco is named after the character
from Witch Hat Atelier and is unaffiliated with the series' creators or publishers.

## Public-file boundary

The gitignore uses an explicit file allowlist. New public files must be added
deliberately to that list and the public-file validator. CI checks tracked files
for unexpected paths, common secret formats and personal filesystem paths.
These checks complement review; they do not guarantee detection of every secret.
