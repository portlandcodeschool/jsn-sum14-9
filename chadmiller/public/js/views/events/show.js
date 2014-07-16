$(function() {
  var $updateList = $('ul.updates');

  socket.emit('subscribe', { key: window.location.pathname.split('/')[2] });

  socket.on('updates', function(update) {
    // remove the no updates well if it exists
    if ($('#no-updates')) $('#no-updates').remove();

    var updateItem = new Update(update.author, update.msg, update.timestamp);
    var $update = $(updateItem.toHTML());
    $update.attr('id', update.timestamp);
    if (update.isNew) return $updateList.prepend($update);
    $updateList.append($update);
  });

  socket.on('editUpdate', function(update) {
    $('#' + update.timestamp).find('.msg').html(showdown.makeHtml(update.msg));
  });

  socket.on('deleteUpdate', function(update) {
    $('#' + update.timestamp).remove();
  });
});