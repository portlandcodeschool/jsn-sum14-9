var wishMainTemplate = '<h2>Add a Todo</h2>' +
  '<div class="form-group">' +
    '<label for="todo-input">Todo Title</label>' +
    '<input id="todo-input" class="form-control" type="text">' +
    '<br>' +
    '<label for="description-input">Todo Description</label>' +
    '<input id="description-input" class="form-control" type="text">' +
    '<br>' +
    '<button id="add-todo" class="btn btn-success">Add todo</button>' +
    '<br>' +
  '</div>' +
  '<br><br>' +
  '<h3>My Todos</h3>' +
  '<div id="todo-list">' +
  '</div>';

var WishListMainView = Backbone.View.extend({
  el: '#my-app',
  initialize: function () {
    this.collection.fetch();
    $(this.el).html(wishMainTemplate);
  },
  render: function () {
    var wishListView = new WishListView({collection: WishList});
    wishListView.render();
    $('#todo-list').html(wishListView.$el);

    var wishInputView = new WishInputView({collection: wList});

  }

});
