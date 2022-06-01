const getImpulseBuffer = async (audioCtx, impulseUrl) => {
    return await fetch(impulseUrl)
    .then(response => response.arrayBuffer())
    .then(data => {
      return audioCtx.decodeAudioData(data, b => {
        buffer = b;
      });
    })
    .catch(e => onError('Failed to load reverb impulse'));
}

const getLiveAudio = (audioCtx) => {
    return navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => audioCtx.createMediaStreamSource(stream));
} 

async function startAudio(){
    const ctx = new window.AudioContext()

    const stream = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:false
    })
    
    const input = ctx.createMediaStreamSource(stream)
    const output = ctx.createGain()

    const convolver = ctx.createConvolver()
    convolver.buffer = await getImpulseBuffer(ctx, "src/impulse.wav")

    input.connect(convolver).connect(ctx.destination)

    // const osc = ctx.createOscillator()
    // osc.frequency.value = 3000;
    // osc.detune.value = 10
    // osc.connect(output.gain)
    // osc.start(0)


    input.connect(output)
    output.connect(ctx.destination)
}

async function init(){
    document.getElementById('start').addEventListener('click', startAudio)
}
init()