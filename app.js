

var arr=[];
 // arr.push(temp);

$("#search").on("click", function(){

    var movie = $("#q").val();
    var url = "https://www.omdbapi.com/?s=" + movie + "&plot=short&apikey=6cf3f906";

// $.ajax({
//     url: url,
//     method: "GET"
// }).then(function(response) {

//   console.log(response.Poster);
// });


$.ajax({
    type: "GET",
    url: url,
}).then(function (res) {
    for(var i=1; i<10;i++){
        var posterDiv = $("<div>");

        //console.log(res.Search[i].Title);
        var pic = $("<img>");
        pic.attr("src", res.Search[i].Poster);    
        pic.attr("style","height: 100px");
        var p = $("<p>").text(res.Search[i].Title);
        posterDiv.prepend(p);
        posterDiv.append(pic);
        posterDiv.attr("style","display: inline-block");

        $("#posters").prepend(posterDiv);

    }


});

});