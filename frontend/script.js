let monoSynth;

function setup() {
    let cnv = createCanvas(100, 100);
    cnv.mousePressed(playSynth);
    background(220);
    textAlign(CENTER);
    text('Tap to Play', width / 2, height / 2);
    cnv.center("horizontal");

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
        let rythm1 = []
        rythm1.push(notes[0])
        rythm1.push(notes[2])
        rythm1.push(notes[4])
        
        rythm1.push(notes[1])
        rythm1.push(notes[3])
        rythm1.push(notes[5])

        rythm1.push(notes[2])
        rythm1.push(notes[4])
        rythm1.push(notes[6])

        rythm1.push(notes[1])
        rythm1.push(notes[4])
        rythm1.push(notes[6])
    
        // note velocity (volume, from 0 to 1)
        let velocity = random();
        // time from now (in seconds)
        let time = 0;
        // note duration (in seconds)
        let dur = 1 / 6;
        for (let i in rythm1) {
            monoSynth.play(rythm1[i], velocity, time+i, dur);
        }
        
    })
}