(function () {

    var validation = {

        init : function(){
            var self = this;
            console.log(1);
            self.validation();
            self.cookies();
        },

        validation: function () {
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

                        resizeY.value = parseInt(field.value, 10);
                        resizeSize.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                    }
                } else if (field == resizeY) {
                    field.onchange = function () {

                        resizeX.value = parseInt(field.value, 10);
                        resizeSize.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                    }
                }  else if (field == resizeSize) {
                    field.onchange = function () {

                        resizeX.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                        resizeY.value = parseInt(MAX_PHOTO_SIDE - field.value, 10);
                    }
                }
            };

            inputSize(resizeX);
            inputSize(resizeY);
            inputSize(resizeSize);
        },

        cookies: function() {
                var filterForm = document.forms['upload-filter'],
                    filterInput = filterForm['upload-filter'];

                var restoreFormValueFromCookies = function(form) {
                    var element;

                    if (docCookies.hasItem(filterForm.elements['upload-filter'].value)) {
                        console.log(filterForm.elements['upload-filter'].value);
                        filterForm.elements['upload-filter'].value = docCookies.setItem(filterForm.elements['upload-filter'].value);
                    }
                    for (var i = 0; i < filterForm.elements['upload-filter'].length; i++) {

                         element = filterForm.elements['upload-filter'].value;

                    }
                }

            filterForm.onsubmit = function(evt) {
                    evt.preventDefault();

                     var element;

                    console.log(filterForm.elements['upload-filter'].value);
                    for (var i = 0; i < filterForm.elements['upload-filter'].length; i++) {
                         //element = filterForm.elements['upload-filter'].value;
                         //if (docCookies.hasItem(filterForm.elements['upload-filter'].value)) {
                             docCookies.setItem(filterForm.elements['upload-filter'].value);
                         //}
                     }


                    filterForm.submit();
                }

                restoreFormValueFromCookies(filterForm);
        }

    };






    (function() {
        validation.init();
    })();

})();