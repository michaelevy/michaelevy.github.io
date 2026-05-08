let voice
let id = 0
let activeCells =[]
let initialised = false
let bars = 2
let beats = 4
const highestNote = 4

function initSequence(){
    Brain.init()
    voice = Brain.newVoice(beats, bars)
    initialised = true
}

function numberFromAttribute(target, name) {
    let attr = target.attributes.getNamedItem(name);
    return Number(attr?.value)
}

function toggleCell(event) {
    if (!initialised) {
        initSequence()
    }

    const target = event.target;
    const noteId = target.id;
    const note = numberFromAttribute(target, 'note');
    const beat = numberFromAttribute(target, 'beat');
    const octave = -Math.floor(note / 7) + highestNote
    const hierarchyId = { GridId: id, PageId: 0, BeatId: beat, NoteId: note }

    console.log(`${hierarchyId}`)

    console.log(activeCells)
    if (!activeCells.includes(noteId)) {
        activeCells.push(noteId)
        voice.addNote({
            id: hierarchyId,
            note: notes[notes.length - 1 - (note % 7)] + octave,
            beat: `${beat}`,
            duration: '16n'
        })
        document.getElementById(noteId).classList.add('active')
    } else {
        activeCells = activeCells.filter(activeCell => activeCell != noteId)
        voice.removeNote(hierarchyId)
        document.getElementById(noteId).classList.remove('active')
    }
}

function isActive(key) {
    return activeCells.value.includes(key)
}

function generateGrid(horizontal, vertical, beats, bars) {
    const gridContainer = document.getElementById("sequencer-grid");

    gridContainer.innerHTML = "";

    this.bars = bars;
    this.beats = beats;
    let beatIncrement = beats * bars / horizontal;
    console.log(`Generating a ${horizontal}x${vertical} grid with ${beats} beats and ${bars} bars (beat increment: ${beatIncrement})`)
    for (let col = 0; col < vertical; col++) {
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("grid-column");
        columnDiv.id = `column-${col}`;

        for (let row = 0; row < horizontal; row++) {
            const squareDiv = document.createElement("div");
            squareDiv.classList.add("grid-square");
            squareDiv.id = `cell-${col}-${row}`;

            squareDiv.setAttribute("note", col);
            squareDiv.setAttribute("beat", row * beatIncrement); // Beat attribute logic
            squareDiv.setAttribute("onclick", "toggleCell(event)");

            gridContainer.appendChild(squareDiv);
        }

        // Append column to grid container
        // gridContainer.appendChild(columnDiv);
    }
}

function pause() {
    if (initialised) {
        Brain.pause();
    }
}
