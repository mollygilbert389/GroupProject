//movie by imdb ID: "https://api.themoviedb.org/3/find/IDHERE?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&external_source=imdb_id"
//movie query: "https://api.themoviedb.org/3/search/movie?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&query=seatchtexthere&page=1&include_adult=false"
//person movie credits: "https://api.themoviedb.org/3/person/{person_id}/movie_credits?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
//movie database link: https://developers.themoviedb.org/3/movies/get-movie-details

var favmovies = [];
var imdbIDs = [];
var tmdbIDs = [];
var recomObj = {};
var recommendations = [];

var getTMDBids = function(array) {
    var idArray = [];
    for (var id = 0; i < array.length; i++)
    
        var IDurl = "https://api.themoviedb.org/3/find/" + id + "?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&external_source=imdb_id"
        var tmdbID = "";

        $.ajax({
            url: IDurl,
            method: "GET"
        }).then(function(data) {
            tmdbID = data.val().movieresults[0].id;
            idArray.append(tmdbID);
            return idArray;
        });
}

var getRecom = function(array) {
    var recoObj = {};
    for (var id = 0; i < array.length; i++) {
        var recurl = "https://api.themoviedb.org/3/movie/" + id +"/recommendations?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&page=1"
        var recommends = [];
        $.ajax({
            url: myurl,
            method: "GET"
        }).then(function(data) {
            for (var i = 0; i < data.val().results.length; i++) {
               var tempid = data.val().results[i].id
                recommends.append(tempid)
            }            
            recoObj[id] = recommends;
        });
    } 
    return recoObj;
}

var sortObj = function(myobject) {
    
}

var getIMDBids = function(array) {
    
    for (var id = 0; i < array.length; i++) {
        var idurl = "https://api.themoviedb.org/3/movie/" + id + " ?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
        var imdbID = "";
        var recommends = [];
        $.ajax({
            url: idurl,
            method: "GET"
        }).then(function(data) {
            imdbid = data.val().imdb_id;
            
        });
    }    
}

tmdbIDs = getTMDBids(imdbIDs);
recomObj = getRecom(tmdbIDs);
recommendations = sortObj(recomObj);
