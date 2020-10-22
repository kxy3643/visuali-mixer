let audioCtx;

let element, sourceNode, analyserNode, gainNode;

const DEFAULTS = Object.freeze({
    gain : .5,
    numSamples: 256
});

let highPass = Object.seal({
    freq : 12000,
    q : 0.5,
});

let lowPass = Object.seal({
    freq : 100,
    q : 0.5,
});


let audioData = new Uint8Array(DEFAULTS.numSamples/2);
let highPassFilter;
let lowPassFilter;


function setupWebaudio(filePath){
// 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

// 2 - this creates an <audio> element
    element = new Audio();

// 3 - have it point at a sound file
    loadSoundFile(filePath);

// 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

// 5 - create an analyser node
// note the UK spelling of "Analyser"
    analyserNode = audioCtx.createAnalyser();

/*
// 6
We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
across the sound spectrum.

If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
the amplitude of that frequency.
*/ 

// fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

// 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

// 8 - create the filters
    highPassFilter = audioCtx.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.setValueAtTime(0, audioCtx.currentTime);
    highPassFilter.Q.setValueAtTime(highPass.q, audioCtx.currentTime);
    

    lowPassFilter = audioCtx.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.setValueAtTime(22000, audioCtx.currentTime);
    lowPassFilter.Q.setValueAtTime(lowPass.q, audioCtx.currentTime);


// 9 - connect the nodes - we now have an audio graph
    sourceNode.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}


function loadSoundFile(filePath){
    element.src = filePath;
}

function playCurrentSound(){
    element.play();
}

function pauseCurrentSound(){
    element.pause();
}

function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

function setHighPassFreq(value){
    highPassFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
    highPass.freq = value;
}

function setHighPassQ(value){
    highPassFilter.Q.setValueAtTime(value, audioCtx.currentTime);
    highPass.q = value;
}

function setLowPassFreq(value){
    lowPassFilter.frequency.setValueAtTime(value, audioCtx.currentTime);
    lowPass.freq = value;
}

function setLowPassQ(value){
    lowPassFilter.Q.setValueAtTime(value, audioCtx.currentTime);
    lowPass.q = value;
}

function toggleHighPass(highPassStatus){
    if(highPassStatus){
        highPassFilter.frequency.setValueAtTime(highPass.freq, audioCtx.currentTime);
        highPassFilter.Q.setValueAtTime(highPass.q, audioCtx.currentTime);
    }else{
        highPassFilter.frequency.setValueAtTime(0, audioCtx.currentTime);
        highPassFilter.Q.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleLowPass(lowPassStatus){
    if(lowPassStatus){
        lowPassFilter.frequency.setValueAtTime(lowPass.freq, audioCtx.currentTime);
        lowPassFilter.Q.setValueAtTime(lowPass.q, audioCtx.currentTime);
    }else{
        lowPassFilter.frequency.setValueAtTime(22000, audioCtx.currentTime);
        lowPassFilter.Q.setValueAtTime(0, audioCtx.currentTime);
    }
}

export {audioCtx,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,
    setVolume,analyserNode,setHighPassFreq,setHighPassQ,setLowPassFreq,setLowPassQ,
    toggleHighPass,toggleLowPass};