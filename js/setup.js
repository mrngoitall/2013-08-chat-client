var events = _.clone(Backbone.Events);

var Messages = function(){
};

Messages.prototype.refresh = function() {
  $.ajax('https://api.parse.com/1/classes/'+this.currentRoom+'?order=-createdAt', {
    contentType: 'application/json',
    cache: false,
    success: function(data) {
      events.trigger('message:refresh', data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });

};

Messages.prototype.send = function() {
    if($("#username").val() === ''){
      return alert('Please enter a username!');
    }
    if($("#message").val() === ''){
      return alert('Please enter a message!');
    }

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'https://api.parse.com/1/classes/'+currentRoom,
      data: '{ "text": '+JSON.stringify($("#message").val())+', \
        "username":'+JSON.stringify($("#username").val())+' }'
    });

    new NewMessageView({ messages: messages});
    $("#message").val('');
  };

var NewMessageView = function(options) {
  this.messages = options.messages;
  this.el = $('#messages');
  events.on('message:refresh',this.clearChatMessages,this);
  events.on('message:refresh',this.appendNewMessages,this);
  this.messages.refresh();

};

NewMessageView.prototype.clearChatMessages = function () {
  this.el.html('');
};

NewMessageView.prototype.appendNewMessages = function (data) {
  for (var i = 0; i < data.results.length; i++) {
    var $tweet = $('<p>').addClass(data.results[i].username);
    $tweet.append($("<span class='user'></span>").text(data.results[i].username+": "));
    $tweet.append($("<span class='message'></span>").text(data.results[i].text));
    this.el.append($tweet);
  }
};

var FriendView = function() {
  events.on('message:refresh',this.addFriendEventListener,this);
  events.on('message:refresh',this.formatFriendMessages,this);
};

FriendView.prototype.addFriendEventListener = function () {
  $('.user').on('click', function(){
    var friendUsername = $(this).text().slice(0,$(this).length - 3);
    var friend = '<p>' + friendUsername + '</p>';
    if(friends[friendUsername] === undefined) {
      $('#friends').append(friend);
      $('.'+friendUsername).css({'font-weight':'bold'});
    }
    friends[friendUsername] = true;
  });
};

FriendView.prototype.formatFriendMessages = function () {
  for(var key in friends){
    $('.'+key).css({'font-weight':'bold'});
  }
};



$(document).ready(function() {
  var friends = {};
  var currentRoom = 'messages';
  var chatRooms = {'messages': true};
  var messages = new Messages();
  // Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  new NewMessageView({ messages: messages});
  new FriendView();


  $('#submit').on('click', sendMessage);
  $("#message").keypress(function(event) {
    if ( event.which == 13 ) {
       sendMessage();
     }
  });

  $('#chooseroom').change(function(e) {
    if(this.value === 'createRoom'){
      var newRoomName = prompt('What room did you want to join?') || 'messages';
      if(chatRooms[newRoomName] === undefined){
        chatRooms[newRoomName] = true;
        var chooseRoomOptions = "";
        for(var key in chatRooms){
          if(key === newRoomName){
            chooseRoomOptions += '<option value="' + key + '" selected>' + key + '</option>';
          } else {
            chooseRoomOptions += '<option value="' + key + '">' + key + '</option>';
          }
        }
        chooseRoomOptions += '<option value="createRoom">Create a room</option>';
        $('#chooseroom').html(chooseRoomOptions);
      }
    }
    currentRoom = newRoomName || this.value;
    new NewMessageView({ messages: messages});
  });

});
