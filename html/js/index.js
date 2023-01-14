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
var currentMovieID;
var movieRunTime;
var currentTime;
var movieEndTime;

$(() => new TomSelect('#select-movie-test', {
	onInitialize: function () {
		initialLoadDetails();
	},
	onChange: eventHandleChange('onChange'),
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
	load: function (query, callback) {
		if (!query.length)
			return callback();
		$.ajax({
			url: 'https://api.planmymovie.com/3/search/movie/',
			type: 'GET',
			dataType: 'json',
			data: {
				query: query,
			},
			error: function (e) {
				callback(e);
			},
			success: function (res) {
				callback(res.results);
			}
		});
	},
	// custom rendering functions for options and items
	render: {
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
							'<div class="mb-1">' + 
								(!item.overview ? 'No synopsis available at this time.' : item.overview) + 
							'</div>' +
						'</div>' +
					'</div>';
			}
	}
}))

function eventHandleChange(name) {
	return function () {
		(JSON.stringify(arguments[0]));
		currentMovieID = arguments[0] ? arguments[0] : "";
		loadDetails(arguments[0] ? arguments[0] : "");
	};
}

$(() => {
	document.getElementById("timepickergo").value = getLocalTime();
})

$(() => {
	$('#timepickergo').datetimepicker({
		onSelect: eventTimeChange('onSelect'),
		controlType: 'select',
		timeFormat: "h:mm TT",
		timeInput: true,
		parse: "loose",
		alwaysSetTime: true
	});
})

function eventTimeChange() {
	return function () {
		calcTime(movieRunTime);
	};
}

function getLocalTime() {
	currentTime = new Date().toLocaleString();
	result = currentTime.replace(',', '');
	calcTime(movieRunTime);
	return result;
}

function calcTime(rt) {
	var timeValue = $('#timepickergo').datetimepicker('getDate');
	var calculatedtimeselector = document.getElementById("movieendtimeoutput");
	if (rt === void 0 && timeValue !== null) {
		null;
	} else if (rt !== void 0 && timeValue === null) {
		calculatedtimeselector.innerHTML = '<u>Select a time and try again!</u>';
	} else if (rt === void 0 && timeValue === null) {
		calculatedtimeselector.innerHTML = '<u>Select a movie and time and try again!</u>';
	} else if (rt === null && timeValue !== null) {
		calculatedtimeselector.innerHTML = '<u>Select a movie and try again!</u>';
	} else if (rt == 0 && timeValue !== null) {
		calculatedtimeselector.innerHTML = '<u>Run-time information missing from database.</u>'
	} else {
		calculatedtimeselector.innerHTML = addMinutes(timeValue, rt).toLocaleString();
	}
}

var timeConvert = (n) => {
	var minutes = n % 60;
	var hours = (n - minutes) / 60;
	var minutesPlurality;
	var hoursPlurality;
	minutes == 1 ? minutesPlurality = "minute" : minutesPlurality = "minutes";
	hours == 1 ? hoursPlurality = "hour" : hoursPlurality = "hours";
	return hours + " " + hoursPlurality + " and " + minutes + " " + minutesPlurality;
}

function addMinutes(date, minutes) {
	return movieEndTime = new Date(+date + minutes * 60000);
}

function setSystemtime() {
	document.getElementById("timepickergo").value = getLocalTime();
}

function copyToclip() {
	navigator.clipboard.writeText(window.location.hostname + "?id=" + currentMovieID);
}

async function initialLoadDetails() {
	const idParam = new URLSearchParams(window.location.search).get('id');
	if (idParam) {
		let detailsResponse = await getMovieDetails(idParam);
		let castResponse = await getMovieCast(idParam);
		const movie = new MovieDetails(
			detailsResponse.id,
			detailsResponse.title,
			detailsResponse.runtime,
			detailsResponse.poster_path,
			detailsResponse.backdrop_path,
			detailsResponse.release_date,
			detailsResponse.overview,
			castResponse
		);
		await preload(movie.posterPath, movie.backDropPath);
		currentMovieID = idParam;
		movieRunTime = detailsResponse.runtime;
		updatePage(movie);
		calcTime(movieRunTime);
		return movie;
	};
};

async function loadDetails(id) {
	const idParam = id;
	if (idParam) {
		let detailsResponse = await getMovieDetails(idParam);
		let castResponse = await getMovieCast(idParam);
		const movie = new MovieDetails(
			detailsResponse.id,
			detailsResponse.title,
			detailsResponse.runtime,
			detailsResponse.poster_path,
			detailsResponse.backdrop_path,
			detailsResponse.release_date,
			detailsResponse.overview,
			castResponse
		);
		await preload(movie.posterPath, movie.backDropPath);
		currentMovieID = idParam;
		movieRunTime = detailsResponse.runtime;
		await updatePage(movie);
		calcTime(movieRunTime);
	};
};

async function getMovieDetails(movieID) {
	const xhttpgetmovieurl = "https://api.planmymovie.com/3/movie/?id=" + movieID;
	let fetchmovieresponse = await fetch(xhttpgetmovieurl);
	let detailsResponse = await fetchmovieresponse.json();
	return detailsResponse;
}

async function getMovieCast(movieID) {
	const xhttpgetcreditsurl = "https://api.planmymovie.com/3/movie/credits/?id=" + movieID;
	let fetchmoviecast = await fetch(xhttpgetcreditsurl);
	let castResponse = await fetchmoviecast.json();
	try {
		castOutput = castResponse.cast[0].name + " as " + castResponse.cast[0].character + "<br>";

		for (var i = 1; i < 5 && i < castResponse.cast.length; i++) {
			castOutput = castOutput + castResponse.cast[i].name + (castResponse.cast[i].character != "" && castResponse.cast[i].character != null ? (" as " + castResponse.cast[i].character) : "") + "<br>";
		}
	} catch (e) {
		castOutput = "No Cast Information Available.";
	}
	return castOutput;
}

async function preload(a, b) {
	document.getElementById("posterpathpre").style.background = a ? "url('" + "https://image.tmdb.org/t/p/original" + a + "')" : "url('./assets/images/noart250w.png')";
	document.getElementById("bgpre").style.background = b ? "url('" + "https://image.tmdb.org/t/p/original" + b + "') no-repeat center center fixed" : "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
}

async function updatePage(movie) {
	document.getElementById("displaypostercontainer").style.background = movie.posterPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.posterPath + "')" : "url('./assets/images/noart250w.png')";
	document.getElementById("displaypostercontainer").title = movie.movieTitle ? movie.movieTitle + " (" + movie.releaseDate + ")" : "No Movie Selected";
	document.getElementById("displayrt").innerHTML = '<b>Movie Run-Time:</b> ' + timeConvert(movie.movieRunTime) + '<br><br>';
	document.getElementById("selectedmoviecast").innerHTML = movie.movieCast;
	document.body.style.background = movie.backDropPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.backDropPath + "') no-repeat center center fixed" : "url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
	document.body.style.backgroundSize = "cover";
	document.title = "Plan My Movie - " + movie.movieTitle;
}

$(window).load(function () {
    $(".trigger_popup").click(function(){
       $('.hover_bkgr').show();
    });
    $('.hover_bkgr').click(function(){
        $('.hover_bkgr').hide();
    });
    $('.popupCloseButton').click(function(){
        $('.hover_bkgr').hide();
    });
});
