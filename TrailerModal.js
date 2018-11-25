

var modal = $("#myModal");
var closeBtn = $("#x");
var openModal = $("openModal");

closeBtn.on("click", function () {
    modal.attr("style", "display: none")
})

// openModal.on("click", function () {
//     modal.attr("style", "display: block")
// })

var playTrailer = function (movieid) {
    event.preventDefault();
    tmdb_key = "c5e11b07aed33fed93509604abbe325f"
    var IDurl = "https://api.themoviedb.org/3/find/" + movieid + "?api_key=" + tmdb_key + "&language=en-US&external_source=imdb_id"
    $.ajax({
        url: IDurl,
        method: "GET"
    }).done(function (data) {
        var tmdbID = data.movie_results[0].id;
        var videourl = "https://api.themoviedb.org/3/movie/" + String(tmdbID) + "/videos?api_key=" + tmdb_key + "&language=en-US"
        $.ajax({
            url: videourl,
            method: "GET"
        }).done(function (data) {
            var movie = data.results[0].key
            makevid(movie)
        })
    })
}

var makevid = function(id) {
    var newFrame = $("<iframe>");
    newFrame.attr("width", 640)
    newFrame.attr("height", 390)
    newFrame.attr("src", "https://www.youtube.com/embed/" + id)
    var trailer = $("#trailer");
    trailer.empty()
    trailer.append(newFrame);
}



