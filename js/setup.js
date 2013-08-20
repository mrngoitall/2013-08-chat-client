var Messages = function(){
};

Messages.prototype.refresh = function(options) {
  $.ajax('https://api.parse.com/1/classes/'+this.currentRoom+'?order=-createdAt', {
    contentType: 'application/json',
    cache: false,
    success: options.success,
    error: function(data) {
      console.log('Ajax request failed');
    }
  });

};

var NewMessageView = function(options) {
  this.messages = options.messages;
  //debugger;
  var that = this;
  this.messages.refresh({
    success: function(data){
      //debugger;
      that.clearChatMessages();
      that.appendNewMessages(data);
      that.addFriendEventListener();
      that.formatFriendMessages();
    }
  });

};

NewMessageView.prototype.clearChatMessages = function () {
  $('#messages').html('');
};

NewMessageView.prototype.appendNewMessages = function (data) {
  for (var i = 0; i < data.results.length; i++) {
    var $tweet = $('<p class='+data.results[i].username+'></p>');
    $tweet.append($("<span class='user'></span>").text(data.results[i].username+": "));
    $tweet.append($("<span class='message'></span>").text(data.results[i].text));
    $('#messages').append($tweet);
  }
};

NewMessageView.prototype.addFriendEventListener = function () {
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

NewMessageView.prototype.formatFriendMessages = function () {
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

  var sendMessage = function() {
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

    refreshMessages();
    $("#message").val('');
  };

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
    refreshMessages();
  });

});
