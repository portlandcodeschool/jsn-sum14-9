var SOCKET_HOST = 'http://code-126639.usw1-2.nitrousbox.com/updates';
var socket = io.connect(SOCKET_HOST);

var showdown = new Showdown.converter();

function Update(author, msg, timestamp) {
  this.author = author;
  this.msg = showdown.makeHtml(msg);
  this.timezone = 'PDT'; // TODO: make this an input somewhere
  this.timestamp = moment(timestamp).format('h:mm:ss A [' + this.timezone + ']');
}

Update.prototype.toHTML = function(showButtons) {
  var buttons =
    '<div class="btn-group">' +
    '<button id="edit" class="btn btn-default btn-xs">Edit</button>' +
    '<button id="save" class="btn btn-default btn-xs" style="display:none">Save</button>' +
    '<button id="cancel" class="btn btn-default btn-xs" style="display:none">Cancel</button>' +
    '<button id="delete" class="btn btn-default delete btn-xs">Delete</button>' +
    '</div>';

  var input = '<input type="text" class="form-control input-sm msg-input" style="display:none">';

  if (!showButtons) {
    buttons = '';
    input = '';
  }

  return '<li class="list-group-item">' +
    '<b>' + this.author + '</b> ' + ' - ' + this.timestamp +
    '<div class="msg">' + this.msg + '</div>' +
    input +
    buttons +
    '</li>';
};
