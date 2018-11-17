//movie by imdb ID: "https://api.themoviedb.org/3/find/IDHERE?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&external_source=imdb_id"
//movie query: "https://api.themoviedb.org/3/search/movie?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&query=seatchtexthere&page=1&include_adult=false"
//person movie credits: "https://api.themoviedb.org/3/person/{person_id}/movie_credits?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
//movie database link: https://developers.themoviedb.org/3/movies/get-movie-details

var favmovies = [];
var imdbIDs = ["tt0172495","tt0095016","tt1431045","tt0112573","tt0371746","tt4481414"];
var tmdbIDs = [];
var recomObj = {};
var ratedObj = {};
var recommendArray= [];
var recommendations = [];
var test = [];
var recoObj = {};

var getTMDBids = function(array) {
    var idArray = [];
    var promises = array.map( (id) => {
        return new Promise(function(res) {
            
            var IDurl = "https://api.themoviedb.org/3/find/" + String(id) + "?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&external_source=imdb_id"
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
        console.log(alldata)
        getRecom(alldata);
    })

}

var getRecom = function(array) {
    console.log(array)
    var promises = array.map( (id) => {
        return new Promise(function(res) {

            var recurl = "https://api.themoviedb.org/3/movie/" + String(id)  +"/recommendations?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US&page=1"
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
                console.log(recommends)


                res(recomObj)
                
            });


        })
    })

    Promise.all(promises).then(function(alldata) {
        console.log(alldata);
        console.log(recomObj)
    })

}

var sortObj = function(myobject) {
    objKeys = Object.keys(myobject);
    for (var i = 0; i < objKeys.length; i++) {
        for (var j = 0; j < myobject[objKeys[i]].length; j++) {
            var movie = myobject[objKeys[i]][j];
            
            if (ratedMovies.indexOf(movie) < 0) {
                var rating = getRated(myobject,movie);
                ratedMovies.append(movie);
                ratedObj[movie] = rating;
            }
        }
    }
}

var getIMDBids = function(array) {
    
    for (var id = 0; id < array.length; id++) {
        var idurl = "https://api.themoviedb.org/3/movie/" + array[id] + " ?api_key=c5e11b07aed33fed93509604abbe325f&language=en-US"
        var imdbID = "";
        var recommends = [];
        $.ajax({
            url: idurl,
            method: "GET"
        }).then(function(data) {
            imdbid = data.val().imdb_id;
            recommends.push(imdbid);
        });
    }
    return recommends;
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
        return a[1] - b[1];
    })

    for (var i = sortable.length-1; i>=0;i--){
        recommendation.push(sortable[i][0])
    }
    return sortable;
}


console.log(imdbIDs)
tmdbIDs = getTMDBids(imdbIDs);

//console.log(recomObj)
// sortObj(recomObj);
// console.log(ratedObj)
// recommendArray = sortRatings(ratedObj)
// console.log(recommendArray)
// recommendations = getIMDBids(recommendArray);
// console.log(recommendations);


