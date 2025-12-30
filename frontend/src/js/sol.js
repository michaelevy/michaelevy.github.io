// Utility.js
const Note = {
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    A: "A",
    B: "B"
};

const notes = ["C", "D", "E", "F", "G", "A", "B"];

// ScheduledNote.js
function noteHierarchyEquals(note1, note2) {
    return (
        note1.GridId === note2.GridId &&
        note1.PageId === note2.PageId &&
        note1.BeatId === note2.BeatId &&
        note1.NoteId === note2.NoteId
    );
}

// Voice.js
class Voice {
    constructor(id, beats, bars) {
        this.id = id;
        this.synth = new Tone.PolySynth(Tone.Synth);
        this.notes = [];
        this.noteDict = new Map();
        this.key = Note.C;
        this.length = beats * bars;

        const filter = new Tone.Filter(250, "lowpass").toDestination();
        Tone.connect(this.synth, filter);

        this.synth.set({
            oscillator: {
                type: "sawtooth"
            },
            envelope: {
                attack: 0.5,
                decay: 0.1,
                sustain: 0.5,
                release: 1
            }
        });    
    }

    schedule(note, time) {
        this.synth.triggerAttackRelease(note.note, note.duration, time);
    }

    getNotes() {
        return this.notes;
    }

    removeNote(noteId) {
        this.removeNotes([noteId]);
    }

    removeNotes(ids) {
        this.notes = this.notes.filter(x =>
            ids.every(y => !noteHierarchyEquals(x.id, y))
        );
    }

    addNote(newNote) {
        this.addNotes([newNote]);
    }

    addNotes(newNotes) {
        this.notes = this.notes.concat(newNotes);
    }
}

class Brain {
    static bpm = 120;
    static voices = [];
    static lookahead = 0.25
    static interval = 0.05;
    static scheduled = 0;

    static init() {
        Tone.start();
        Tone.getTransport().bpm.value = this.bpm;
        this.loop()
        this.drawLoop()
        Tone.getTransport().start("+0.1");
    }

    static loop(){

        setTimeout(() => {
            let time = Tone.getTransport().seconds

            let quarterNoteDuration = Tone.Time("4n").toSeconds();
            let beatTotal = Math.floor(time / quarterNoteDuration);
            
            for (const voice of this.voices) {
                let sequenceTotal = Math.floor(beatTotal / voice.length)
                let sequenceTotalDuration = sequenceTotal * quarterNoteDuration * voice.length;
                let sequenceDuration = voice.length * quarterNoteDuration;
                let sequencePartialDuration = sequenceTotalDuration > 0 ? time % sequenceTotalDuration : time;

                let lastNote = 0
                for (const note of voice.getNotes()) {
                    let noteTime = note.beat * quarterNoteDuration
                    let scheduleTime;
                    if (noteTime < sequencePartialDuration) {
                        scheduleTime = time - sequencePartialDuration + sequenceDuration + noteTime;
                    } else {
                        scheduleTime = time - sequencePartialDuration + noteTime;
                    }
                    
                    if (scheduleTime < time + this.lookahead && scheduleTime > Brain.scheduled) {
                        // console.log(`${time}: Scheduling note ${note.note} at time ${scheduleTime}`);
                        voice.schedule(note, scheduleTime);
                        lastNote = Math.max(lastNote, scheduleTime)
                    } else{
                        // console.log(`${time}: Skipping note ${note.note} at time ${scheduleTime} (too far in the future)`);
                    }
                }

                Brain.scheduled = Math.max(Brain.scheduled, lastNote);
            }
            Brain.loop()
        }, this.interval);
    }

    static drawLoop(){

        var loop = new Tone.Loop(function(time){
            Tone.Draw.schedule(() => {
                Brain.voices.forEach(voice => {
                    const currentTimeOfEightNote = Tone.getTransport().seconds / Tone.Time("4n").toSeconds();
                    const currentBeat = currentTimeOfEightNote % voice.length;
                    const roundedBeat = Math.round(currentBeat * 2) / 2;
                    Brain.highlightCurrentBeat(roundedBeat);
                });

            }, time)
        },"32n")

        loop.start(0);
    }

    static highlightCurrentBeat(currentBeat){
        console.log(`Highlighting beat ${currentBeat}`);
        const beatElements = document.getElementsByClassName("grid-square");
        // grid-squares from sequencer.js
        for (let i = 0; i < beatElements.length; i++) {
            const element = beatElements[i];
            const beat = element.getAttribute("beat");
            if (beat == currentBeat) {
                element.classList.add("current-beat");
            } else {
                element.classList.remove("current-beat");
            }
        }
    }

    static newVoice(beats, bars) {
        const v = new Voice(this.voices.length, beats, bars);
        this.voices.push(v);
        return v;
    }

    static pause(){
        Tone.getTransport().pause();
    }

    static test() {
        const v = new Voice(0);
        const n = {
            id: { GridId: 0, PageId: 0, BeatId: 4, NoteId: 0 },
            note: "C3",
            duration: "8n",
            time: "+0.5"
        };
        const n2 = {
            id: { GridId: 0, PageId: 0, BeatId: 0, NoteId: 1 },
            note: "E3",
            duration: "8n",
            time: "+0"
        };
        v.addNotes([n, n2]);
        Brain.voices.push(v);
    }
}

