const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")
const path = require('path')
const server = express()
const getColors = require('get-image-colors')
const fs = require('fs')

server.use(cors())
server.use(bodyParser.json({ limit: '15mb' }));
// server.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));


const options = {
    count: 7,
    type: 'image/jpeg'
}

let hslValuesArray = []
let hexArray = []

let notes = []
let palette = [];

function getPalette(colors) {
    palette.push(colors)
}

function getNotes(hslArr) {
    console.log('hslArr', hslArr)
    if ((0 <= hslArr[0] && hslArr[0] <= 29)) {
        notes.push("F4")
    } else if ((30 <= hslArr[0] && hslArr[0] <= 59)) {
        notes.push("F#4")
    } else if ((60 <= hslArr[0] && hslArr[0] <= 89)) {
        notes.push("G4")
    } else if ((90 <= hslArr[0] && hslArr[0] <= 119)) {
        notes.push("G#4")
    } else if ((120 <= hslArr[0] && hslArr[0] <= 149)) {
        notes.push("A4")
    } else if ((150 <= hslArr[0] && hslArr[0] <= 179)) {
        notes.push("A#4")
    } else if ((180 <= hslArr[0] && hslArr[0] <= 209)) {
        notes.push("B4")
    } else if ((210 <= hslArr[0] && hslArr[0] <= 239)) {
        notes.push("C5")
    } else if ((240 <= hslArr[0] && hslArr[0] <= 269)) {
        notes.push("C#5")
    } else if ((270 <= hslArr[0] && hslArr[0] <= 299)) {
        notes.push("D5")
    } else if ((300 <= hslArr[0] && hslArr[0] <= 329)) {
        notes.push("D#5")
    } else if ((330 <= hslArr[0] && hslArr[0] <= 359)) {
        notes.push("E5")
    }
}

const deleteFileOnServer = () => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path.join(__dirname, 'out.jpeg'))) {
            fs.unlink(path.join(__dirname, 'out.jpeg'), (err) => {
                if (err) {
                    console.log(err)
                    reject()
                }
                console.log(`${path.join(__dirname, 'out.jpeg')} was deleted successfully`);
                resolve()
            })
        }
    })
}

deleteFileOnServer()


server.post("/upload-image", (req, res) => {
    console.log("UPLOAD IMAGE CALLED")
    deleteFileOnServer()
    try {
        let base64Data = req.body.file.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        fs.writeFileSync(path.join(__dirname, "out.jpeg"), base64Data, {
            encoding: "base64",
            mode: 0o666
        });
        return JSON.stringify({ message: "File stored on the disk successfully" })
    } catch (error) {
        console.log(first)
        return err
    }

})

server.get("/getnotes", (req, res) => {
    if (fs.existsSync(path.join(__dirname, "out.jpeg"))) {
        getColors(path.join(__dirname, 'out.jpeg'), options).then(colors => {
            hexArray = (colors.map((color) => color.hex()));
            for (let i = 0; i < hexArray.length; i++) {
                getPalette(hexArray[i]);
            }
            hslValuesArray = colors.map(color => color.hsl())
            for (let i = 0; i < hslValuesArray.length; i++) {
                getNotes(hslValuesArray[i])
            }
            res.json({ notes })
        })
    } else {
        console.log("FILE DOES NOT EXIST ON THE SERVER")
    }
})

server.get("/getPalette", (req, res) => {
    res.json({ palette });

});




server.listen("5001", () => { console.log(`Server running at http://localhost:5001`) })
