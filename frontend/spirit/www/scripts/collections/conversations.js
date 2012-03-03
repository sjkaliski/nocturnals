/**
 * collections/conversations.js
 * 
 */

define([
  'jQuery',
  'underscore',
  'Backbone',
  'models/conversation'
  ], function ($, _, Backbone, Conversation) {

  var Conversations = Backbone.Collection.extend({

    model: Conversation

  });

  return Conversations;

});