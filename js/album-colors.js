$( window ).load(function() {

	var albumImgUrlArray = [];

	function searchAlbums(query) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/search",
			data: {
				q: query,
				type: 'album'
			},
			success: function(albums) {
				getAlbumCovers(albums);
			}
		});
	};

	$('form').submit(function (event) {
		event.preventDefault();
		var userQuery = $('.search-query').val();
		searchAlbums(userQuery);
	});


	function getAlbumCovers(data) {
			for (var i = 0; i < 15; i++) {
				currentAlbum = data.albums.items[i].images[1].url;

				if (i > 0) {
					if (previousAlbum == currentAlbum) {
					}
					else {
						albumImgUrlArray.push(currentAlbum)
						previousAlbum = currentAlbum;
					}
				}
				else {
					albumImgUrlArray.push(currentAlbum);
					previousAlbum = currentAlbum;
				}
			}
			
			loadAlbumImg(albumImgUrlArray);

	}


	var images = [];
	var numImgLoaded = 0;

	function loadAlbumImg(array) {

		for (var j = 0; j < array.length; j++) {
			var img = new Image;
			var src = array[j]; // insert image url here

			img.crossOrigin = "Anonymous";

			img.onload = function() {
				counter();
			}
			img.src = src;

			images.push(img);
		}


	}

	function counter() {
		numImgLoaded++;
		if (numImgLoaded == albumImgUrlArray.length) {
			colorizeContainer(images);
		}
	}


	function colorizeContainer(data) {

		for (var k = 0; k < data.length; k++) {

			var imgObject = data[k];


			$('#mainContainer').append('<div id="colorContainer' + k + '">TESTING' + k + '</div>'); // create a new square div for the color

			$('#colorContainer' + k).addClass('img-color').append('<div id="albumContainer' + k + '"></div>');


			var colorThief = new ColorThief();
			var domColor = colorThief.getColor(imgObject);

			$('#colorContainer' + k + '.img-color').css('background-color', 'rgb(' + domColor[0] + ',' + domColor[1] + ',' + domColor[2] + ')');  // display the dominant color

			$('.songContainer').css('background-color', 'rgb(' + domColor[0] + ',' + domColor[1] + ',' + domColor[2] + ')'); // load dom color bg for modal

			$('#albumContainer' + k).addClass('album-img-wrapper').append('<img src="' + imgObject.src + '"></img>');
			// $('.loaded-img').prepend(imgObject);

		};

		$('.img-color').click(function() {
			displaySongs();
			// $('.img-container').fadeIn(200);
		});

		// $('.close-button').click(function() {
		// 	$('.img-container').fadeOut(200);
		// });		


	};

	function displaySongs() {

	}

});