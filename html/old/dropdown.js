$(document).ready(function() {
	$(".js-data-example-ajax").select2({
	  ajax: {
		url: "https://api.themoviedb.org/3/search/movie?api_key=3634a680b1c4dff46bdba60a88625d55&language=en-US&include_adult=false",
		dataType: 'json',
		delay: 250,
		data: function (params) {
		  return {
			query: params.term, // search term
			page: params.page
		  };
		},
		processResults: function (data, params) {
		  // parse the results into the format expected by Select2
		  // since we are using custom formatting functions we do not need to
		  // alter the remote JSON data, except to indicate that infinite
		  // scrolling can be used
		  params.page = params.page || 1;

		  return {
			results: data.results,
			pagination: {
			  more: (params.page * 30) < data.total_count
			}
		  };
		},
		cache: true
	  },
	  dropdownParent: $('#results'),
	  placeholder: 'Search for a movie',
	  minimumInputLength: 1,
	  templateResult: formatMovie,
	  templateSelection: formatMovieSelection
	});
	
function formatMovie (movie) {
  if (movie.loading) {
    return movie.text;
  }

  var $container = $(
	"<div class='select2-result-movie clearfix'>" +
		"<div class='select2-result-movie__poster clearfix'><img src=" + "https://image.tmdb.org/t/p/w92" + movie.poster_path + "></div>" +
		"<div class='select2-result-movie__meta'>" +
			"<div class='select2-result-movie__titleanddate'></div>" +
			"<div class='select2-result-movie__description'></div>" +
		"</div>" +
	"</div>" +
	"<br>"
  );

  // $container.find(".select2-result-movie__titleanddate").append(movie.title + " (" + movie.release_date.slice(0,4) + ")");
  $container.find(".select2-result-movie__titleanddate").append(movie.title + " (" + movie.release_date + ")");
  $container.find(".select2-result-movie__description").append(movie.overview.slice(0,300) + "...");

  return $container;
}

function formatMovieSelection (movie) {
//  return (movie.title + " (" + movie.release_date.slice(0,4) + ")") || movie.text;
	return movie.title || movie.text;
}
});
