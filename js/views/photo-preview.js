'use strict';

define(function() {
    /**
     * @constructon
     * @param{Object} attributes
     * @param{Object} options
     */
    var GalleryPicture = Backbone.View.extend({

        /**
         * @override
         */
        tagName: 'img',

        render: function() {
            this.el.src = this.model.get('url');
        }
    });

    return GalleryPicture;
});
