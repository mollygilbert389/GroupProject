//movie by imdb ID: "https://api.themoviedb.org/3/find/IDHERE?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&external_source=imdb_id"
//movie query: "https://api.themoviedb.org/3/search/movie?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&query=seatchtexthere&page=1&include_adult=false"
//person movie credits: "https://api.themoviedb.org/3/person/{person_id}/movie_credits?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
//movie database link: https://developers.themoviedb.org/3/movies/get-movie-details

var favmovies = ["tt0172495","tt0095016","tt1431045","tt0112573","tt0371746","tt4481414"];
// Gladitator, Die Hard, Deadpool, Braveheart, Iron Man, Gifted
var favtmdb = [];
var recomObj = {};
var ratedObj = {};
var recommendArray= [];
var recommendations = [];
var tmdb_key = "c5e11b07aed33fed93509604abbe325f";
var omdb_key = "900ac6b6"
var more = 10;

var getRecommendations = async function(array) {
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
    for (var i = 0; i < 10; i++) {
        var moiveid = array[i]
        var movieurl = "http://www.omdbapi.com/?i=" + moiveid + "&y=&plot=short&apikey="+omdb_key
        more = 10;
        $.ajax({
            url: movieurl,
            method: "GET"
        }).then(function(data) {
           var title = data.Title;
           var plot = data.Plot;
           var rating = data.Rated;
           var genre = data.Genre;
           var director = data.Director;         
           console.log(title)
           console.log(rating)
           console.log(plot)
           console.log(director)
           console.log(genre)
           console.log("-------------------")
        });
    }
}

var getMoreResults = function() {
    if (more <= recommendations.length-9) {
        var array = recommendations;
        for (var i = more; i < more+10; i++) {
            var moiveid = array[i]
            var movieurl = "http://www.omdbapi.com/?i=" + moiveid + "&y=&plot=short&apikey="+omdb_key
            
            $.ajax({
                url: movieurl,
                method: "GET"
            }).then(function(data) {
               var title = data.Title;
               var plot = data.Plot;
               var rating = data.Rated;
               var genre = data.Genre;
               var director = data.Director;         
               console.log(title)
               console.log(rating)
               console.log(plot)
               console.log(director)
               console.log(genre)
               console.log("-------------------")
            });
        }
        more += 10;    
    }
}



getRecommendations(favmovies)
