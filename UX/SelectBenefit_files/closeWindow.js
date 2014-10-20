function closeWindow() {
    if (navigator.userAgent.indexOf("Windows Phone") > 0) {
        history.back();
        return false;
    }
    else {
        window.close();
        window.opener.focus();
        return false;
    }
}

