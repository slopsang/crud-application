$(document).ready(function() {
	Parse.initialize('jDhZ3P0KD6yXunZ1jnkMpt4854q8qXjR7RbgDSXe', 'GZpWOiz2sD1jEEwVbJqUf5i30GxTB6T4YWu5vzTe');
	
	var Review = Parse.Object.extend('Review');
	var query;
	var review;

	$('#reviewStar').raty({
		score: 0
	});

	$('form').submit(function() {
		review = new Review();

		var userInputTitle = $('#reviewTitle');
		review.set("userTitle", userInputTitle.val());
		var userInputContent = $('#reviewContent');
		review.set("userContent", userInputContent.val());

		review.set("userRating", parseInt($("#reviewStar").raty("score")));
		review.set("likes", 0);
		review.set("dislikes", 0);

		review.save(null, {
			success: function() {
				userInputTitle.val(''); // reset input values
				userInputContent.val('');
				$('#reviewStar').raty({
					score: 0
				});
				getData();
			}
		});
		return false;
	});

	var getData = function() {
		query = new Parse.Query(Review);
		query.notEqualTo('reviewTitle', '');
		query.descending('createdAt');
		query.find({
			success:function(results) {
				buildList(results);
			}
		});
	}

	var buildList = function(data) {
		$('section').empty();
		var totalStar = 0;
		data.forEach(function(d) {
			totalStar += d.get('userRating');
			addItem(d);
		});
		$('#avgStar').raty({
			readOnly: true,
			score: totalStar/(data.length)
		});
	}

	var addItem = function(item) {
		// set values
		var userTitle = item.get('userTitle');
		var userContent = item.get('userContent');
		var userRating = item.get('userRating');
		var likes = item.get('likes');
		var dislikes = item.get('dislikes');
		// set elements
		var div = $('<div id="eachReview"></div>');
		var button = $('<button class="btn-default btn-xs voting"><span class="glyphicon glyphicon-remove"></span></button>');
		var dislike = $("<button class='btn-default btn-xs voting'><span class='fa fa-arrow-circle-down'></span></button>");
		var like = $("<button class='btn-default btn-xs voting'><span class='fa fa-arrow-circle-up'></span></button>");
		var stars = $("<h4>Rating: <span id='customRating'class='raty'></span></h4>");
		var title = $('<h2 id="customTitle"></h2>');
		var content = $('<h3></h3>');
		var loveOrhate = $('<p id="customVote"><b></b></p>');
  		button.click(function() {
		 	item.destroy({
		 		success: function() {
		 			getData();
		 		}
		 	});
	 	});
  		like.click(function() {
			query.get(item.id, {
				success: function(review) {
					review.increment('likes')
					review.save(null, {
						success: getData
					});
				}
			})
		});
		dislike.click(function() {
			query.get(item.id, {
				success: function(review) {
					review.increment('dislikes')
					review.save(null, {
						success: getData
					})
				}
			})
		})
		title.text(userTitle);
		content.text(userContent);

		title.append(button);
		title.append(dislike);
		title.append(like);
		div.append(title);
		div.append(stars);
		div.append(content);
		// make able to users to indicate whether a particular review was helpful or unhelpful
		if (likes == 0 && dislikes == 0) {
			loveOrhate.text("This review has not been voted. Was this helpful?");
		} else {
			loveOrhate.text(likes + " out of " + (likes + dislikes) + " people found this review helpful.");
		}

		div.append(loveOrhate);
		$('section').append(div);

		stars.raty({
			score: userRating, 
			readOnly: true
		});
	}
	getData();
});