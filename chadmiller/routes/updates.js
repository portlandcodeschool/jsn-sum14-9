var store = require('../lib/store');

module.exports = function(io) {
  var updates = io
    .of('/updates')
    .on('connection', function (socket) {

      socket.on('subscribe', function(event) {
        store.getUpdates(event.key)
        .then(function(updates) {
          updates.forEach(function(update) {
            update.isNew = false;
            socket.emit('updates', update);
          });
        })
        .fail(function(err) {
          console.error(err);
        });
      });

      socket.on('newUpdate', function(update) {
        update.isNew = true;
        updates.emit('updates', update);
      });

      socket.on('deleteUpdate', function(update) {
        store.deleteUpdate(update)
        .then(function(status) {
          updates.emit('deleteUpdate', { timestamp: update.timestamp });
        })
        .fail(function(err) {
          console.error(err);
        });
      });

      socket.on('editUpdate', function(update) {
        store.putUpdate(update)
        .then(function(status) {
          updates.emit('editUpdate', update);
        })
        .fail(function(err) {
          console.error(err);
        });
      });
    });
};