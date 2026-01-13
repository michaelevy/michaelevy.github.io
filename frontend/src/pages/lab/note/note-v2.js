const API_BASE = '/api';

function submit() {
    const from = document.getElementById("name").value;
    const message = document.getElementById("note").value;

    if (!from || !message) {
        alert("Please fill in both your name and message");
        return;
    }

    const data = {
        from: from,
        message: message
    };

    fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("Note submitted successfully!");
        // Clear the form
        document.getElementById("name").value = "";
        document.getElementById("note").value = "";
        // Refresh to show the note that was just submitted
        get();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error submitting note: " + error.message);
    });
}

function get() {
    fetch(`${API_BASE}/notes/latest`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const fromElem = document.getElementById("previous-name");
        const messageElem = document.getElementById("previous-note");

        if (fromElem && messageElem) {
            fromElem.textContent = data.from || "Nobody yet";
            messageElem.textContent = data.message || "Be the first to leave a note!";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const fromElem = document.getElementById("previous-name");
        const messageElem = document.getElementById("previous-note");

        if (fromElem && messageElem) {
            fromElem.textContent = "Error";
            messageElem.textContent = "Could not load previous note";
        }
    });
}
