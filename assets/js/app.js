
var favMovies=[];
var page =1;

$("#submit").on("click", function(){
    $("#movieSection").empty()
    var movie = $("#search-movie").val();
    //var url = "https://www.omdbapi.com/?s=" + movie + "&plot=short&type=movie&page="+String(page)+"&apikey=6cf3f906";
    var url = "https://api.themoviedb.org/3/search/movie?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&query="+movie+"&page=1&include_adult=false"
$.ajax({
    type: "GET",
    url: url,
}).then(function (data) {
    console.log(data)
    for(var i=0; i<6;i++){
        movieid=data.results[i].id;
        if (data.results[i].vote_count > 0) {
            var url1 = "https://api.themoviedb.org/3/movie/" + movieid + " ?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
        //var url1 = "https://www.omdbapi.com/?i=" + movie + "&plot=short&apikey=6cf3f906";
            console.log(movieid)
        $.ajax({
            url: url1,
            method: "GET"
        }).then(function(data2) {
            movie = data2.imdb_id;
            var url1 = "https://www.omdbapi.com/?i=" + movie + "&plot=short&apikey=6cf3f906";

            $.ajax({
                type: "GET",
                url: url1,
            }).then(function (res){
                //console.log(res.Poster);
           
                var posterDiv = $("<div>");
                var poster=$("<div>");
                var text=$("<div>");
                var pic = $("<img>");
                pic.addClass("pic")
                pic.attr("src", res.Poster);    
                var p = $("<h3>").text(res.Title);
           
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
                
                $("#movieSection").append(posterDiv);
                      
            })
        });
        }
        
    }
 
        // //posterDiv is where the picture and title will be displayd inline block.
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
