var TOKEN = process.env.ORCHESTRATE_API_KEY;
var db = require('orchestrate')(TOKEN);
var Q = require('kew');
var request = require('request');

function error(res) {
  var err = {};
  err.message = res.body.message;
  err.status = res.statusCode;
  return err;
}

function normalizeKeyVals(results) {
  return results.map(function(event) {
    var json = event.value;
    json.key = event.path.key;
    return json;
  });
}

function normalizeEvents(results) {
  return results.map(function(event) {
    var json = event.value;
    json.timestamp = event.timestamp;
    json.ordinal = event.ordinal;
    return json;
  });
}

module.exports = {
  // returns a paginated list of events
  listEvents: function() {
    return db.list('events')
      .then(function(res) {
        return Q.resolve(normalizeKeyVals(res.body.results));
      })
      .fail(function(res) {
        return Q.reject(error(res));
      });
  },

  // returns a single event with a count of the number of updates
  getEvent: function(key) {
    var event = {};

    return db.get('events', key)
      .then(function(res) {
        event = res.body;
        event.key = key;
        return db.newEventReader()
          .from('events', key)
          .type('update');
      })
      .then(function(res) {
        event.updates = res.body.count;
        return Q.resolve(event);
      })
      .fail(function(res) {
        return Q.reject(error(res));
      });
  },

  putEvent: function(key, event) {
    return db.put('events', key, event)
      .then(function(res) {
        return Q.resolve(res.statusCode);
      })
      .fail(function(res) {
        return Q.reject(error(res));
      });
  },

  // returns all updates for an event
  // TODO: support more than 100 events
  getUpdates: function(eventKey) {
    var defer = Q.defer();

    request({
      method: 'GET',
      url: 'https://api.orchestrate.io/v0/events/' + eventKey +
           '/events/update/' + '?limit=100',
      auth: { user: TOKEN },
      headers: {
        'User-Agent': 'Live Blogger',
        'Content-Type': 'application/json'
      }
    }, function(err, res) {
      res.body = JSON.parse(res.body);
      if (res.statusCode !== 200)
        return defer.reject(error(res));
      defer.resolve(normalizeEvents(res.body.results));
    });

    return defer.promise;
  },

  // creates an update event
  createUpdate: function(eventKey, update) {
    var location;

    return db.newEventBuilder()
      .from('events', eventKey)
      .type('update')
      .data(update)
      .then(function(res) {
        // orchestrate doesn't return a key on a successful event
        // PUT so we need to get the timestamp instead
        location = res.headers.location.split('/');
        update.timestamp = +location[6];
        update.ordinal = +location[7];
        return Q.resolve(update);
      })
      .fail(function(res) {
        return Q.reject(error(res));
      });
  },

  // the orchestrate node drive doesn't support updating and deleting events
  // so I'm building the requests by hand

  putUpdate: function(update) {
    var defer = Q.defer();

    request({
      method: 'PUT',
      url: 'https://api.orchestrate.io/v0/events/' + update.eventKey +
           '/events/update/' + update.timestamp + '/' + update.ordinal,
      auth: { user: TOKEN },
      headers: {
        'User-Agent': 'Live Blogger'
      },
      json: { author: update.author, msg: update.msg }
    }, function(err, res) {
      if (res.statusCode !== 204) {
        res.body = JSON.parse(res.body);
        return defer.reject(error(res));
      }
      defer.resolve(res.statusCode);
    });

    return defer.promise;
  },

  // deletes an update event
  deleteUpdate: function(update) {
    var defer = Q.defer();

    request({
      method: 'DELETE',
      url: 'https://api.orchestrate.io/v0/events/' + update.eventKey + '/events/update/' +
           update.timestamp + '/' + update.ordinal + '?purge=true',
      auth: { user: TOKEN },
      headers: {
        'User-Agent': 'Live Blogger'
      }
    }, function(err, res) {
      if (res.statusCode !== 204) {
        res.body = JSON.parse(res.body);
        return defer.reject(error(res));
      }
      defer.resolve(res.statusCode);
    });

    return defer.promise;
  },

  // creates an event
  createEvent: function(event) {
    var location;

    return db.post('events', event)
      .then(function(res) {
        // get the auto-generated key from the location header
        location = res.headers.location.split('/');
        event.key = location[3];
        return Q.resolve(event);
      })
      .fail(function(res) {
        return Q.reject(error(res));
      });
  },

  deleteEvent: function(key) {
    return db.remove('events', key)
      .then(function(res) {
        return Q.resolve(res.statusCode);
      })
      .fail(function(res) {
        return Q.reject(error(res));
      });
  }
};