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
    constructor(id, beats, bars, params = {}) {
        this.id = id;
        this.scheduled = 0;
        this.onBeat = null;
        this.synth = new Tone.PolySynth(Tone.MonoSynth).toDestination();
        this.notes = [];
        this.noteDict = new Map();
        this.key = Note.C;
        this.length = beats * bars;

        const {
            waveform = 'sawtooth',
            volume = 0,
            envelope = {},
            filter = {},
            filterEnvelope = {}
        } = params;

        this.synth.volume.value = volume;

        this.synth.set({
            oscillator: { type: waveform },
            envelope: {
                attack:  envelope.attack  ?? 0.01,
                decay:   envelope.decay   ?? 0.1,
                sustain: envelope.sustain ?? 0.5,
                release: envelope.release ?? 1
            },
            filter: {
                frequency: filter.cutoff    ?? 800,
                Q:         filter.resonance ?? 1
            },
            filterEnvelope: {
                attack:        filterEnvelope.attack  ?? 0.01,
                decay:         filterEnvelope.decay   ?? 0.2,
                sustain:       filterEnvelope.sustain ?? 0.5,
                release:       filterEnvelope.release ?? 0.5,
                baseFrequency: filter.cutoff          ?? 800,
                octaves:       filterEnvelope.amount  ?? 2
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
    static initialised = false;

    static init() {
        if (this.initialised) return;
        this.initialised = true;
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

                    if (scheduleTime < time + this.lookahead && scheduleTime > voice.scheduled) {
                        voice.schedule(note, scheduleTime);
                        lastNote = Math.max(lastNote, scheduleTime)
                    }
                }

                voice.scheduled = Math.max(voice.scheduled, lastNote);
            }
            Brain.loop()
        }, this.interval);
    }

    static drawLoop(){

        var loop = new Tone.Loop(function(time){
            Tone.Draw.schedule(() => {
                Brain.voices.forEach(voice => {
                    if (!voice.onBeat) return;
                    const currentTimeOfQuarterNote = Tone.getTransport().seconds / Tone.Time("4n").toSeconds();
                    const currentBeat = currentTimeOfQuarterNote % voice.length;
                    const roundedBeat = Math.round(currentBeat * 2) / 2;
                    voice.onBeat(roundedBeat);
                });
            }, time)
        },"32n")

        loop.start(0);
    }

    static newVoice(beats, bars, params = {}) {
        const v = new Voice(this.voices.length, beats, bars, params);
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

