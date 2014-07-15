var express = require('express');
var router = express.Router();
var store = require('../lib/store');
var Handlebars = require('handlebars');
var Event = require('../models/event');

function locals(req, res, next) {
  res.locals.partials = {
    header: '../partials/header',
    footer: '../partials/footer',
    nav: '../partials/nav',
    form: '-form'
  };
  next();
}

function renderError(res, err) {
  res.status(err.status || 500);
  res.send('<h1>' + err.message + '</h1>');
}

// GET /events
router.get('/', locals, function(req, res) {
  res.locals.eventsIndexActive = new Handlebars.SafeString('class="active"');

  store.listEvents()
  .then(function(events) {
    res.render('events/index', {
      events: events
    });
  })
  .fail(function(err) {
    renderError(res, err);
  });
});

// POST /events
router.post('/', function(req, res) {
  var event = new Event(req.body);

  store.createEvent(event)
  .then(function(event) {
    res.json(event);
  })
  .fail(function(err) {
    res.json(err.status, { msg: err.message });
  });
});

// GET events/:key/publish
router.get('/:key/publish', locals, function(req, res) {
  var key = req.params.key;

  store.getEvent(key)
  .then(function(event) {
    res.render('events/publish', {
      event: event
    });
  })
  .fail(function(err) {
    renderError(res, err);
  });
});

// POST events/:key/publish
router.post('/:key/publish', function(req, res) {
  var key = req.params.key;
  var update = req.body;

  store.createUpdate(key, update)
  .then(function(update) {
    res.json(update);
  })
  .fail(function(err) {
    res.json(err.status, { msg: err.message });
  });
});

// GET /events/new
router.get('/new', locals, function(req, res) {
  var event = new Event();
  console.log(event)
  res.locals.eventsNewActive = new Handlebars.SafeString('class="active"');
  res.render('events/new', {
    event: {
      name: '',
      about: '',
      when: '',
      where: ''
    }
  });
});

// GET /events/:key/edit
router.get('/:key/edit', locals, function(req, res) {
  var key = req.params.key;

  store.getEvent(key)
  .then(function(event) {
    res.render('events/edit', {
      event: event
    });
  })
  .fail(function(err) {
    renderError(res, err);
  });
});

router.get('/:key', locals, function(req, res, next) {
  var key = req.params.key;

  store.getEvent(key)
  .then(function(event) {
    res.render('events/show', {
      event: event
    });
  })
  .fail(function(err) {
    renderError(res, err);
  });
});

// PUT /events/:key
router.put('/:key', function(req, res) {
  var key = req.params.key;
  var event = req.body;

  store.putEvent(key, event)
  .then(function(status) {
    res.json({ redirect: '/events/' + key });
  })
  .fail(function(err) {
    res.json(err.status, { msg: err.message });
  });
});

router.delete('/:key', function(req, res) {
  var key = req.params.key;

  store.deleteEvent(key)
  .then(function(status) {
    res.send(status);
  })
  .fail(function(err) {
    res.json(err.status, { msg: err.message });
  });
});

module.exports = router;
