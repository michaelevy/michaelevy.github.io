function submit(){
    var from = document.getElementById("name").value;
    var message = document.getElementById("note").value;
    var url = "https://altocat-note.web.val.run?";
    var data = {
        from: from,
        message: message
    };
    var xhr = new XMLHttpRequest(data);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Note submitted successfully!");
        } else if (xhr.readyState == 4) {
            alert("Error submitting note: " + xhr.statusText);
        }
    };
    xhr.send(JSON.stringify(data));
}

function get(){
    var url = "https://altocat-note.web.val.run?";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var from = response.from;
            var message = response.message;
            var fromElem  = document.getElementById("previous-name");
            var messageElem = document.getElementById("previous-note");
            fromElem.innerHTML = from;
            messageElem.innerHTML = message;
        } else if (xhr.readyState == 4) {
            alert("Error fetching notes: " + xhr.statusText);
        }
    };
    xhr.send();
}