$(function() {
  var eventKey = window.location.pathname.split('/')[2];
  var $form = $('form');

  $('#update').click(function() {
    var data = {};
    var fields = $form.serializeArray();
    $.each(fields, function(i, field) {
      data[field.name] = field.value;
    });

    if (!data.name) return;

    $.ajax('/events/' + eventKey, {
      type: 'PUT',
      data: data
    })
    .done(function(data) {
      location.href = data.redirect;
    })
    .fail(function(err) {
      console.log(err);
    });
  });

  $('#delete').click(function() {
    $.ajax('/events/' + eventKey, {
      method: 'DELETE'
    })
    .done(function() {
      window.location.href = '/events';
    })
    .fail(function(err) {
      console.log(err);
    });
  });
});