$(function() {
	var $wrapper = $('#wrapper');
	// show current input values
	$('select.selectized,input.selectized', $wrapper).each(function() {
		var $idcontainer = $('<div>').addClass('value').html('Current Value: ');
		var $value = $('<span>').appendTo($idcontainer);
		var $input = $(this);
		var update = function(e) { $value.text(JSON.stringify($input.val())); }
		$(this).on('change', update);
		update();
		$(this).on('change', ajaxget);

		$idcontainer.insertAfter($input);
		
		var $idforgetdetails = $value.text(JSON.stringify($input.val()));
		function ajaxget(){
			var jsonresult = $.ajax({
								url: 'https://api.themoviedb.org/3/movie/' + $input.val() + '?api_key=3634a680b1c4dff46bdba60a88625d55&language=en-US',
								type: 'GET',
								dataType: 'jsonp',
								error: function() {
									console();
								},
								success: function(detailsresponse) {
									console.log(detailsresponse);
									document.getElementById("displayrt").innerHTML = 'Run-Time: ' + detailsresponse.runtime;
									console.log("rtset: " + detailsresponse.runtime);
								}
							});
		
		
		
		

		}
		
		
	});
});