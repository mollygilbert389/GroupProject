

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBVVr8A-0xEcW4J3FK0sGQdLynUGIUOhKY",
    authDomain: "reelmatch-99121.firebaseapp.com",
    databaseURL: "https://reelmatch-99121.firebaseio.com",
    projectId: "reelmatch-99121",
    storageBucket: "reelmatch-99121.appspot.com",
    messagingSenderId: "158556332945"
  };
firebase.initializeApp(config);
var database = firebase.database();    
var auth = firebase.auth();
//Declaring all of the global functions to make the site work
var favmovies = [];
var favtmdb = [];
var recomObj = {};
var ratedObj = {};
var recommendArray= [];
var recommendations = [];
var searchResults = [];
var recommends = [];
var tmdb_key = "c5e11b07aed33fed93509604abbe325f";
var omdb_key = "900ac6b6"
var page = 0;
var alphabet = "abcdefghijklmnopqrtstuvwxyz0123456789.-"
var loggedIn = false;
var userid = 0;
var movieobj = {};
var name = "";

//////////////////////////////////////////////////////////////////////////////////////////////
//Functions to genrate recommended movies based on favorited movies
//////////////////////////////////////////////////////////////////////////////////////////////

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
    recommendations = [];
    var promises = array.map((id) => {
        return new Promise(function(res) { 
            var idurl = "https://api.themoviedb.org/3/movie/" + id + " ?api_key="+tmdb_key+"&language=en-US"
            var imdbID = "";
            $.ajax({
                url: idurl,
                method: "GET"
            }).then(function(data) {
                imdbid = data.imdb_id;
                res(imdbid)
            });
        })
    })
    Promise.all(promises).then(function(alldata) {
        var temp = alldata;
        recommendations = temp.filter(movie=> favmovies.indexOf(movie) < 0);     
        getResults(recommendations);
    })
}

var getResults = function(array) {
    page = 0;
    for (var i = 0; i < 10; i++) {
        var moiveid = array[i]
        var movieurl = "https://www.omdbapi.com/?i=" + moiveid + "&y=&plot=short&apikey="+omdb_key
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
        if (loggedIn == true) {
            var update = {};
            update[userid+"/favorites"] = favmovies;
            database.ref("/users").update(update);
        }
        
    })
    trailerIMG = $("<img>").attr("src", "assets/images/trailer.png");
    trailerIMG.attr("id-holder", id);
    trailerIMG.on("click", function(){
        var movie =  $(this).attr("id-holder");
        playTrailer(movie);
    });
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
    recomRT.append(trailerIMG);
    IMBDlink.append(IMDBimg);
    recomIMBD.append(IMBDlink);
    recomBtns.append(recomFav);
    recomBtns.append(recomRT);
    recomBtns.append(recomIMBD);
    newCont.append(recomIMG);
    newCont.append(recomTxt);
    newCont.append(recomBtns);
    $("#recommendation-info").append(newCont);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//Functions to search movies and generate responses on the web page.
//////////////////////////////////////////////////////////////////////////////////////////////

//CAll TMDB API to get an array of seach results
var searchMovie = function(movie) {
    var url = "https://api.themoviedb.org/3/search/movie?api_key="+ tmdb_key+"&language=en-US&query="+movie+"&page=1&include_adult=false";
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


//Converting the array of search results to imdb movie ids
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


//Using the IMDB movie titles to call the OMDB API to pull data objects on each movie
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


//Transforming the movie data objects into "cards" in the search display area
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
        if (loggedIn == true) {
            var update = {};
            update[userid+"/favorites"] = favmovies;
            database.ref("/users").update(update);
        }
    })

    trailerIMG = $("<img>").attr("src", "assets/images/trailer.png");
    trailerIMG.attr("id-holder", id);
    trailerIMG.on("click", function(){
        var movie =  $(this).attr("id-holder");
        playTrailer(movie);
    });
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
    recomRT.append(trailerIMG);
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

