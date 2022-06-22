var currentTime;
var movieEndTime;
var movieRunTime;
var currentMovieID = 683970; // hehe

$(function () {
	checkForURLParams();
})

$(function () {
	document.getElementById("timepickergo").value = getLocalTime();
})

$(function () {
	$('#select-movie').selectize({
		valueField: 'id',
		labelField: 'title',
		searchField: 'title',
		options: [],
		create: false,
		render: {
			option: function (item) {

				var movieArt;

				!item.poster_path ? movieArt = "assets/images/noart.png":movieArt = "https://image.tmdb.org/t/p/w92" + item.poster_path;

				return '<div>' +
					'<img src="' + movieArt + '" alt="">' +
					'<span class="title">' +
					'<span class="name">' + item.title + " " + "(" + item.release_date + ")" + '</span>' +
					'</span>' +
					'<span class="description">' + (!item.overview ? 'No synopsis available at this time.':item.overview) + '</span>' +
				'</div>';
			}
		},
		load: function (query, callback) {
			if (!query.length) return callback();
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
	})
})

$(function () {

	var $wrapper = document.getElementById('#wrapper');
	// show current input values
	$('select.selectized,input.selectized', $wrapper).each(function () {
		var $idcontainer = $('<div style="display:none">').addClass('value').html('Current Value: '); // TO-DO: Remove this line without breaking everything
		var $value = $('<span>').appendTo($idcontainer);
		var $input = $(this);
		var update = function (e) { $value.text(JSON.stringify($input.val())); }
		$(this).on('change', update);
		update();
		$(this).on('change', getMovieDetails);

		$idcontainer.insertAfter($input);

		$value.text(JSON.stringify($input.val()));

		// TO-DO: Merge internal "getMovieDetails" and global "getMovieDetails" into one function
 		function getMovieDetails() {
				$.ajax({
					url: 'https://api.planmymovie.com/3/movie/?id=' + $input.val(),
					type: 'GET',
					dataType: 'json',
					success: function (detailsResponse) {
							const movieDetails = {
								currentMovieID: detailsResponse.id,
								movieTitle: detailsResponse.title,
								movieRunTime: detailsResponse.runtime,
								posterPath: !detailsResponse.poster_path ? "./assets/images/noart250w.png":"https://image.tmdb.org/t/p/w500" + detailsResponse.poster_path,
								backDropPath: !detailsResponse.backdrop_path ? "assets/images/hometheatrebg.jpg":"https://image.tmdb.org/t/p/original" + detailsResponse.backdrop_path,
								releaseDate: detailsResponse.release_date,
								synoposis: detailsResponse.overview
							};
							document.getElementById("selectedmoviename").innerHTML = movieDetails.movieTitle;
							document.getElementById("selectedmovieposterimg").src = movieDetails.posterPath;
							document.getElementById("selectedmoviedate").innerHTML = movieDetails.releaseDate;
							document.getElementById("selectedmoviesynopsis").innerHTML = movieDetails.synoposis;
							document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movieDetails.movieRunTime) + '<br><br>';
							document.body.style.background = "url(" + movieDetails.backDropPath + ") no-repeat center fixed";
						}
				});
				$.ajax({
					url: 'https://api.planmymovie.com/3/movie/credits/?id=' + $input.val(),
					type: 'GET',
					dataType: 'json',
					success: function (castResponse) {

						let castOutput;

						try {
							castOutput = castResponse.cast[0].name + (castResponse.cast[0].character != "" ? " as " + castResponse.cast[0].character:"") + "<br>";

							for (var i = 1; i < 5 && i < castResponse.cast.length; i++) {
								castOutput = castOutput + castResponse.cast[i].name + (castResponse.cast[i].character != "" ? " as " + castResponse.cast[i].character:"") + "<br>";
							}

						} catch (e) {
							castOutput = "No Cast Information Available.";
						}

						document.getElementById("selectedmoviecast").innerHTML = castOutput;

					}
				});
		} 
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

	let timeValue = $('#timepickergo').datetimepicker('getDate');

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
	movieEndTime = new Date(+date + minutes * 60000);
	return movieEndTime;
}

function setSystemtime() {
	document.getElementById("timepickergo").value = getLocalTime();
}

function copyToclip() {
	navigator.clipboard.writeText("https://dev.planmymovie.com/?id=" + currentMovieID);
}

function checkForURLParams() {
	var urlForIdParam = window.location.search;
	var urlParams = new URLSearchParams(urlForIdParam);
	var idParam = urlParams.get('id');
	if (idParam && !idParam === null) { 
		getMovieDetailsOnLoad(idParam) 
	};
}

function getMovieDetailsOnLoad(id) {
	if (id && !id === null) {
		$.ajax({
			url: 'https://api.planmymovie.com/3/movie/?id=' + id,
			type: 'GET',
			dataType: 'json',
			success: function (detailsResponse) {
				const movieDetails = {
					currentMovieID: detailsResponse.id,
					movieTitle: detailsResponse.title,
					movieRunTime: detailsResponse.runtime,
					posterPath: !detailsResponse.poster_path ? "assets/images/noart250w.png":"https://image.tmdb.org/t/p/w500" + detailsResponse.poster_path,
					backDropPath: !detailsResponseResponse.backdrop_path ? "assets/images/hometheatrebg.jpg":"https://image.tmdb.org/t/p/original" + detailsResponse.backdrop_path,
					releaseDate: detailsResponse.release_date,
					synoposis: detailsResponse.overview
				};
				document.getElementById("selectedmoviename").innerHTML = movieDetails.movieTitle;
				document.getElementById("selectedmovieposterimg").src = movieDetails.posterPath;
				document.getElementById("selectedmoviedate").innerHTML = movieDetails.releaseDate;
				document.getElementById("selectedmoviesynopsis").innerHTML = movieDetails.synoposis;
				document.getElementById("displayrt").innerHTML = 'Movie Run-Time: ' + timeConvert(movieDetails.movieRunTime) + '<br><br>';

				document.body.style.background = "url('" + movieDetails.backDropPath + "') no-repeat center fixed";
				document.body.style.backgroundSize = "contain";
			}
		});
		$.ajax({
			url: 'https://api.planmymovie.com/3/movie/credits/?id=' + id,
			type: 'GET',
			dataType: 'json',
			success: function (castResponse) {

				var castOutput;

				try {
					castOutput = castResponse.cast[0].name + " as " + castResponse.cast[0].character + "<br>";

					for (var i = 1; i < 5 && i < castResponse.cast.length; i++) {
						castOutput = castOutput + castResponse.cast[i].name + (castResponse.cast[i].character != "" && castResponse.cast[i].character != null ? (" as " + castResponse.cast[i].character):"") + "<br>";
					}

				} catch (e) {
					var castOutput = "No Cast Information Available.";
				}

				document.getElementById("selectedmoviecast").innerHTML = castOutput;
			}
		})
	}
};