(function () {
    var formResize = document.forms["upload-resize"],
        resizeX = formResize["resize-x"],
        resizeY = formResize["resize-y"],
        resizeSize = formResize["resize-size"],
        inputsStep2 =  document.querySelectorAll(".upload-resize-controls input");

    var MAX_PHOTO_SIDE = 569;
    var MIN_PHOTO_SIDE = 0;
    var MIN_INPUT_RESIZE = 0;

    resizeSize.min = MIN_PHOTO_SIDE;
    resizeSize.max = MAX_PHOTO_SIDE;
    resizeSize.value = MAX_PHOTO_SIDE;
    resizeX.min = MIN_INPUT_RESIZE;
    resizeY.min = MIN_INPUT_RESIZE;
    resizeY.value = MIN_INPUT_RESIZE;
    resizeX.value = MIN_INPUT_RESIZE;

    var inputSize = function (field) {

            if (field == resizeX) {

                field.onchange = function () {
                    console.log(resizeX);

                    resizeY.value = parseInt(field.value, 10);
                    resizeSize.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                }
            } else if (field == resizeY) {
                field.onchange = function () {
                    console.log(resizeY);

                    resizeX.value = parseInt(field.value, 10);
                    resizeSize.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                }
            }  else if (field == resizeSize) {
                field.onchange = function () {
                    console.log(resizeSize);

                    resizeX.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                    resizeY.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                }
            }
    };

    inputSize(resizeX);
    inputSize(resizeY);
    inputSize(resizeSize);


    //filterInput =  formFilter.filter;

    /*var restoreFormValueCookie = function(form) {
        var element;

        for (var i = 0; i < formFilter.elements.length; i++) {
            element = formFilter.elements[i];


            if (docCookies.hasItem(element.name)) {
                element.value = docCookies.setItem(element.value);
            }

        }
    }*/


/*    var elementForm;

    formFilter.onsubmit = function(evt) {
        evt.preventDefault();

        for (var i = 0; i < formFilter.elements.length; i++) {
            element = formFilter.elements[i];

            docCookies.setItem(element.name, element.value);
        }
    }*/

})();