$(function () {
  $('#add-ingredient').click(function(){
    $newIngredient = $('#ingredient-input');
    console.log($newIngredient);
    var newIngredient = {};
    newIngredient.ingredient = $newIngredient.val();
    console.log(newIngredient);

    $newIngredient.val('');

    if (newIngredient) {
      $.post('/addingredient', newIngredient, function (response) {
        console.log(response);
        setTimeout(function(){location.reload();}, 500);
      });
    }  
  });
});