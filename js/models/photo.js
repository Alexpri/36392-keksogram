'use strict';

define(function() {
  /**
   * @constructon
   * @extend {Backbone.Model}
   */
  var PictureModel = Backbone.Model.extend({
    /**
     * @override
     */
    initialize: function() {
      this.set('liked', false);
    },

    like: function() {
      console.log('liked');
      this.set('liked',true);
    },

    dislike: function() {
      console.log('dislike');
      this.set('liked', false);
    }
  });

  return PictureModel;
});
