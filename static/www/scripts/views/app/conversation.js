/**
 * views/app/dashboard.js
 * Shows user their options
 */

define([
  'jQuery',
  'underscore',
  'Backbone',
  'Mustache',
  'models/text',
  'views/app/comments',
  'text!templates/app/conversation.mustache!strip'
  ], function ($, _, Backbone, Mustache, Text, CommentsView, conversation_template) {

  var ConversationView = Backbone.View.extend({

    el: $("#conversation-page"),

    initialize: function() {
    },

    initPage: function() {
      var _cv = this;
      _cv.model.fetchRelated('texts', {
        data: { conversation: _cv.model.get("id") },
        success: function() { _cv.render(); }
      });
    },

    template: function(params) {
      return Mustache.to_html(conversation_template, params);
    },

    events: {
      'click #link-my-conversations' : 'myConversationsPage',
      'click #link-my-councils'      : 'myCouncilsPage',
      'click #link-browse-feed'      : 'browseFeedPage',
      'click #link-comments'         : 'commentsPage',
      'submit #new-text-form'        : 'newText'
    },

    render: function() {
      var data = $.extend({}, this.model.toJSON(), { back: this.options.back });
      this.$el.html(this.template(data));
      this.$el.page("destroy").page();
      return this;
    },

    myConversationsPage: function() {
      var my_conversations_page = $("#my-conversations-page");
      $.mobile.changePage(my_conversations_page, { changeHash: false, reverse: true, transition: 'slide' });
      this.undelegateEvents();
    },

    myCouncilsPage: function() {
      var my_councils_page = $("#my-councils-page");
      $.mobile.changePage(my_councils_page, { changeHash: false, reverse: true, transition: 'slide' });
      this.undelegateEvents();
    },

    browseFeedPage: function() {
      var browse_feed_page = $("#browse-feed-page");
      $.mobile.changePage(browse_feed_page, { changeHash: false, reverse: true, transition: 'slide' });
      this.undelegateEvents();
    },

    commentsPage: function() {
      var comments_view = new CommentsView({
        model: this.model
      });
      var comments_page = $("#comments-page");
      $.mobile.changePage(comments_page, { changeHash: false, transition: 'slide' });
      comments_view.initPage();
    },

    newText: function(event) {
      var new_text_body = this.$("#new-text").val();
      var new_text = new Text({
        conversation: this.model,
        author: SpiritApp.User,
        author_name: SpiritApp.User.get("username"),
        body: new_text_body
      });
      // new_text.save();
      this.model.get("texts").add(new_text);
      this.render();
      return false;
    }

  });

  return ConversationView;

});