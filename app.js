
var arr=[];

$("#search").on("click", function(){

    var movie = $("#q").val();
    var url = "https://www.omdbapi.com/?s=" + movie + "&plot=short&apikey=6cf3f906";
$.ajax({
    type: "GET",
    url: url,
}).then(function (res) {
    for(var i=1; i<10;i++){
        var posterDiv = $("<div>");

        var pic = $("<img>");
        pic.addClass("pic")
        pic.attr("src", res.Search[i].Poster);    
        var p = $("<p>").text(res.Search[i].Title);
        posterDiv.prepend(p);
        posterDiv.append(pic);
        posterDiv.attr("value",res.Search[i].imdbID);

        posterDiv.data(res.Search[i].imdbID);
        posterDiv.addClass("picture")
        posterDiv.attr("style","display: inline-block");
 
        
        // //posters is where the posterDIv will prepend
         $("#posters").prepend(posterDiv);
        // //posterDiv is where the picture and title will be displayd inline block.
    }
    $(".picture").on("click", function(){
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
