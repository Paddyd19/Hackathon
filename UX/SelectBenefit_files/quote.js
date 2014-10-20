
function ValidateSelections() {

    var validPage = true;
    $('.radio-buttons').each(function () {

        if ($(this).find("input:checked").length == 0) {
            $(this).addClass("required-field");
            validPage = false;
        }


    })
    return validPage;
}

function ClearErrors() {
    $('.radio-buttons').each(function () {
        $(this).removeClass('required-field');
    })
}

function PageIsValid() {
    ClearErrors();
    return ValidateSelections();
}