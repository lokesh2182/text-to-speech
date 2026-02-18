// ---------- TEXT TO SPEECH ----------
const input = document.getElementById("text");
const btn = document.getElementById("speakBtn");
const voiceSelect = document.getElementById("voiceSelect");

let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();
  if (!voices.length) return;

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = voice.name + " (" + voice.lang + ")";
    voiceSelect.appendChild(option);
  });
}

loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

btn.addEventListener("click", () => {
  if (!input.value.trim()) return;

  const speech = new SpeechSynthesisUtterance(input.value);
  speech.voice = voices[voiceSelect.value];

  speechSynthesis.cancel();
  speechSynthesis.speak(speech);
});


// ---------- VOICE RECORDER ----------
let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startRec");
const stopBtn = document.getElementById("stopRec");
const audioPlayback = document.getElementById("audioPlayback");
const downloadLink = document.getElementById("downloadLink");

startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    audioPlayback.src = audioUrl;

    downloadLink.href = audioUrl;
    downloadLink.download = "recording.wav";
    downloadLink.textContent = "Download Recording";
  };

  mediaRecorder.start();
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
};
