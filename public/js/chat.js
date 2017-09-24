var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ){
        //console.log('should scroll');
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = "/";
        } else {
            console.log('no error')
        }
    });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

// socket.on('newEmail',function(email) {
//     console.log('new email', email);
// });

// socket.emit('createEmail',{
//     to: 'bbc@example.com',
//     text: 'hello from bbc'
// });


socket.on('updateUserList', function(users){
    console.log(users);
    var ol = jQuery('<ol></ol>');
    users.forEach((user)=>{
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});


socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    
    
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();

    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current Location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
});
//  socket.emit('createMessage', {
//      from: 'cloud',
//      text: 'welcome'
//  }, function(data) {
//      console.log('got it', data);
//  });

 jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    var messageTextbox = jQuery('[name=message');

    socket.emit('createMessage',{
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    });
 });

 var locationButton = jQuery('#send-location');
 locationButton.on('click', function(){
     if(!navigator.geolocation){
         return alert('geolocation not supported by your browser');
     }
     locationButton.attr('disabled','disabled').text('Sending location...');

     navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Sending location');
         socket.emit('createLocationMessage',{
             latitude: position.coords.latitude,
             longtitude: position.coords.longitude
         });
        console.log(position);
     }, function(){
        locationButton.removeAttr('disabled').text('Sending location');
        alert('unable to fetch location');
     })
 })

