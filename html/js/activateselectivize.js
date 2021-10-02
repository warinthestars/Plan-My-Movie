(function dostuff() {
	var idforgetdetails;
	
	
	// <select id="select-movie"></select>
	$('#select-movie').selectize({
		valueField: 'id',
		labelField: 'title',
		searchField: 'title',
		options: [],
		create: false,
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<img src="' + escape("https://image.tmdb.org/t/p/w92" + item.poster_path) + '" alt="">' +
					'<span class="title">' +
						'<span class="name">' + escape(item.title + " " + "(" + item.release_date + ")") + '</span>' +
					'</span>' +
					'<span class="description">' + escape(item.overview || '<i>No synopsis available at this time.') + '</span>'
				'</div>';
			}
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: 'https://api.themoviedb.org/3/search/movie?api_key=3634a680b1c4dff46bdba60a88625d55&language=en-US&include_adult=false',
				type: 'GET',
				dataType: 'jsonp',
				data: {
					query: query,
					page_limit: 10,
				},
				error: function() {
					callback();
				},
				success: function(res) {
					console.log(res.results);
					callback(res.results);
				}
			});
		}
	});				
})();