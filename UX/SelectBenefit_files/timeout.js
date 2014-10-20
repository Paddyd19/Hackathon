function setTimer() {
    timeout = setTimeout('reloadPage()', 1230000); //20 minutes 30 seconds
}

function reloadPage() {
    location.reload(true);
}

$(document).ajaxComplete(function () { //restart the timer if there is an ajax call
    clearTimeout(timeout);
    setTimer();
});

setTimer();