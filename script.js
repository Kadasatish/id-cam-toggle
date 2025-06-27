// DOM
const dot = document.getElementById('dot');
const dotToggle = document.getElementById('dotToggle');
const camSwitch = document.getElementById('camSwitch');
const video = document.getElementById('video');
const peerIdDisplay = document.getElementById('peerId');

let stream = null;

// PeerJS
const peer = new Peer();

peer.on('open', id => {
  peerIdDisplay.textContent = `🆔 My ID: ${id}`;
  const remoteId = prompt("Enter Peer ID to connect to:");
  if (remoteId) {
    const conn = peer.connect(remoteId);

    // DOT toggle sender
    dotToggle.addEventListener("change", () => {
      const state = dotToggle.checked ? "on" : "off";
      conn.send({ type: "dot", state });
    });

    // CAM switch sender
    camSwitch.addEventListener("input", () => {
      conn.send({ type: "cam", mode: camSwitch.value });
    });
  }
});

// Connection handler
peer.on('connection', conn => {
  conn.on('data', data => {
    if (data.type === "dot") {
      const isOn = data.state === "on";
      dot.style.backgroundColor = isOn ? "white" : "black";
      dotToggle.checked = isOn;
    }

    if (data.type === "cam") {
      camSwitch.value = data.mode;
      if (data.mode === "0") startCamera("environment");
      else if (data.mode === "2") startCamera("user");
      else stopCamera();
    }
  });
});

// Start camera
function startCamera(facing) {
  if (stream) stopCamera();
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: facing } }, audio: false
  }).then(s => {
    stream = s;
    video.srcObject = stream;
    video.style.display = "block";
  }).catch(e => console.error("Camera error", e));
}

// Stop camera
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  video.style.display = "none";
    }
