$(function() {
  var eventKey = window.location.pathname.split('/')[2];
  var $form = $('form');

  $form.submit(function(e) {
    e.preventDefault();
    var data = {};
    var fields = $(this).serializeArray();
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
});