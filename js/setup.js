$(document).ready(function() {
  // Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
  $.ajaxPrefilter(function(settings, _, jqXHR) {
    jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
    jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
  });

  $.ajax('https://api.parse.com/1/classes/messages?order=-createdAt', {
    contentType: 'application/json',
    cache: false,
    success: function(data){
      for (var i = 0; i < data.results.length; i++) {
        $tweet = $('<p></p>');
        $tweet.append($("<span class='user "+data.results[i].username+"'></span>").text(data.results[i].username+": "));
        $tweet.append($("<span class='message'></span>").text(data.results[i].text));
        $('#main').append($tweet);
      }
      $('.user').on('click', function(){
        var friend = '<p>' + $(this).text().slice(0,$(this).length - 3) + '</p>';
        $('#friends').append(friend);

      });
      console.log(data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });

  $('#submit').on('click', function() {
    if($("#username").val() === ''){
      return alert('Please enter a username!');
    }
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'https://api.parse.com/1/classes/messages',
      data: '{ "text": '+JSON.stringify($("#message").val())+', \
        "username":'+JSON.stringify($("#username").val())+' }'
    });
  });

//$('.undefined').css({'font-weight':'bold'})
});
