var htmlLink ='http://mtgimage.com/setname/magic%202014%20core%20set/';  //store first part of HTML link for concatenation.

var CardsModel = Backbone.Model.extend({});
var CardsCollection = Backbone.Collection.extend({
  model:CardsModel,
  url:'api/list',
  comparator: "title"
});
// Create a collection organized by title

var cardsCollection = new CardsCollection(); // start a new collection.

/**
 * This prototype function takes in  a string and converts it to proper title case
 *  it also takes into account common words that are not capitalized
 *   for title case
 * @return {[String]} [A string that is title case]
 */
String.prototype.toProperCase = function () {
  var i, j, str, lowers;
  this.toLowerCase();
  str= this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() +
    txt.substr(1).toLowerCase();});
  lowers = {'A ':'a ', 'An ':'am ', 'The ':'the ', 'And ':'and ', 'But ':'but ',
    'Or ':'or ','For ':'for ', 'Nor ':'nor ', 'As ':'as ', 'At ':'at ',
    'By ':'by ', 'From ':'from ', 'In ':'in ', 'Into ':'into ','Of ':'of ',
    'On ':'on ', 'Onto ':'onto ', 'To ':'to ', 'With ':'with '};

  for (var val in lowers)
    str = str.replace(new RegExp(val, "g"), lowers[val]);
    return str;
  };

/**
 *  accesses a local Chaisson file that contains all card information from the
 *  2015 core set of magic the gathering. Compares it to the string name
 *  passed in from the form, and searches the juice on file for the proper
 *  card information.
 * @param  {[Jace on file]} data [Natural gathering card information]
 */
$.getJSON("/js/lib/M14.json", function(data){
  var temp = '';
  $('#btn-add').click(function(){
  data_array = $("form").serializeArray();
  temp = data_array[0].value;
  var input = temp.toProperCase();
  console.log(input);

  data.cards.forEach(function(cardInfo, index){
    if(cardInfo.name === input){
      console.log(input);
      var card = {};
      card.title = input;
      card.img = htmlLink + (input.replace(/\ /g, '%20')) +'.jpg';
      card.text = cardInfo.text;
      cardsCollection.create(card);
      input ="";
    }});

   });
  $(function () {
  window.app = new Router();
  Backbone.history.start();
});

 });

var Router = Backbone.Router.extend({
  routes: {
    '': 'home'
  },
  home: function () {
    this.homeView = new HomeView({collection: cardsCollection});
    this.homeView.render();
  }

});

var HomeView = Backbone.View.extend({
  el: 'tbody',
    initialize: function () {
      var self = this;
      this.collection.fetch({
        success: function () {
          console.log("collection Fetched");
        },
        error: function () {
          console.log("the collection did not fetch");
        }
      });

      this.listenTo(this.collection, 'sort', this.render); //'refrsh on card sort'
    },
    render: function () {
      temp ="";
      console.log(temp);
      for (var i=0; i < this.collection.length;++i){
        console.log(this.collection.length);
        temp +='<tr><td style ="display: inline-block; width: 200">' +
        '<img width="200" class="img-responsive" src= '+
        this.collection.models[i].attributes.img +'></td>' +
        '<td style ="float: left width:200" align ="left">' +
        this.collection.models[i].attributes.text+'</td></tr>';
       }
         $(this.$el).html(temp);
   }
  });

temp = '';




// this.create vs add adds it to server.
