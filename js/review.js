// javascript
$(document).ready(function() {
	Parse.initialize('jDhZ3P0KD6yXunZ1jnkMpt4854q8qXjR7RbgDSXe', 'GZpWOiz2sD1jEEwVbJqUf5i30GxTB6T4YWu5vzTe');
	var Review = Parse.Object.extend('Review');
	var totalRating = 0;
	var totalReview = 0;
	var averageStar = 0;

	$('#avgStar').raty();

	$('#reviewStar').raty({
		score: 0
	});

	//$('#customStar').raty();

	$('form').submit(function() {
		var review = new Review();

		var reviewStar = $('#reviewStar').raty('score');

		reviewStar = Number(reviewStar);
		review.set('reviewStar', reviewStar);

		totalRating += reviewStar;
		totalReview ++;
		averageStar = parseInt(totalRating/totalReview);
		$('#avgStar').raty({
			score: averageStar
		});

		console.log('total rating: ' + totalRating);
		console.log('total review: ' + totalReview);
		console.log('average star: ' + averageStar);
		console.log('review star: ' + reviewStar);

		$('#reviewStar').raty('set', {
			option: 0
		});

		$(this).find('input, textarea').each(function() {
			review.set($(this).attr('id'), $(this).val());
			$(this).val('');
		});

		review.save(null, {
			success:getData
		});
		return false;
	});

	var getData = function() {
		var query = new Parse.Query(Review);
		query.notEqualTo('reviewTitle', '');
		query.find({
			success:function(results) {
				buildList(results)
			}
		});
	};

	var buildList = function(data) {
		$('section').empty();
		data.forEach(function(d) {
			addItem(d);
		})
	}

	var addItem = function(item) {
		var reviewStar = item.get('reviewStar');
		var reviewTitle = item.get('reviewTitle');
		var reviewIdea = item.get('reviewIdea');

		var form = $('<form id="reviewForm"></form>');
		var row = $('<div id="bReview" class="row"></div>');
		var col = $('<div id="aReview" class="col-md-12"></div>');

		//form = $('<form id="reviewForm"></form>');
		$('#customReview').append(form);

		//$('#reviewForm').append(row);
		$('form').append(row);
		$('div:last').raty({
			score: reviewStar
		});

		row = $('<div id="bReview" class="row"></div>');
		//$('#reviewForm').append(row);
		$('form').append(row);
		$('div:last').text(reviewTitle);

		row = $('<div id="bReview" class="row"></div>');
		//$('#reviewForm').append(row);
		$('form').append(row);
		$('div:last').text(reviewIdea);

		//var li = $('<li>rating: '+ reviewStar +'<br>review title: ' + reviewTitle + '<br>review: ' + reviewIdea + '</li>');
		//var li = $(customStar + reviewTitle + reviewIdea);

		// var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
		// button.click(function() {
		// 	item.destroy({
		// 		success:getData
		// 	});
		// });

		//li.append(button);
		//$('ol').append(li);

	}
	getData()
});


