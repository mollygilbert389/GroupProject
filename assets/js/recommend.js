//movie by imdb ID: "https://api.themoviedb.org/3/find/IDHERE?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&external_source=imdb_id"
//movie query: "https://api.themoviedb.org/3/search/movie?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&query=seatchtexthere&page=1&include_adult=false"
//person movie credits: "https://api.themoviedb.org/3/person/{person_id}/movie_credits?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
//movie database link: https://developers.themoviedb.org/3/movies/get-movie-details

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDwKzfB-DM1BrllQTwCe4MmY5gWEi3tD7o",
    authDomain: "reelmatchut.firebaseapp.com",
    databaseURL: "https://reelmatchut.firebaseio.com",
    projectId: "reelmatchut",
    storageBucket: "reelmatchut.appspot.com",
    messagingSenderId: "539462332267"
  };
firebase.initializeApp(config);
var database = firebase.database();    
var favmovies = ["tt0172495","tt0095016","tt1431045","tt0112573","tt0371746","tt4481414"];
// Gladitator, Die Hard, Deadpool, Braveheart, Iron Man, Gifted
var favtmdb = [];
var recomObj = {};
var ratedObj = {};
var recommendArray= [];
var recommendations = [];
var searchResults = [];
var tmdb_key = "c5e11b07aed33fed93509604abbe325f";
var omdb_key = "900ac6b6"
var page = 0;
var alphabet = "abcdefghijklmnopqrtstuvwxyz0123456789.-"
//var searchpage = 5;

var getRecommendations = function(array) {
    var idArray = [];
    var promises = array.map( (id) => {
        return new Promise(function(res) {
            var IDurl = "https://api.themoviedb.org/3/find/" + String(id) + "?api_key="+tmdb_key+"&language=en-US&external_source=imdb_id"
            var tmdbID = "";
            $.ajax({
                url: IDurl,
                method: "GET"
            }).done(function(data) {
                tmdbID = data.movie_results[0].id;
                idArray.push(String(tmdbID));
                res(tmdbID)
            })
        })
    })
    Promise.all(promises).then(function(alldata) {
        favtmdb = alldata;
        getRecom(alldata);
    })
}

var getRecom = function(array) {
    var promises = array.map( (id) => {
        return new Promise(function(res) {
            var recurl = "https://api.themoviedb.org/3/movie/" + String(id)  +"/recommendations?api_key="+tmdb_key+"&language=en-US&page=1"
            var recommends = [];
            $.ajax({
                url: recurl,
                method: "GET"
            }).then(function(data) {
                
                for (var i = 0; i < data.results.length; i++) {
                    var tempid = data.results[i].id
                    recommends.push(tempid)
                }        
                recomObj[id] = recommends;
                res(recomObj)
            });
        })
    })
    Promise.all(promises).then(function(alldata) {
        sortObj(recomObj);
    })
}

var sortObj = function(myobject) {
    objKeys = Object.keys(myobject);
    var ratedMovies = [];
    for (var i = 0; i < objKeys.length; i++) {
        for (var j = 0; j < myobject[objKeys[i]].length; j++) {
            var movie = myobject[objKeys[i]][j];
            
            if (ratedMovies.indexOf(movie) < 0 && favtmdb.indexOf(movie) < 0 ) {
                var rating = getRated(myobject,movie);
                ratedMovies.push(movie);
                ratedObj[movie] = rating;
            }
        }
    }
    sortRatings(ratedObj);
    getIMDBids(recommendArray)
}

var getRated = function(movieObj, movie) {
    objKeys = Object.keys(movieObj);
    rating = 0;
    for (var i = 0; i < objKeys.length; i++) {
        if (movieObj[objKeys[i]].indexOf(movie) >= 0) {
            rating++
        }
    }
    return rating;
}

