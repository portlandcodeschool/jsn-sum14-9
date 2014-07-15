$(function() {
  var eventKey = window.location.pathname.split('/')[2];
  var $updateList = $('ul.updates');

  socket.emit('subscribe', { key: window.location.pathname.split('/')[2] });

  //socket.emit('addAuthor')

  socket.on('updates', function(update) {
    console.log(update)
    // remove the no updates well if it exists
    if ($('.well')) $('.well').remove();

    var updateItem = new Update(update.author, update.msg, update.timestamp);
    var $update = $(updateItem.toHTML(true));
    $update.attr('id', update.timestamp);
    $update.find('#edit').click(function() {
      return handleEdit($update, update);
    });
    $update.find('#delete').click(function() {
      return handleDelete(update);
    });
    if (update.isNew) {
      $updateList.prepend($update);
      return;
    }
    $updateList.append($update);
  });

  function cancelEdit($el) {
    $el.find('#cancel').hide();
    $el.find('#save').hide();
    $el.find('input').hide();
    $el.find('#edit').show();
    $el.find('.msg').show();
  }

  function handleEdit($update, update) {
    update.eventKey = eventKey;
    $update.find('.msg').hide();
    $update.find('#edit').hide();
    $update.find('#save').show().click(function() {
      var msg = $update.find('input').val();
      $update.find('.msg').html(showdown.makeHtml(msg));
      update.msg = msg;
      socket.emit('editUpdate', update);
      cancelEdit($update);
    });
    $update.find('#cancel').show().click(function () {
      cancelEdit($update);
    });
    $update.find('input').show().val(update.msg);
  }

  function handleDelete(update) {
    update.eventKey = eventKey;
    $('#' + update.timestamp).remove();
    socket.emit('deleteUpdate', update);
  }

  socket.on('editUpdate', function(update) {
    $('#' + update.timestamp).find('.msg').html(showdown.makeHtml(update.msg));
  });

  var $form = $('form');

  function resetForm() {
    $form.find('input:first').val('');
    $form.find('textarea:first').val('');
  }

  $form.submit(function(e) {
    e.preventDefault();
    var author = $form.find('input:first').val();
    var msg = $form.find('textarea:first').val();

    $.post(window.location.pathname, {
      author: author,
      msg: msg
    })
    .done(function(update) {
      socket.emit('newUpdate', update);
      resetForm();
    })
    .fail(function(err) {
      console.log(err);
    });
  });
});