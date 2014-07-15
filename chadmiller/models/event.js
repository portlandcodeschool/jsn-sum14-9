module.exports = Event;

function Event(body) {
  body = body || {};
  this.name = body.name || '';
  this.about = body.about || '';
  this.when = body.when || '';
  this.where = body.where || '';
  this.status = 'This event is updating live...';
  this.createdAt = new Date();
}