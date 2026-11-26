import {detectArchitecture, detectPlatform, downloadChoice} from './download-options.mjs';

const picker = document.querySelector('.os-picker');
const platformButtons = picker.querySelectorAll('button');
const filename = document.getElementById('targetFilename');
const requirements = document.getElementById('targetRequirements');
const downloadLink = document.getElementById('targetDownloadBtn');
const releaseLink = document.querySelector('.btn-all-releases');

const device = {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  hintPlatform: navigator.userAgentData?.platform,
  mobile: navigator.userAgentData?.mobile,
  maxTouchPoints: navigator.maxTouchPoints
};
const detected = detectPlatform(device);

function selectPlatform(os, architecture) {
  const choice = downloadChoice(os, architecture, releaseLink.href);

  for (const button of platformButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.os === os));
  }

  filename.textContent = choice.asset || 'Choose a build';
  if (choice.asset) {
    requirements.textContent = architecture === 'x64'
      ? 'x86-64. Requires POPCNT and SSE4.1.'
      : 'Linux ARM64. Requires ARMv8-A.';
  } else {
    requirements.textContent = os === 'macos'
      ? 'Choose the Apple Silicon or Intel build on GitHub.'
      : 'Check the operating system and CPU requirements before downloading.';
  }

  downloadLink.href = choice.href;
  downloadLink.textContent = choice.label;
  releaseLink.hidden = !choice.asset;
}

for (const button of platformButtons) {
  button.addEventListener('click', () => {
    const os = button.dataset.os;
    const architecture = os === detected ? detectArchitecture(os, device) : os === 'macos' ? '' : 'x64';
    selectPlatform(os, architecture);
  });
}
selectPlatform(detected, detectArchitecture(detected, device));
picker.hidden = false;

const copyButton = document.getElementById('copyTerminalBtn');
const terminalCode = document.getElementById('terminalCode');
const copyStatus = document.getElementById('copyStatus');

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(terminalCode.textContent);
    copyStatus.textContent = 'Commands copied.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(terminalCode);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Commands selected. Use your device’s Copy command.';
  }
});
copyButton.hidden = false;
