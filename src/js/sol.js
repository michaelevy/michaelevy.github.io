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
    constructor(id) {
        this.id = id;
        this.synth = new Tone.PolySynth(Tone.Synth);
        this.notes = [];
        this.noteDict = new Map();
        this.key = Note.C;
        this.length = 4;

        const filter = new Tone.Filter(250, "lowpass").toDestination();
        Tone.connect(this.synth, filter);

        this.synth.set({
            oscillator: {
                type: "sawtooth"
            },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.5,
                release: 0.3
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
    static lookahead = 0.5
    static interval = 0.1;
    static scheduled = 0;

    static init() {
        Tone.start();
        Tone.getTransport().bpm.value = this.bpm;
        this.loop()
        Tone.getTransport().start("+0.1");
    }

    static loop(){

        setTimeout(() => {
            let time = Tone.getTransport().seconds
            if (time < Brain.scheduled) {
                 console.log(`${time}`);
                 Brain.loop()
                return;
            }

            let beatDurationSeconds = Tone.Time("4n").toSeconds();
            let beatTotal = Math.floor(time / beatDurationSeconds);
            
            for (const voice of this.voices) {
                let sequenceTotal = Math.floor(beatTotal / voice.length)
                let sequenceTotalDuration = sequenceTotal * beatDurationSeconds * voice.length;
                let sequenceDuration = voice.length * beatDurationSeconds;
                let sequencePartialDuration = sequenceTotalDuration > 0 ? time % sequenceTotalDuration : time;

                for (const note of voice.getNotes()) {
                    let noteTime = note.beat * beatDurationSeconds
                    let scheduleTime;
                    if (noteTime < sequencePartialDuration) {
                        scheduleTime = time - sequencePartialDuration + sequenceDuration + noteTime;
                    } else {
                        scheduleTime = time - sequencePartialDuration + noteTime;
                    }
                    
                    if (scheduleTime < time + this.lookahead){
                        console.log(`${time}: Scheduling note ${note.note} at time ${scheduleTime}`);
                        voice.schedule(note, scheduleTime);
                    } else{
                        // console.log(`${time}: Skipping note ${note.note} at time ${scheduleTime} (too far in the future)`);
                    }
                }
            }
            Brain.scheduled = time + this.lookahead;
            Brain.loop()
        }, this.interval);
    }

    static newVoice() {
        const v = new Voice(this.voices.length);
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

