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
var	currentTime;
var movieEndTime;

$(() => {
	document.getElementById("timepickergo").value = getLocalTime();
})

$(() => {
	$('#select-movie').selectize({
		valueField: 'id',
		labelField: 'title',
		searchField: 'title',
		options: [],
		create: false,
		render: {
			option: function (item) {

				const selectionObject = {
					movieArt: !item.poster_path ? "assets/images/noart.png" : "https://image.tmdb.org/t/p/w92" + item.poster_path,
					movieTitle: item.title,
					movieReleaseDate: item.release_date,
					movieSynopsis: !item.overview ? 'No synopsis available at this time.' : item.overview
				};

				return '<div>' +
					'<img src="' + selectionObject.movieArt + '" alt="">' +
					'<span class="title">' +
					'<span class="name">' + selectionObject.movieTitle + " " + "(" + selectionObject.movieReleaseDate + ")" + '</span>' +
					'</span>' +
					'<span class="description">' + selectionObject.movieSynopsis + '</span>' +
					'</div>';
			}
		},
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
		}
	});
})

$(function () {

	var $wrapper = document.getElementById('#wrapper');
	// show current input values
	$('select.selectized,input.selectized', $wrapper).each(function () {
		console.log("Selectize Initialized")
		var $idcontainer = $('<div style="display:none">').addClass('value').html('Current Value: '); // TO-DO: Remove this line without breaking everything
		var $value = $('<span>').appendTo($idcontainer);
		var $input = $(this);
		var update = function () { 
			$value.text(JSON.stringify($input.val())); 
			blah($input.val());
			currentMovieID = $input.val();
		}
		$(this).on('change', update);
		update();

		$idcontainer.insertAfter($input);

		$value.text(JSON.stringify($input.val()));
	});
});

$(function () {
	$('#timepickergo').datetimepicker({
		controlType: 'select',
		timeFormat: "h:mm TT",
		timeInput: true,
		parse: "loose",
		alwaysSetTime: true
	})
})

function getLocalTime() {
	currentTime = new Date().toLocaleString();
	result = currentTime.replace(',', '');
	return result;
}

function calcTime() {

	var timeValue = $('#timepickergo').datetimepicker('getDate');

	if (movieRunTime === void 0 && timeValue !== null) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and try again!' + '<br><br>';
	} else if (timeValue === null && movieRunTime !== void 0) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a time and try again!' + '<br><br>';
	} else if (movieRunTime === void 0 && timeValue === null) {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + 'Select a movie and time and try again!' + '<br><br>';
	} else {
		document.getElementById("custcalctime").innerHTML = 'Calculated Movie End Time: ' + addMinutes(timeValue, movieRunTime).toLocaleString() + '<br><br>';
	}
}

var timeConvert = function (n) {
	var minutes = n % 60;
	var hours = (n - minutes) / 60;
	var minutesPlurality;
	var hoursPlurality;

	minutes == 1 ? minutesPlurality = "minute":minutesPlurality = "minutes";
	hours == 1 ? hoursPlurality = "hour":hoursPlurality = "hours";

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

async function blah (id) {
	const idParam = id ? id:new URLSearchParams(window.location.search).get('id');
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

		movieRunTime = detailsResponse.runtime;
		updatePage(movie);
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
				castOutput = castOutput + castResponse.cast[i].name + (castResponse.cast[i].character != "" && castResponse.cast[i].character != null ? (" as " + castResponse.cast[i].character):"") + "<br>";
			}

		} catch (e) {
			castOutput = "No Cast Information Available.";
		}

	return castOutput;

}

function updatePage(movie) {
	document.getElementById("selectedmoviename").innerHTML = movie.movieTitle;
	document.getElementById("selectedmovieposterimg").src = movie.posterPath ? "https://image.tmdb.org/t/p/original" + movie.posterPath:"./assets/images/noart250w.png";
	document.getElementById("selectedmoviedate").innerHTML = movie.releaseDate;
	document.getElementById("selectedmoviesynopsis").innerHTML = movie.synoposis ? movie.synoposis:"No synopsis available at this time.";
	document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movie.movieRunTime) + '<br><br>';
	document.getElementById("selectedmoviecast").innerHTML = movie.movieCast;
	document.body.style.background = movie.backDropPath ? "url('" + "https://image.tmdb.org/t/p/original" + movie.backDropPath + "') no-repeat center center fixed":"url('./assets/images/hometheatrebg.jpg') no-repeat center center fixed";
	document.body.style.backgroundSize = "cover";
}