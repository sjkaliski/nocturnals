/**
 * views/app/my-conversations.js
 * Shows user their options
 */

define([
  'jQuery',
  'underscore',
  'Backbone',
  'Mustache',
  'models/conversation',
  'collections/conversations',
  'views/app/conversation',
  'text!templates/app/my-conversations.mustache!strip'
  ], function ($, _, Backbone, Mustache, Conversation, Conversations, ConversationView, my_conversations_template) {

  var MyConversationsView = Backbone.View.extend({

    el: $("#my-conversations-page"),

    initialize: function() {
    },

    initPage: function() {
      var _mcv = this;
      _mcv.collection.fetch({
        data: {
          author: SpiritApp.User.get("id")
        },
        success: function() {
          _mcv.render();
        }
      });
    },

    template: function(params) {
      return Mustache.to_html(my_conversations_template, params);
    },

    events: {
      'click #link-dashboard' : 'dashboardPage',
      'click li a'            : 'conversationPage'
    },

    render: function() {
      var conversations = _.map(this.collection.toJSON(), function(conversation, index) {
        return $.extend({}, conversation, { index: index });
      });
      this.$el.html(this.template({ conversations: conversations }));
      this.$el.page("destroy").page();
      return this;
    },

    dashboardPage: function() {
      var dashboard_page = $("#dashboard-page");
      $.mobile.changePage(dashboard_page, { changeHash: false, reverse: true, transition: 'slide' });
    },

    conversationPage: function(event) {
      var conversation_index = $(event.target).data("index");
      var conversation_view = new ConversationView({
        model: this.collection.at(conversation_index),
        back: {
          slug: "my-conversations",
          title: "My Conversations"
        }
      });
      var conversation_page = $("#conversation-page");
      $.mobile.changePage(conversation_page, { changeHash: false, transition: 'slide' });
      conversation_view.initPage();
    }

  });

  return MyConversationsView;

});