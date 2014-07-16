console.log("index.js loaded");

var init = function () {
    console.log("init fn called");
    assignHandlers();

}

var assignHandlers = function(){
    $('li').each(function(item){
        //printout(item);
        $(this).click(function(){
            url = "http://localhost:3000/products";
            div = $.get(url, {category:this.textContent}, populateDiv, "text");
        })
    });
}

var printout = function(str){
    console.log(str);
}

var populateDiv = function(data, status){
    console.log(status);
}


$(init);