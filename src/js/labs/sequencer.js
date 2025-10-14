let voice
let id = 0
let activeCells =[]
let initialised = false

function initSequence(){
    Brain.init()
    voice = Brain.newVoice()
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

    const hierarchyId = { GridId: id, PageId: 0, BeatId: beat, NoteId: note }

    console.log(`${hierarchyId}`)

    console.log(activeCells)
    if (!activeCells.includes(noteId)) {
        activeCells.push(noteId)
        voice.addNote({
            id: hierarchyId,
            note: notes[note % 7] + 4,
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

function generateGrid(horizontal, vertical) {
    // Get the grid container
    const gridContainer = document.getElementById("sequencer-grid");

    // Clear the existing grid
    gridContainer.innerHTML = "";

    let beatIncrement = 4/horizontal;
    // Loop through columns
    for (let col = 0; col < vertical; col++) {
        // Create a column div
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("grid-column");
        columnDiv.id = `column-${col}`;

        // Loop through rows
        for (let row = 0; row < horizontal; row++) {
            // Create a square div
            const squareDiv = document.createElement("div");
            squareDiv.classList.add("grid-square");
            squareDiv.id = `cell-${col}-${row}`;

            // Set attributes
            squareDiv.setAttribute("note", col);
            squareDiv.setAttribute("beat", row * beatIncrement); // Beat attribute logic
            squareDiv.setAttribute("onclick", "toggleCell(event)");

            // Append square to column
            columnDiv.appendChild(squareDiv);
        }

        // Append column to grid container
        gridContainer.appendChild(columnDiv);
    }
}

function pause() {
    if (initialised) {
        Brain.pause();
    }
}