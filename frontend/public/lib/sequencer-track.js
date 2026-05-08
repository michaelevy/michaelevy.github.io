class SequencerTrack extends HTMLElement {
    connectedCallback() {
        const steps    = Number(this.getAttribute('steps')     ?? 16)
        const noteRows = Number(this.getAttribute('notes')     ?? 8)
        const beats    = Number(this.getAttribute('beats')     ?? 4)
        const bars     = Number(this.getAttribute('bars')      ?? 2)
        const highest  = Number(this.getAttribute('highest')   ?? 4)

        const preset = {
            waveform: this.getAttribute('waveform') ?? 'sawtooth',
            volume:   Number(this.getAttribute('volume')    ?? 0),
            envelope: {
                attack:  Number(this.getAttribute('attack')  ?? 0.01),
                decay:   Number(this.getAttribute('decay')   ?? 0.1),
                sustain: Number(this.getAttribute('sustain') ?? 0.5),
                release: Number(this.getAttribute('release') ?? 1),
            },
            filter: {
                cutoff:    Number(this.getAttribute('cutoff')    ?? 800),
                resonance: Number(this.getAttribute('resonance') ?? 1),
            },
            filterEnvelope: {
                attack:  Number(this.getAttribute('f-attack')  ?? 0.01),
                decay:   Number(this.getAttribute('f-decay')   ?? 0.2),
                sustain: Number(this.getAttribute('f-sustain') ?? 0.5),
                release: Number(this.getAttribute('f-release') ?? 0.5),
                amount:  Number(this.getAttribute('f-amount')  ?? 2),
            }
        }

        this.highest = highest
        this.activeCells = new Set()
        this.voice = Brain.newVoice(beats, bars, preset)
        this.voice.onBeat = (beat) => this._highlightBeat(beat)

        this.style.gridTemplateColumns = `repeat(${steps}, 1fr)`
        this.style.gridTemplateRows = `repeat(${noteRows}, 1fr)`

        const beatIncrement = (beats * bars) / steps
        for (let note = 0; note < noteRows; note++) {
            for (let step = 0; step < steps; step++) {
                const cell = document.createElement('div')
                cell.classList.add('grid-square')
                cell.id = `${this.id}-${note}-${step}`
                cell.dataset.note = note
                cell.dataset.beat = step * beatIncrement
                cell.addEventListener('click', () => this._toggleCell(cell))
                this.appendChild(cell)
            }
        }
    }

    _toggleCell(target) {
        if (!Brain.initialised) Brain.init()

        const note   = Number(target.dataset.note)
        const beat   = Number(target.dataset.beat)
        const octave = -Math.floor(note / 7) + this.highest
        const hierarchyId = { GridId: this.voice.id, PageId: 0, BeatId: beat, NoteId: note }

        if (!this.activeCells.has(target.id)) {
            this.activeCells.add(target.id)
            this.voice.addNote({
                id: hierarchyId,
                note: notes[notes.length - 1 - (note % 7)] + octave,
                beat: `${beat}`,
                duration: '16n'
            })
            target.classList.add('active')
        } else {
            this.activeCells.delete(target.id)
            this.voice.removeNote(hierarchyId)
            target.classList.remove('active')
        }
    }

    _highlightBeat(beat) {
        for (const el of this.querySelectorAll('.grid-square')) {
            el.classList.toggle('current-beat', el.dataset.beat == beat)
        }
    }
}

customElements.define('sequencer-track', SequencerTrack)