var turnPage = function(movies) {
    if (page <= movies.length && page >= 0) {
       var array = movies;
        if (movies.length - page < 10){
            for (var i = page; i < array.length; i++) {
                var movieid = array[i]
                if (movieid != null && movieid.length > 0) {
                    var movieurl = "https://www.omdbapi.com/?i=" + movieid + "&y=&plot=short&apikey="+omdb_key
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
                    var movieurl = "https://www.omdbapi.com/?i=" + movieid + "&y=&plot=short&apikey="+omdb_key
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
        if (loggedIn == true) {
            var update = {};
            update[userid+"/favorites"] = favmovies;
            database.ref("/users").update(update);
        }
    })
    recomTxt.append(titleTag);
    recomTxt.append(plotTag);
    recomFav.append(favimg);
    recomBtns.append(recomFav);
    newCont.append(recomTxt);
    newCont.append(recomBtns);
    $("#favorites-info").append(newCont);
}

var playTrailer = function (movieid) {
    event.preventDefault();
    $("#trailerModal").attr("style", "display: block")
    var IDurl = "https://api.themoviedb.org/3/find/" + movieid + "?api_key=" + tmdb_key + "&language=en-US&external_source=imdb_id"
    $.ajax({
        url: IDurl,
        method: "GET"
    }).done(function (data) {
        var tmdbID = data.movie_results[data.movie_results.length-1].id;
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
    newFrame.attr("height", 390);
    newFrame.attr("width", 640);
    newFrame.attr("src", "https://www.youtube.com/embed/" + id)
    var trailer = $("#trailer");
    trailer.empty()
    trailer.append(newFrame);
}

var createSucess = function(user) {
    $("#signUpModal").css("display", "none");
    $(".modal-backdrop")[0].remove();
    userid = user.user.uid;
    update = {};
    update[userid+"/favorites"] = favmovies;
    update[userid+"/name"] = name;
    update[userid+"/email"] = user.user.email;
    database.ref("/users").update(update);
}

var loginSuccess = function(user) {
    $("#email").val("")
    $("#password").val("")
    $("#email").val("")
    $("#password1").val("")
    $("#movieSection").empty()
    $("#recommendSection").empty();
    $("#seachbtns").attr("style","display:none")
    $("#seachbtns-bottom").attr("style","display:none")
    $("#search-title").text("Search Results");
    $("body").removeClass("modal-open")
    $("#signInModal").css("display", "none");
    $(".modal-backdrop")[0].remove();
    userid = user.user.uid;
    loggedIn = true;
    database.ref("/users").once("value").then(function(data) {
        favmovies = data.val()[userid].favorites
        if(typeof(favmovies)== "undefined") {
            favmovies = [];
        }
    })
}

database.ref("/users").on("value", function(data) {
    allUsers = Object.values(data.val());
})

var nameCheck = function(name) {
    var isCorrect = true;
    for (var i = 0; i < name.length; i++) {
        if (alphabet.indexOf(name[i].toLowerCase()) < 0 ) {
            isCorrect = false;
        }
    }
    if (name.length < 1) {
        isCorrect = false;
    }
    else if (name.length > 11) {
        isCorrect = false;
    }
    return isCorrect;
}

var checkEmail = function(email) {
    var allEmail = [];
    var isUnique = true;
    for (var i in allUsers) {
        allEmail.push(allUsers[i].email);
    }
    for (var j in allEmail) {
        if (allEmail[j] == email) {
            isUnique = false;
        }
    }
    return isUnique;
}



$(document).ready(function() {
    auth.signOut();
   
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
        if( favmovies.length > 0) {
            $("#movieSection").empty()
            $("#recommendation-info").empty();
            $("#recommendSection").empty();
            $("#favorites-info").empty()
            $("#seachbtns").attr("style","display:block")
            $("#seachbtns-bottom").attr("style","display:block")
            $("#search-title").text("Recommendations")
            searchType = "recommend";
            page=0;
            getRecommendations(favmovies);
        }
    })

    $("#favorites").on("click", function(event){
        event.preventDefault();
        $("#movieSection").empty()
        $("#recommendation-info").empty();
        $("#recommendSection").empty();
        $("#favorites-info").empty()
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
    /*Tab Navigation*/
    $(".nav-link").click( function() {
        $(".nav-link").removeClass("active");
    });

    $('#myTab a').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    /*End of Tab Navigation  */

    $("#x").on("click", function () {
        var modal = $("#trailerModal");
        modal.attr("style", "display: none")
        $("#trailer").empty();
    })

    $('.message a').click(function () {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
    });


    $( "#register" ).on( "click", function() {
        event.preventDefault();
        name = $("#name4").val().trim();
        var email = $("#email4").val().trim();
        var password = $("#password4").val().trim();
        var condition = nameCheck(name);
        var condition2 = checkEmail(email);
        if (condition == true && condition2 == true) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => createSucess(user))
            .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            $("#errormessage4").text(errorMessage)
            $("#password4").val("")
            });
        } else {
            console.log("Bad Name or Email")
        }
    });

    
    $( "#register2" ).on( "click", function() {
        event.preventDefault();
        name = $("#name2").val().trim();
        var email = $("#email2").val().trim();
        var password = $("#password2").val().trim();
        var condition = nameCheck(name);
        var condition2 = checkEmail(email);
        if (condition == true && condition2 == true) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => createSucess(user))
            .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            $("#errormessage2").text(errorMessage)
            $("#password2").val("")
            });
        } else {
            console.log("Bad Name or Email")
        }
    });


    $("#sign-in").on( "click", function() {
        event.preventDefault();
        $("#loginButton").hide();
        $("#signupButton").hide();
        $("#logoutButton").attr('style','display: block');

        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => loginSuccess(user))
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $("#errormessage").text(errorMessage)
                $("#password").val("")
            });
    });
    $("#sign-in2").on( "click", function() {
        event.preventDefault();
        $("#loginButton").hide();
        $("#signupButton").hide();
        $("#logoutButton").attr('style','display: block');

        var email = $("#email1").val().trim();
        var password = $("#password1").val().trim();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => loginSuccess(user))
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $("#errormessage2").text(errorMessage)
                $("#password2").val("")
                });
        });

   
$("#logoutButton").on("click", function(){
  
    firebase.auth().signOut().then(function() {
        // Sign- 
         $("#loginButton").show();
    $("#signupButton").show();
    $("#logoutButton").attr('style','display: none');
      }, function(error) {
        // An error happened.
      });
})

    $("#sing-in2").on( "click", function() {
        event.preventDefault();
        var email = $("#email1").val().trim();
        var password = $("#password1").val().trim();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => loginSuccess(user))
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $("#errormessage1").text(errorMessage)
                $("#password1").val("")
            });
    });

    $("#signout").on("click", function(){
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }, function(error) {
            // An error happened.
        });
        })
});
