const fileInput = document.getElementById('audioFile');
const audioEl = document.getElementById('audio');
const smiley = document.getElementById('smiley');

let audioContext, analyser, source;

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  audioEl.src = url;
  audioEl.play();
  setupAudio();
});

function setupAudio() {
  if (audioContext) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  source = audioContext.createMediaElementSource(audioEl);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  animate();
}

function getAmplitude() {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length / 255; // 0..1
}

function animate() {
  requestAnimationFrame(animate);
  if (!analyser) return;
  const amp = getAmplitude();
  const scale = 1 + amp * 0.5;
  smiley.style.transform = `scale(${scale})`;
}
