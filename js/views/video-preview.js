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
        tagName: 'video',

        /**
         * @override
         */

        attributes : {
          autoplay: 'autoplay'
        },

        render: function() {
            //this.el.src = this.model.get('preview');
          this.el.src = this.model.get('url');
        }
    });

    return GalleryVideo;
});
