"""Audit tracked public files; print locations, never matching secret values."""
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ALLOWED = set(['.gitattributes', '.github/workflows/pages.yml', '.gitignore', 'LICENSE', 'README.md', 'release.json', 'scripts/check_public_files.py', 'scripts/check_website.py', 'scripts/test_website_download.mjs', 'website/.nojekyll', 'website/assets/OFL-Amiri.txt', 'website/assets/OFL-Gloock.txt', 'website/assets/amiri-latin.woff2', 'website/assets/coco-hat.png', 'website/assets/gloock-latin.woff2', 'website/assets/provenance.json', 'website/download-options.mjs', 'website/index.html', 'website/llms.txt', 'website/llms-full.txt', 'website/robots.txt', 'website/site.js', 'website/sitemap.xml', 'website/style.css'])
tracked = set(subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).decode().strip('\0').split('\0'))
assert tracked == ALLOWED, 'Unexpected or missing tracked public files: ' + repr(tracked ^ ALLOWED)
patterns = [r'[A-Za-z]:[\\/](?:Users|home)[\\/]', r'/(?:home|Users)/[^/\s]+/', r'(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,})', r'-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----']
for name in tracked:
    path = ROOT / name
    assert not path.is_symlink(), 'Symlink in public files: ' + name
    if path.suffix in ('.png', '.woff2'):
        continue
    content = path.read_text(encoding='utf-8')
    assert not any(re.search(pattern, content, re.I) for pattern in patterns), 'Potential private data in ' + name
print(f'Public-file audit passed: {len(tracked)} explicitly allowed files.')
