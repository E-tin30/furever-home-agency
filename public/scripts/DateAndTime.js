function getCurrentDate() {
    let d = new Date();
    let date = d.toDateString();
    let time = d.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true});
    
    document.getElementById("date").innerHTML = date + " - " + time;
}

setInterval(getCurrentDate, 1000);
getCurrentDate();