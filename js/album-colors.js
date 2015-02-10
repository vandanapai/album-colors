$( window ).load(function() {

	var albumImgUrlArray = [];

	function searchArtist(query) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/search",
			data: {
				q: query,
				type: 'artist'
			},
			success: function(results) {
				console.log(results);
				var artistID = results.artists.items[0].id;
				console.log(artistID);
				getArtistAlbums(artistID);
			}
		});
	};

	function getArtistAlbums(id) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/artists/" + id + "/albums?album_type=album&market=US",
			dataType: "JSON",
			success: function (albums) {
				console.log(albums);
				getAlbumCovers(albums);
			}
		});
	};

	$('form').submit(function (event) {
		event.preventDefault();
		var userQuery = $('.search-query').val();
		searchArtist(userQuery);
	});

	var currentAlbum = new Object;

	function getAlbumCovers(data) {
			var numAlbums = (data.items.length);
			for (var i = 0; i < numAlbums; i++) {
				currentAlbum[i] = data.items[i];
				currentAlbum.cover = data.items[i].images[1].url;
				currentAlbum.name = data.items[i].name;
				currentAlbum.num = data.items[i].id;

				if ((currentAlbum.name).search("Deluxe") < 1) {
					albumImgUrlArray.push([currentAlbum.cover, currentAlbum.num]);
					previousAlbum = currentAlbum[i];
				}
			}

			loadAlbumImg(albumImgUrlArray);

	}


	var images = [];
	var numImgLoaded = 0;

	function loadAlbumImg(array) {

		for (var j = 0; j < array.length; j++) {
			var img = new Image;
			var src = array[j][0]; // insert image url here
			var num = "num";
			var albumId = array[j][1];

			img.crossOrigin = "Anonymous";
			img.num = albumId;

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

			$('#mainContainer').append('<div id="colorContainer' + k + '"></div>'); // create a new square div for the color
			$('#colorContainer' + k).addClass('img-color').append('<div id="albumContainer' + k + '"></div>');

			var colorThief = new ColorThief();
			var domColor = colorThief.getColor(imgObject);

			$('#colorContainer' + k + '.img-color').css('background-color', 'rgb(' + domColor[0] + ',' + domColor[1] + ',' + domColor[2] + ')');  // display the dominant color
			$('#songContainer').css('background-color', 'rgb(' + domColor[0] + ',' + domColor[1] + ',' + domColor[2] + ')'); // load dom color bg for modal
			$('#albumContainer' + k).addClass('album-img-wrapper').append('<img src="' + imgObject.src + '" title="' + imgObject.num + '" class="cover"></img>');

		};

		$('img').click(function() {
			console.log(this.title);
			getSongs(this.title);
		});

	};

	function getSongs(id) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/albums/" + id + "/tracks",
			dataType: "JSON",
			success: function (songs) {
				console.log(songs);
			}
		});
	}

});