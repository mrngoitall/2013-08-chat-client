$(document).ready(function() {
  var friends = {};
  var currentRoom = 'messages';
  // Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  var refreshMessages = function() {
    $.ajax('https://api.parse.com/1/classes/'+currentRoom+'?order=-createdAt', {
      contentType: 'application/json',
      cache: false,
      success: function(data){
        $('#messages').html('');
        for (var i = 0; i < data.results.length; i++) {
          var $tweet = $('<p class='+data.results[i].username+'></p>');
          $tweet.append($("<span class='user'></span>").text(data.results[i].username+": "));
          $tweet.append($("<span class='message'></span>").text(data.results[i].text));
          $('#messages').append($tweet);
        }
        $('.user').on('click', function(){
          var friend = '<p>' + $(this).text().slice(0,$(this).length - 3) + '</p>';
          if(friends[friend] === undefined) {
            $('#friends').append(friend);
            $('.'+$(this).text().slice(0,$(this).length - 3)).css({'font-weight':'bold'});
          }
          friends[friend] = true;
        });
        console.log(data);
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
  };
  refreshMessages();

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

});
