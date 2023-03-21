const idParam = new URLSearchParams(window.location.search).get('id');

var settings = {
    onInitialize: handleIdFromURL('onInitialize'),
	onChange: handleUpdatedQuery('onChange'),
	onDelete: function () {
		document.getElementById("displaypostercontainer").style.background = "url('./assets/images/noart250w.png')";
		document.getElementById("displaypostercontainer").title = "No Movie Selected";
		document.body.style.background = "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
		document.getElementById("selectedmoviecast").innerHTML = "";
		document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b><br><br> ';
		movieRunTime = null;
		document.title = "Plan My Movie";
	},
	valueField: 'id',
	labelField: 'title',
	searchField: 'title',
	create: false,
	persist: false,
	maxItems: 1,
	preload: true,
    items: [idParam],
	load: function (query, callback) {
		if (!query.length) {
			return callback();
        }
    var url = 'https://api.planmymovie.com/3/search/movie/?query=' + encodeURIComponent(query);
    fetch(url)
        .then(response => response.json())
        .then(json => {
            callback(json.results);
        }).catch(()=>{
            callback();
        })
    },
	render: {	// custom rendering functions for options and items
		option:
			function (item) {
				movieRunTime = item.runtime;
				currentMovieID = item.id;
				posterPathPre = item.poster_path;
				return '' +
					'<div class="row border-bottom py-2">' +
						'<div class="col-lg-4" id="col-lg-4-selected">' +
							'<img class="img-fluid" id="selectorart" src="' + (!item.poster_path ? './assets/images/noartsmol.png' : 'https://image.tmdb.org/t/p/w92' + item.poster_path) + '"/>' +
							'<div id="selecteddetails">' +
								'<div class="mt-0">' +
									'<b>' + item.title + '</b>' +
									'<span class="small text-muted"> (' + item.release_date + ')</span>' +
								'</div>' +
							'</div>' +
							'<div class="mb-1">' + 
								(!item.overview ? 'No synopsis available at this time.' : item.overview) + 
							'</div>' +
						'</div>' +
					'</div>';
			},
		item:
			function (item) {
				movieRunTime = item.runtime;
				currentMovieID = item.id;
				return '' +
					'<div class="row border-bottom py-2">' +
						'<div class="col-lg-4" id="col-lg-4-selected">' +
							'<div class="mt-0">' + 
								'<b>' + item.title + '</b>' +
								'<span class="small text-muted"> (' + item.release_date + ')</span>' +
							'</div>' +
						'</div>' +
					'</div>';
			}
	}
};
var control = new TomSelect("#select-movie-test", settings);

function handleUpdatedQuery(name) {
	return function () {
		(JSON.stringify(arguments[0]));
		currentMovieID = arguments[0] ? arguments[0] : "";
		loadDetails(arguments[0] ? arguments[0] : "");
	};
}

function handleIdFromURL(name) {
    if (idParam) {
        return function () {
            currentMovieID = idParam;
            loadDetails(idParam);
        }
    }
}