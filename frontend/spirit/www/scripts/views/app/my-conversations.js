/**
 * views/app/dashboard.js
 * Shows user their options
 */

define([
  'jQuery',
  'underscore',
  'Backbone',
  'Mustache',
  'models/conversation',
  'text!templates/app/my-conversations.mustache!strip'
  ], function ($, _, Backbone, Mustache, Conversation, my_conversations_template) {

  SpiritApp.Pages.MyConversationsView = Backbone.View.extend({

    template: function(params) {
      return Mustache.to_html(my_conversations_template, params);
    },

    events: {
      'click #link-dashboard' : 'dashboard',
      'click li a'            : 'conversation'
    },

    render: function() {
      var conversations = [
        { id: 1, preview: "Hey ;)" },
        { id: 2, preview: "Helloooo" },
        { id: 3, preview: "Got so much homewo..." }
      ]
      console.log(this.collection.toJSON());
      this.$el.html(this.template({ conversations: this.collection.toJSON() }));
      return this;
    },

    dashboard: function() {
      var dashboardView = new SpiritApp.Pages.DashboardView;
      var page = dashboardView.render().$el;
      $.mobile.pageContainer.append(page);
      $.mobile.changePage(page, { role: 'page', reverse: true, transition: 'slide' });
    },

    conversation: function(event) {
      var conversation_id = $(event.target).data("id");
      var conversation = new Conversation({ id: conversation_id });
      conversation.fetch({
          success: function(response) {
          var conversationView = new SpiritApp.Pages.ConversationView({ model: conversation });
          var page = conversationView.render().$el;
          $.mobile.pageContainer.append(page);
          $.mobile.changePage(page, { role: 'page', transition: 'slide' });
        }
      });
    }

  });

  return SpiritApp.Pages.DashboardView;

});