var sortRatings = function(myobject) {
    var sortable = [];
    for (var id in myobject) {
        sortable.push([id, myobject[id]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    })

    for (var i = 0;  i< sortable.length;i++){
        recommendArray.push(sortable[i][0])
    }
}

var getIMDBids = function(array) {
    var recommends = [];
    var promises = array.map((id) => {
        return new Promise(function(res) { 
            var idurl = "https://api.themoviedb.org/3/movie/" + id + " ?api_key="+tmdb_key+"&language=en-US"
            var imdbID = "";
            $.ajax({
                url: idurl,
                method: "GET"
            }).then(function(data) {
                imdbid = data.imdb_id;
                recommends.push(imdbid);
                res(imdbid)
            });
        })
    })
    Promise.all(promises).then(function(alldata) {
        recommendations = alldata;
        getResults(recommendations)
    })
}

var getResults = function(array) {
    page = 0;
    for (var i = 0; i < 10; i++) {
        var moiveid = array[i]
        var movieurl = "http://www.omdbapi.com/?i=" + moiveid + "&y=&plot=short&apikey="+omdb_key
        $.ajax({
            url: movieurl,
            method: "GET"
        }).then(function(data) {
            createRecomCards(data);
        });
    }
}

var createRecomCards = function(data) {
    var id = String(data.imdbID);
    var title = data.Title;
    var plot = data.Plot;
    var rating = data.Rated;
    var genre = data.Genre;
    var director = data.Director;
    var year = data.Year;        
    var actors = data.Actors;
    var writer = data.Writer;
    var posterurl = data.Poster;
    var titleTag = $("<h4>").html("<b>" + title + "</b> " + "<em>("+year+")</em>");
    var plotTag = $("<p>").html("<b>Plot: </b>"+plot);
    var directorTag = $("<p>").html("<b>Director: </b>" + director );
    var actorsTag = $("<p>").html("<b>Starring: </b>" + actors);
    var ratingTag = $("<p>").html("<b>Rated: </b>" + rating);
    var writerTag = $("<p>").html("<b>Writer: </b>" + writer);
    var genreTag = $("<p>").html("<b>Genre: </b>" + genre);
    var newCont = $("<div>").addClass("RecomCont");
    var recomIMG = $("<div>").addClass("RIMG");
    var posterIMG =$("<img>").addClass("recomImg")
    posterIMG.attr("src", posterurl)
    var recomTxt = $("<div>").addClass("resultTxt");
    var recomBtns = $("<div>").addClass("buttons");
    var recomFav = $("<div>").addClass("star");
    var recomRT = $("<div>").addClass("rt-link");
    var recomIMBD = $("<div>").addClass("imdb-link");
    var IMBDlink = $("<a>").attr("href", "https://www.imdb.com/title/"+id)
    IMBDlink.attr("target", "_blank")
    var favimg = $("<img>").attr("src", "assets/images/star-inactive.png");
    favimg.attr("id", id);
    if (favmovies.indexOf(id) >= 0) {
        favimg.attr("src", "assets/images/star-active.png")
    } else {
        favimg.attr("src", "assets/images/star-inactive.png");
    }
    favimg.on("click", function(){
        var movieID =  $(this).attr("id");
                if (favmovies.indexOf(movieID) < 0) {
                    favmovies.push(movieID);
                    $(this).attr("src", "assets/images/star-active.png")
                } else {
                    favmovies = favmovies.filter(movie=>movie!==movieID);
                    $(this).attr("src", "assets/images/star-inactive.png")
                }
    })
    RTimg = $("<img>").attr("src", "assets/images/rt_logo.jpg");
    IMDBimg = $("<img>").attr("src", "assets/images/IMDB.svg");
    recomIMG.append(posterIMG)
    recomTxt.append(titleTag);
    recomTxt.append(ratingTag);
    recomTxt.append(plotTag);
    recomTxt.append(actorsTag);
    recomTxt.append(directorTag);
    recomTxt.append(writerTag);
    recomTxt.append(genreTag);
    recomFav.append(favimg);
    recomRT.append(RTimg);
    IMBDlink.append(IMDBimg);
    recomIMBD.append(IMBDlink);
    recomBtns.append(recomFav);
    recomBtns.append(recomRT);
    recomBtns.append(recomIMBD);
    newCont.append(recomIMG);
    newCont.append(recomTxt);
    newCont.append(recomBtns);
    $("#movieSection").append(newCont);
}

var searchMovie = function(movie) {
    var url = "https://api.themoviedb.org/3/search/movie?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&query="+movie+"&page=1&include_adult=false";
    var movies = []
    page = 0;
    $.ajax({
        type: "GET",
        url: url,
    }).then(function (data) {
        for(var i=0; i<data.results.length;i++){
            movieid=data.results[i].id;
            if (data.results[i].vote_count > 0) {
                movies.push(movieid)
            }
        }
        getIMDBids2(movies)
    })
}

var getIMDBids2 = function(array) {
    var promises = array.map((id) => {
        return new Promise(function(res) { 
            var idurl = "https://api.themoviedb.org/3/movie/" + id + " ?api_key="+tmdb_key+"&language=en-US"
            var imdbID = "";
            $.ajax({
                url: idurl,
                method: "GET"
            }).then(function(data) {
                imdbID = data.imdb_id;
                res(imdbID);
            });
        })
    })
    Promise.all(promises).then(function(alldata) {
        searchResults = alldata;
        var movies = alldata.slice(0,10);
        displaySearch(movies)
    })
}

var displaySearch = function(array) {
    var promises = array.map((id) => {
        return new Promise(function(res) { 
          var url1 = "https://www.omdbapi.com/?i=" + id + "&plot=short&apikey=6cf3f906";
            $.ajax({
                type: "GET",
                url: url1,
            }).then(function (data){
                res(data)
            })
        })
    })
    Promise.all(promises).then(function(alldata) {
        for (var i in alldata) {
            createSearchCards(alldata[i]);
        }
    })
}

var createSearchCards = function(data) {
    var id = String(data.imdbID);
    var title = data.Title;
    var plot = data.Plot;
    var rating = data.Rated;
    var genre = data.Genre;
    var director = data.Director;
    var year = data.Year;        
    var actors = data.Actors;
    var writer = data.Writer;
    if ( typeof(data.Poster) != 'undefined' && data.Poster.length > 5) {
        var posterurl = data.Poster;
    } else {
        var posterurl ="#"
    }
    var titleTag = $("<h4>").html("<b>" + title + "</b> " + "<em>("+year+")</em>");
    var plotTag = $("<p>").html("<b>Plot: </b>"+plot);
    var directorTag = $("<p>").html("<b>Director: </b>" + director );
    var actorsTag = $("<p>").html("<b>Starring: </b>" + actors);
    var ratingTag = $("<p>").html("<b>Rated: </b>" + rating);
    var writerTag = $("<p>").html("<b>Writer: </b>" + writer);
    var genreTag = $("<p>").html("<b>Genre: </b>" + genre);
    var newCont = $("<div>").addClass("RecomCont");
    var recomIMG = $("<div>").addClass("RIMG");
    var posterIMG =$("<img>").addClass("recomImg")
    posterIMG.attr("src", posterurl)
    var recomTxt = $("<div>").addClass("resultTxt");
    var recomBtns = $("<div>").addClass("buttons");
    var recomFav = $("<div>").addClass("star");
    var favimg = $("<img>").attr("src", "assets/images/star-inactive.png");
    favimg.attr("id", id);
    if (favmovies.indexOf(id) >= 0) {
        favimg.attr("src", "assets/images/star-active.png")
    } else {
        favimg.attr("src", "assets/images/star-inactive.png");
    }
    favimg.on("click", function(){
        var movieID =  $(this).attr("id");
                if (favmovies.indexOf(movieID) < 0) {
                    favmovies.push(movieID);
                    $(this).attr("src", "assets/images/star-active.png")
                } else {
                    favmovies = favmovies.filter(movie=>movie!==movieID);
                    $(this).attr("src", "assets/images/star-inactive.png")
                }
    })
    recomIMG.append(posterIMG)
    recomTxt.append(titleTag);
    recomTxt.append(ratingTag);
    recomTxt.append(plotTag);
    recomTxt.append(actorsTag);
    recomTxt.append(directorTag);
    recomTxt.append(writerTag);
    recomTxt.append(genreTag);
    recomFav.append(favimg);
    recomBtns.append(recomFav);
    newCont.append(recomIMG);
    newCont.append(recomTxt);
    newCont.append(recomBtns);
    $("#movieSection").append(newCont);
}

var turnPage = function(movies) {
    if (page <= movies.length && page >= 0) {
       var array = movies;
        if (movies.length - page < 10){
            for (var i = page; i < array.length; i++) {
                var movieid = array[i]
                if (movieid != null && movieid.length > 0) {
                    var movieurl = "http://www.omdbapi.com/?i=" + movieid + "&y=&plot=short&apikey="+omdb_key
                    $.ajax({
                        url: movieurl,
                        method: "GET"
                    }).then(function(data) {
                        if (searchType == "search") {
                            createSearchCards(data);
                        } else if (searchType == "recommend") {
                            createRecomCards(data);
                        } else if (searchType == "favorites") {
                            createFavoriteCards(data);
                        }
                    });
                }
            }  
        } else {
            for (var i = page; i < page+10; i++) {
                var movieid = array[i]
                if (movieid != null && movieid.length > 0) {
                    var movieurl = "http://www.omdbapi.com/?i=" + movieid + "&y=&plot=short&apikey="+omdb_key
                    $.ajax({
                        url: movieurl,
                        method: "GET"
                    }).then(function(data) {
                        if (searchType == "search") {
                            createSearchCards(data);
                        } else if (searchType == "recommend") {
                            createRecomCards(data);
                        } else if (searchType == "favorites") {
                            createFavoriteCards(data);
                        }
                    });
                }
            }  
        }
    }
}


var getFavorites = function(array) {
    var promises = array.map((id) => {
        return new Promise(function(res) { 
          var url1 = "https://www.omdbapi.com/?i=" + id + "&plot=short&apikey=6cf3f906";
            $.ajax({
                type: "GET",
                url: url1,
            }).then(function (data){
                res(data)
            })
        })
    })
    Promise.all(promises).then(function(alldata) {
        var movies = alldata.slice(0,10);
        for (var i in movies) {
            createFavoriteCards(movies[i]);
        }
    })
}

var createFavoriteCards = function(data) {
    var id = String(data.imdbID);
    var title = data.Title;
    var plot = data.Plot;
    var year = data.Year;        
    var titleTag = $("<h5>").html("<b>" + title + "</b> " + "<em>("+year+")</em>");
    var plotTag = $("<p>").html("<b>Plot: </b>"+plot);
    var newCont = $("<div>").addClass("FavCont");
    var recomTxt = $("<div>").addClass("resultTxt");
    var recomBtns = $("<div>").addClass("buttons");
    var recomFav = $("<div>").addClass("star");
    var favimg = $("<img>").attr("src", "assets/images/star-inactive.png");
    favimg.attr("id", id);
    if (favmovies.indexOf(id) >= 0) {
        favimg.attr("src", "assets/images/star-active.png")
    } else {
        favimg.attr("src", "assets/images/star-inactive.png");
    }
    favimg.on("click", function(){
        var movieID =  $(this).attr("id");
                if (favmovies.indexOf(movieID) < 0) {
                    favmovies.push(movieID);
                    $(this).attr("src", "assets/images/star-active.png")
                } else {
                    favmovies = favmovies.filter(movie=>movie!==movieID);
                    $(this).attr("src", "assets/images/star-inactive.png")
                }
    })
    recomTxt.append(titleTag);
    recomTxt.append(plotTag);
    recomFav.append(favimg);
    recomBtns.append(recomFav);
    newCont.append(recomTxt);
    newCont.append(recomBtns);
    $("#movieSection").append(newCont);
}



$("#submit").on("click", function(event){
    event.preventDefault();
    $("#movieSection").empty()
    $("#recommendSection").empty();
    $("#seachbtns").attr("style","display:block")
    $("#seachbtns-bottom").attr("style","display:block")
    var movie = $("#search-movie").val();
    searchType = "search";
    $("#search-title").text("Search Results");
    page = 0;
    searchMovie(movie);
})

$("#recommendations").on("click", function(event){
    event.preventDefault();
    $("#movieSection").empty()
    $("#recommendSection").empty();
    $("#seachbtns").attr("style","display:block")
    $("#seachbtns-bottom").attr("style","display:block")
    $("#search-title").text("Recommendations")
    searchType = "recommend";
    page=0;
    getRecommendations(favmovies);
})

$("#favorites").on("click", function(event){
    event.preventDefault();
    $("#movieSection").empty()
    $("#recommendSection").empty();
    $("#seachbtns").attr("style","display:block")
    $("#seachbtns-bottom").attr("style","display:block")
    $("#search-title").text("Favorites")
    searchType = "favorites";
    page=0;
    getFavorites(favmovies);
})


$("#nextPage").on("click", function(event){
    event.preventDefault();
    if (searchType == "search") {
        if (page <= searchResults.length-9) {
            page += 10;
            $("#movieSection").empty();
            turnPage(searchResults);
        }
    } else if (searchType == "recommend") {
        if (page <= recommendations.length-9 && page >= 0) {
            page += 10;
            $("#movieSection").empty();
            turnPage(recommendations);
        }
    } else if (searchType == "favorites") {
        if (page <= favmovies.length-9) {
            page += 10;
            $("#movieSection").empty();
            turnPage(favmovies);
        }
    }
})

$("#prevPage").on("click", function(event){
    event.preventDefault();
    if (searchType == "search") {
        if ( page >= 10 ) {
            page -= 10;
            $("#movieSection").empty();
            turnPage(searchResults);
        }
    } else if (searchType == "recommend") {
        if (page <= recommendations.length && page >= 10 ) {
            page -= 10;
            $("#movieSection").empty();
            turnPage(recommendations);
        }
    } else if (searchType == "favorites") {
        if (page <= favmovies.length && page >= 10 ) {
            page -= 10;
            $("#movieSection").empty();
            turnPage(favmovies);
        }
    }
})


$("#nextPage-bottom").on("click", function(event){
    event.preventDefault();
    if (searchType == "search") {
        if (page <= searchResults.length-9) {
            page += 10;
            $("#movieSection").empty();
            turnPage(searchResults);
        }
    } else if (searchType == "recommend") {
        if (page <= recommendations.length-9 && page >= 0) {
            page += 10;
            $("#movieSection").empty();
            turnPage(recommendations);
        }
    } else if (searchType == "favorites") {
        if (page <= favmovies.length-9) {
            page += 10;
            $("#movieSection").empty();
            turnPage(favmovies);
        }
    }
})

$("#prevPage-bottom").on("click", function(event){
    event.preventDefault();
    if (searchType == "search") {
        if ( page >= 10 ) {
            page -= 10;
            $("#movieSection").empty();
            turnPage(searchResults);
        }
    } else if (searchType == "recommend") {
        if (page <= recommendations.length && page >= 10 ) {
            page -= 10;
            $("#movieSection").empty();
            turnPage(recommendations);
        }
    } else if (searchType == "favorites") {
        if (page <= favmovies.length && page >= 10 ) {
            page -= 10;
            $("#movieSection").empty();
            turnPage(favmovies);
        }
    }
})

$("#x").on("click", function () {
    var modal = $("#trailerModal");
    modal.attr("style", "display: none")
})

var playTrailer = function (movieid) {
    event.preventDefault();
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
    newFrame.addClass("trailerSize")
    newFrame.attr("src", "https://www.youtube.com/embed/" + id)
    var trailer = $("#trailer");
    trailer.empty()
    trailer.append(newFrame);
}



