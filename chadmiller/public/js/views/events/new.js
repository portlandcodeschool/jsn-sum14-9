$(function() {
  var $form = $('form');

  $form.submit(function(e) {
    e.preventDefault();
    var data = {};
    var fields = $(this).serializeArray();
    $.each(fields, function(i, field) {
      data[field.name] = field.value;
    });

    if (!data.name) return;

    $.post('/events', data)
    .done(function(event) {
      location.href = '/events/' + event.key;
    })
    .fail(function(err) {
      console.log(err);
    });
  });
});