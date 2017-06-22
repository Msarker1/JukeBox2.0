function jukebox() {
	var counter=0;
	var results="";
	var songs=[    // array of song sources
	"http://dopefile.pk/mp3embed-7gw2lgxgohw5.mp3"
	];
  var artist=[  /// array of name of songs with artists
    "Lil Uzi Vert-XO TOUR Llif3"
  ];
  var img=[
    "icons/xotourlife.jpg"
  ]

	document.getElementsByClassName("b1")[0].addEventListener('click',function (){ // listens to play button

     	document.getElementById("player").play();
      document.getElementById("img1").src=img[counter];
      document.getElementsByClassName("b1")[0].src="icons/play-on.jpg";  
      document.getElementsByClassName("b2")[0].src="icons/pause-off.jpg";  
      document.getElementsByClassName("b3")[0].src="icons/stop-off.jpg";  
      document.getElementsByClassName("b4")[0].src="icons/skip-off.jpg";  
   	}  ); 
	

	document.getElementsByClassName("b2")[0].addEventListener('click',function (){ // listens to pause button
     	document.getElementById("player").pause();
      document.getElementsByClassName("b2")[0].src="icons/pause-on.jpg"; 
      document.getElementsByClassName("b1")[0].src="icons/play-off.jpg";  
      document.getElementsByClassName("b3")[0].src="icons/stop-off.jpg";  
      document.getElementsByClassName("b4")[0].src="icons/skip-off.jpg";   
   	}  ); 
	
	document.getElementsByClassName("b3")[0].addEventListener('click',function (){ // listens to stop button
     	var sound=document.getElementById("player");
     	sound.pause();
     	sound.currentTime=0;
      document.getElementsByClassName("b3")[0].src="icons/stop-on.jpg";  
      document.getElementsByClassName("b2")[0].src="icons/pause-off.jpg";
      document.getElementsByClassName("b1")[0].src="icons/play-off.jpg";
      document.getElementsByClassName("b4")[0].src="icons/skip-off.jpg";    
   	}  ); 
	
	document.getElementsByClassName("b4")[0].addEventListener('click',function (){ // listens to skip button
     		counter++;     // also loops thru array once last song is played
     		if(counter>=songs.length){
     			counter=0;
     		}
     		document.getElementById("player").src=songs[counter];    // changes src of player 
        document.getElementsByClassName("marke")[0].innerHTML=artist[counter];  // displays the artist and song from array
     		document.getElementById("player").play();
        document.getElementsByClassName("b2")[0].src="icons/pause-off.jpg";
        document.getElementsByClassName("b1")[0].src="icons/play-on.jpg";    
        document.getElementsByClassName("b3")[0].src="icons/stop-off.jpg";  
        document.getElementById("img1").src=img[counter];
   	}  ); 
 
  

	this.addsong=function(song,track_title,artist_name,track_img){ // adds songs to arrays of songs and artists 5
    var that = this;
     // counter++;
		song=("https://files.freemusicarchive.org/").concat(song); // concats the src with file name
		songs.push(song);
		var tracknartist=artist_name+"-"+track_title;
    artist.push(tracknartist); // pushes name of song with artist for the markee (now playing)
	  img.push(track_img);
    that.songlist(); //calls to add songs to playlist

  };

  this.songlist=function(){  //  list of songs to be displayed in the playlist 6
    var list=document.getElementById("listofsongs");
    list.innerHTML="";
    var that = this;
    var ol = document.getElementById("listofsongs");
    for(var i =0;i<artist.length;i++){  // iterating and creating list of songs 
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.className="bbb"+i;
      button.innerHTML="play";
      li.appendChild(document.createTextNode(artist[i]));
      ol.appendChild(li);
      ol.appendChild(button);
      that.playsongsfromlist(i); // passes the ith value to add onclick listeners
     }
   };

  this.playsongsfromlist=function(i){//plays song from the list of songs on the right 7
    document.getElementsByClassName("bbb"+i)[0].addEventListener('click',function (){
      counter=i;
      document.getElementById("player").src=songs[i]; // bc one song is already loaded
      document.getElementById("player").play();
      document.getElementsByClassName("marke")[0].innerHTML=artist[i];
      document.getElementById("img1").src=img[i];
      document.getElementsByClassName("b1")[0].src="icons/play-on.jpg";  
      document.getElementsByClassName("b2")[0].src="icons/pause-off.jpg";  
      document.getElementsByClassName("b3")[0].src="icons/stop-off.jpg";  
      document.getElementsByClassName("b4")[0].src="icons/skip-off.jpg"; 

      
       }  ); 
   }


	this.search=function(stuff){   // does ajax call and searches for user keyword and passes array of results to be displayed
		var that = this;
		var results = new Array();
		$.ajax({
    	type: "GET",
    	url: "https://freemusicarchive.org/api/trackSearch",
    	data: {
        	q: stuff, // <<< Search term goes in quotes here.
        	limit: 10
    	},
    	dataType: 'json',
    	success: function(response) {
        	results = response.aRows;
        	that.display(results); // calls to display the results 
        
        },
    	error: function(err) {
        	console.error( err );
    	}
		});
	}

	this.display=function(array){  // displays the search results  by creating a ol and setting up buttons to them 2
		var that = this;
		var ol = document.getElementById("matches");
 		for (var i = 0;i<array.length;i++){  // iterates and creates list of matched songs and adds buttons to them
   			var li = document.createElement("li");
   			var button = document.createElement("button");
   			button.className="bb"+i;
   			button.innerHTML="Add";
  			li.appendChild(document.createTextNode(array[i]));
  			ol.appendChild(li);
  			ol.appendChild(button);
        document.getElementsByClassName("list")[0].style.backgroundColor="lightblue";
  			that.setbuttonClicks(array[i],i);  // passes each song to be parsed for its id
		}
	}

	this.setbuttonClicks=function(x,i){  // sets up onclick listeners for each add button and parses the song title for track id 3
  		var that = this;
  		document.getElementsByClassName("bb"+i)[0].addEventListener('click',function (){
     	var y = x.match(/\d+/)[0];
	  	that.addtrack(y); // calls addtrack to and passes the track id 
   		}  ); 
	}

	this.addtrack=function(x){ //ajax call for specific song,takes the track id passed and searches for the song to add to playlist 4
		var that = this;
		$.ajax({
    	type: "GET",
    	url: "https://freemusicarchive.org/api/get/tracks.json",
    	data: {
      	  api_key: "MP1QWI8JOBHCO0HU",
        	track_id: x // the id of your targeted track
    	},
    	dataType: "json",
    	success: function(response) {
      var track_name,artist_name,track_img;
			alert("Added " + response.dataset[0].track_title);
    		results=response.dataset[0].track_file;   // getting track title, file for src and artist name
        track_title=response.dataset[0].track_title;
        artist_name=response.dataset[0].artist_name;
        track_img=response.dataset[0].track_image_file;
    		that.addsong(results, track_title,artist_name,track_img); //calls add song to add to array of songs
        
    	},
    	error: function(err) {
     	   console.error(err);
   		}
		});
	}

	this.removeList=function(){  // removes the search results so it doesnt increment
	var ol = document.getElementById("matches");
	ol.innerHTML="";
  }

}
function myf1(){    // to display the first song thats preloaded
  document.getElementById("img1").src="icons/xotourlife.jpg";
  document.getElementById("player").play();
  document.getElementsByClassName("b1")[0].src="icons/play-on.jpg";  
  document.getElementsByClassName("b2")[0].src="icons/pause-off.jpg";  
  document.getElementsByClassName("b3")[0].src="icons/stop-off.jpg";  
  document.getElementsByClassName("b4")[0].src="icons/skip-off.jpg"; 
}	
var s = new jukebox();  // new jukebox class
document.getElementsByClassName("bsearch")[0].addEventListener('click',function (){ // takes input from the user and calls search method
		s.removeList();
     	s.search(document.getElementsByClassName("search")[0].value);
}  ); 