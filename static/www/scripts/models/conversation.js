/**
 * models/conversation.js
 * 
 */

define([
  'jQuery',
  'underscore',
  'Backbone',
  'models/user',
  'models/text',
  'models/comment',
  'collections/texts',
  'collections/comments'
  ], function ($, _, Backbone, User, Text, Comment, Texts, Comments) {

  var Conversation = Backbone.RelationalModel.extend({

    relations: [{
      type: Backbone.HasOne,
      key: 'author',
      relatedModel: User,
      reverseRelation: {
        key: 'conversations'
      }
    }, {
      type: Backbone.HasMany,
      key: 'texts',
      relatedModel: Text,
      collectionType: Texts,
      reverseRelation: {
        key: 'conversation'
      }
    }, {
      type: Backbone.HasMany,
      key: 'comments',
      relatedModel: Comment,
      collectionType: Comments,
      reverseRelation: {
        key: 'conversation'
      }
    }],

    url: CONFIG.ENDPOINT + "/api/v1/conversation/"

  });

  return Conversation;

});