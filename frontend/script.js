let monoSynth;

function setup() {
    let cnv = createCanvas(100, 100);
    cnv.mousePressed(playSynth);
    background(220);
    textAlign(CENTER);
    text('tap to play', width / 2, height / 2);

    monoSynth = new p5.MonoSynth();
}

function playSynth() {
    userStartAudio();

    const options = {
        method: "GET",
        "Content-Type": "application/json"
    }

    var notes = []
    fetch("http://localhost:5001/getnotes", options).then(res => res.json()).then(res => {
        console.log(`INSIDE SCRIPT.JS`, res)
        notes.push(...res['notes'])
        
        console.log(notes)
    
        let note = random(notes);
        // note velocity (volume, from 0 to 1)
        let velocity = random();
        // time from now (in seconds)
        let time = 0;
        // note duration (in seconds)
        let dur = 1 / 6;

        monoSynth.play(note, velocity, time, dur);
    })
}