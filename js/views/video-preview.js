'use strict';

define(function() {
    /**
     * @constructon
     * @param{Object} attributes
     * @param{Object} options
     */
    var GalleryVideo = Backbone.View.extend({

        /**
         * @override
         */
        tagName: 'img',

        render: function() {
            this.el.src = this.model.get('preview');
        }
    });

    return GalleryVideo;
});