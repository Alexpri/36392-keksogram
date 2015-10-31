'use strict';

define([
  'js/models/photo.js'
], function(PictureModel) {

  /**
   * @constructon
   * @param{Object} attributes
   * @param{Object} options
   */
  var PicturesCollection = Backbone.Collection.extend({
    model: PictureModel,
    url: 'data/pictures.json'
  });

  return PicturesCollection;
});