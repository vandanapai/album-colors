$( window ).load(function() {

	$('form').submit(function (event) {
		event.preventDefault();
		var userQuery = $('.search-query').val();
		searchArtist(userQuery);
	});

	// User provides a search query, get the primary artist ID from Spotify search results

	function searchArtist(query) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/search",
			cache: false,
			data: {
				q: query,
				type: 'artist'
			},
			success: function(results) {
				albumImgUrlArray.length = 0; /* following variables are all reset to clear stored data from previous query */
				images.length = 0;
				numImgLoaded = 0;
				console.log(query);
				$('#mainContainer').html(""); /* reset entire page and clear divs */
				console.log(results);
				var artistID = results.artists.items[0].id;
				console.log(artistID);
				getArtistAlbums(artistID);
			}
		});
	};

	// Get artists albums data

	function getArtistAlbums(id) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/artists/" + id + "/albums?album_type=album&market=US",
			cache: false,
			dataType: "JSON",
			success: function (albums) {
				console.log(albums);
				getAlbumCovers(albums);
			}
		});
	};

	// From JSON, get each album's cover image

	var currentAlbum = new Object;
	var albumImgUrlArray = [];
	console.log(albumImgUrlArray);

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
			console.log("array length is" + albumImgUrlArray.length);
			loadAlbumImg(albumImgUrlArray);

	}


	// Prior to getting color, preload all album images

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
		console.log("num images loaded is " + numImgLoaded);
		if (numImgLoaded == albumImgUrlArray.length) {
			console.log("making the boxes now");
			colorizeContainer(images);
		}
	}

	// Once all images have been loaded, find the dominant color of the album cover image and add it as the background color of 
	// its own div and load the album cover image on top

	function colorizeContainer(data) {

		for (var k = 0; k < data.length; k++) {

			var imgObject = data[k];

			$('#mainContainer').append('<div id="colorContainer' + k + '"></div>'); // create a new square div for the color
			console.log("new color box");
			$('#colorContainer' + k).addClass('img-color').append('<div id="albumContainer' + k + '"></div>');

			var colorThief = new ColorThief();
			var domColor = colorThief.getColor(imgObject);

			$('#colorContainer' + k + '.img-color').css('background-color', 'rgb(' + domColor[0] + ',' + domColor[1] + ',' + domColor[2] + ')');  // display the dominant color
			$('#albumContainer' + k).addClass('album-img-wrapper').append('<img src="' + imgObject.src + '" data-album-num="' + imgObject.num + '" class="cover"></img>');

		};

		$('img').click(function() {
			var bgColor = $(this).parent().parent()[0].style.backgroundColor;
			$('#fullViewAlbumContainer').append(this);
			console.log(this.dataset.albumNum);
			getSongs(this.dataset.albumNum);
			$('#songContainer').css('background-color', bgColor).show();
		});

	};

	function getSongs(id) {
		$.ajax ({
			type: "GET",
			url: "https://api.spotify.com/v1/albums/" + id + "/tracks",
			dataType: "JSON",
			success: function (songs) {
				$('#songList').html("");
				var albumSongs = songs.items;
				displaySongs(albumSongs);
				
			}
		});
	}

	function displaySongs(albumSongs) {
		for (var m = 0; m < albumSongs.length; m++) {
			$('#songList').append('<li>' + albumSongs[m].name + '</li>');
		}
	}

});