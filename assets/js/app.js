
var favMovies=[];

$("#submit").on("click", function(){

    var movie = $("#search-movie").val();
    var url = "https://www.omdbapi.com/?s=" + movie + "&plot=short&apikey=6cf3f906";

$.ajax({
    type: "GET",
    url: url,
}).then(function (res1) {
    for(var i=1; i<10;i++){
        movie=res1.Search[i].imdbID;
        var url1 = "https://www.omdbapi.com/?i=" + movie + "&plot=short&apikey=6cf3f906";
 
 $.ajax({
     type: "GET",
     url: url1,
 }).then(function (res){
     console.log(res.Poster);

     var posterDiv = $("<div>");
     var poster=$("<div>");
     var text=$("<div>");
     var pic = $("<img>");
     pic.addClass("pic")
     pic.attr("src", res.Poster);    
     var p = $("<p>").text(res.Title);

     var plot=$("<p>").text("Plot: "+res.Plot);



     text.prepend(plot);
     text.prepend("<br>");
     text.prepend(p);
 
     poster.prepend(pic);
     text.addClass("text")
     poster.addClass("poster")

     posterDiv.prepend(text);
     posterDiv.prepend(poster);
     posterDiv.attr("value",res.imdbID);

     posterDiv.data(res.imdbID);
     posterDiv.addClass("card")
     posterDiv.attr("style","display: inline-block");
     
     
     // //posters is where the posterDIv will prepend
      $("#movieSection").prepend(posterDiv);


 
 })
 



        // //posterDiv is where the picture and title will be displayd inline block.
    }
    $(".card").on("click", function(){
        var val=this.getAttribute("value");
        if(arr.includes(val)){
            arr=arr.filter(arr=>arr!==val);
        }
        else{
            arr.push(val);        

        }


  })

});

});
