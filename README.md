# web
# HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="script.js" defer></script>
    <title>File Web Api</title>
    <style>
        body{
            font-size: 1rem;
            overflow: hidden;
            background-color: rgb(2, 31, 32);
            color: aliceblue;
        }
        .main > input{
            margin-top: 1.5rem;
        }
        .interaction-section{
            margin: 1rem;
            border: 0.2rem solid cornflowerblue;
            border-radius: 1rem;
            padding: 1rem;
        }
        .input-section{
            display: flex;
            justify-content: center;
        }
        .file-info{
            display: none;
        }
    </style>
</head>
<body>
    <div class="main">
        <div class="interaction-section">
            <div class="input-section">
                <input type="file" name="video-file" id="video-file">
            </div>
            <div class="file-info">
                <p><b>File name :- </b><span id="video-file-name"></span></p>
                <p><b>File size :- </b><span id="video-file-size"></span></p>
                <p><b>File type :- </b><span id="video-file-type"></span></p>
                <p><b>File modification date :- </b><span id="video-file-mod-date"></span></p>
            </div>
        </div>
    </div>
</body>
</html>

# JavaScript
(function () {
    const videoInputNode = document.getElementById("video-file");
    const videoFileNameNode = document.getElementById("video-file-name");
    const videoFileSizeNode = document.getElementById("video-file-size");
    const videoFileTypeNode = document.getElementById("video-file-type");
    const videoFileModDateNode = document.getElementById("video-file-mod-date");
    const videoFileInfoNode = document.querySelector(".file-info");
    videoInputNode.addEventListener("input", async (event) => {
        let fileMetaData = event.target.files[0];
        if (fileMetaData) {
            videoFileInfoNode.style.display = "block";
            videoFileNameNode.innerText = fileMetaData.name;
            videoFileSizeNode.innerText = (Math.round(fileMetaData.size / (1024 ** 2))).toPrecision(4) + ' MB';
            videoFileTypeNode.innerText = fileMetaData.type.split("/").join(" - ");
            videoFileModDateNode.innerText = fileMetaData.lastModifiedDate;
            let buffer = await fileMetaData.arrayBuffer();
            console.log(buffer);

            // let bufferChunk = buffer.slice(0,14999999)
            // console.log(bufferChunk);
            // let blob = new Blob([bufferChunk], { type: fileMetaData.type })
            // console.log(blob);
            // let urlObject = URL.createObjectURL(blob)
            // console.log(urlObject);
            // let aTag = document.createElement("a")
            // aTag.href = urlObject;
            // aTag.download = fileMetaData.name
            // aTag.click()

            let unit8Array = new Uint8Array(buffer.slice(0, 5000));
            // const text = new TextDecoder().decode(unit8Array);
            const text = String.fromCharCode(...unit8Array);
            console.log(text);
        }
    });
})();

/*

var audioContext = new(window.AudioContext || window.webkitAudioContext)();
var reader = new FileReader();
var myBuffer;

const sampleRate = 16000;
const numberOfChannels = 1;

document.getElementById('file').onchange = function() {

	reader.onload = function () {
    var videoFileAsBuffer = reader.result; // arraybuffer
    audioContext.decodeAudioData(videoFileAsBuffer).then(function (decodedAudioData) {
    
      var duration = decodedAudioData.duration;

      var offlineAudioContext = new OfflineAudioContext(numberOfChannels, sampleRate * duration, sampleRate);
      var soundSource = offlineAudioContext.createBufferSource();

      myBuffer = decodedAudioData;
      soundSource.buffer = myBuffer;
      soundSource.connect(offlineAudioContext.destination);
      soundSource.start();

      offlineAudioContext.startRendering().then(function (renderedBuffer) {
        console.log({renderedBuffer}); // outputs audiobuffer
      }).catch(function (err) {
        console.log('Rendering failed: ' + err);
      });
    });
	};
  
	reader.readAsArrayBuffer(this.files[0]); // video file

};
*/
