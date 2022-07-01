var currentMovieID;
var movieRunTime;
var	currentTime;
var movieEndTime;

class MovieDetails {
	constructor(a, b, c, d, e, f, g, h) {
		this.currentMovieID = a;
		this.movieTitle = b;
		this.movieRunTime = c;
		this.posterPath = d;
		this.backDropPath = e;
		this.releaseDate = f;
		this.synoposis = g;
		this.movieCast = h;
	}
}

var settings = {
    onDelete: function() {
		document.getElementById("display-poster").src = "./assets/images/noart250w.png";
		document.getElementById("display-poster").title = "No Movie Selected.";
		document.body.style.background = "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
		document.getElementById("selectedmoviecast").innerHTML = "";
		document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b><br><br> ';
		movieRunTime = null;
	},
    valueField: 'id',
	labelField: 'title',
	searchField: 'title',
	create: false,
	persist: false,
	maxItems: 1,
	load: function (query, callback) {
		if (!query.length) {
			return callback();
		} else {
			var url = 'https://api.planmymovie.com/3/search/movie/' + encodeURIComponent(query);
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url);
            xhttp.setRequestHeader({
                
            });
            xhttp.send();
/*			fetch(url, {
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
				.then(response => response.json())
				.then(json => {
					callback(json.items);
				}).catch(()=>{
					callback();
				});
		}
        */
        }
	},
	// custom rendering functions for options and items
	render: {
		option: 
			function(item) {
				return '' +
					'<div class="row border-bottom py-4 clearfix">' +
						'<div class="col-md-1">' +
							'<img class="img-fluid" id="selectedart" src="' + (!item.poster_path ? './assets/images/noart.png' : 'https://image.tmdb.org/t/p/w92' + item.poster_path) + '"/>' + 
						'</div>' + 
						'<div class="col-md-11">' +
							'<div class="mt-0 d-inline"><b>' + item.title + '</b>' +
								'<span class="small text-muted"> (' + item.release_date + ')</span>' +
							'</div>' +
							'<div class="mb-1">' + (!item.overview ? 'No synopsis available at this time.' : item.overview) + '</div>' +
						'</div>' +
					'</div>';
		},
		item: 
			function(item) {
				movieRunTime = item.runtime;
				currentMovieID = item.id;
				return '' +
				'<div class="row border-bottom py-2">' +
					'<div class="col-lg-4">' +
						'<div class="mt-0"><b>' + item.title + '</b>' +
							'<span class="small text-muted"> (' + item.release_date + ')</span>' +
						'</div>' +
						'<div class="mb-1">' + (!item.overview ? 'No synopsis available at this time.' : item.overview) + '</div>' +
					'</div>' +
				'</div>';
			}
	}
};
new TomSelect("#select-movie-test", settings);