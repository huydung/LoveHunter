$(function(){

	//utility function
	function supports_html5_storage() {
	  try {
		return 'localStorage' in window && window['localStorage'] !== null;
	  } catch (e) {
		return false;
	  }
	}
	
  //Enhance the Number object with shortcut method to turn it into radian
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }
  
  var $mapcanvas = $('#map_canvas');
  var $status = $('#heart_status');
  var home = new google.maps.LatLng(21.023085, 105.834668);
  var isLocalStorageSupport = supports_html5_storage();
  var options = {
    zoom: 17,
    center: home,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  
  var img_heart = "heart_healed.png", img_broken_heart = "broken_heart.png",
    img_love_heart = "heart_love.png", img_fly_heart = "flying-heart-icon.png";
  var heart;
  var gmap;
  var points = [];
  var NEAR = 500;
  var VERY_NEAR = 150;
  var R = 6371000; // Radius of the earth in m
  var foundItems = [];
  
  /**
  * Utility function to calculate the distance (in meter) betwwen locations
  */
  var getDistance = function( pos1, pos2 ){    
    var dLat = (pos1.lat-pos2.lat).toRad();  // Javascript functions in radians
    var dLon = (pos1.lan-pos2.lan).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(pos1.lat.toRad()) * Math.cos(pos2.lat.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in meters
    return d;
  }
  
  /**
  * Return Object: {msg:'status message', pointIndex:'point object index or -1', found: true of false}
  */
  var getPointStatus = function( pos ){
    //console.log(points);
    var l = points.length;
    //console.log('getPointStatus, number of points: ' + l + ' pos: ' + pos.lat() + 'x' + pos.lng());
    for( var i = 0; i< l; i++ ){
      var p = points[i];
      //console.log('Checking point ' + p.name);
  	  if( p.alreadyFound != true ){
  		  var d = getDistance(
    			{lat:p.lat, lan:p.lan}, 
    			{lat:pos.lat(), lan:pos.lng()}
  		  );
        //console.log('Distance: ' + d);
  		  if( d <= VERY_NEAR ){
  			  return {msg:'You\'ve FOUND a new love treasure!!!', pointIndex:i, found: true};
  		  }else if( d <= NEAR ){
  			  return {msg:'Yeah yeah, you\'re near to something new...', pointIndex:i, found: false};
  		  }	  
  	  } 
    }
    return {msg:'Not close to anything new...', pointIndex:-1, found: false};
  };
  
  /**
  * Callback when user stop dragging the heart
  */
  var updateStatus = function(pointStatus){
    //console.log('drag end');
    if( !pointStatus ){
      var pointStatus = getPointStatus(heart.getPosition());
    }
    //Update status text
    $status.text( pointStatus.msg );
    //Change the heart icon if a point is found to be nearby
  	if( pointStatus.pointIndex > -1 ){
  	  heart.setIcon( img_heart );
  	  if( pointStatus.found ){
  		heart.setIcon( img_love_heart );
  		hasFoundItem( pointStatus.pointIndex );
  	  }
  	}else{
  		heart.setIcon( img_broken_heart );
  	}
  };

  
  /**
  * Update Treasure item when it's founded
  */
  var hasFoundItem = function( i ){
    if( $.inArray(i, foundItems) < 0){
      //console.log(i);
      var p = points[i];
      var html = p.name + ' ('+ p.address +')';
      $('#point-' + i).addClass('unlocked').removeClass('locked').html(html);
	  //Put new heart marker on the map
      var heart2 = new google.maps.Marker({
        position: new google.maps.LatLng(p.lat, p.lan),
        title: p.name,
        map: gmap,
        draggable: false,
        icon: img_fly_heart
      });
	  var infoWindow = new google.maps.InfoWindow({
      content: '<h3>' + p.name + '</h3>',
      position: new google.maps.LatLng(p.lat, p.lan),
      disableAutoPan: true
	  });
	  google.maps.event.addListener(heart2, 'click', function () {
      infoWindow.open(gmap, heart2);
	  });
      infoWindow.open(gmap, heart2);
	  
      foundItems.push(i);
	  points[i].alreadyFound = true;
		
		//Save to local Storage if needed
		if( isLocalStorageSupport ){
			localStorage['foundItems'] = foundItems.join(',');
			//console.log( localStorage['foundItems'] );
		}
    }    
    if( foundItems.length == points.length ){
      alert('Congratulations! You\'ve found ALL treasures!!! Let\'s enjoy the movie :)');
      window.location = "index.php?action=video";
    }
  }

  var initialize = function(){
    $.getJSON('index.php?action=data', function(data, status){
      points = data;
      //console.log(points);
      
      //Draw the map
      gmap = new google.maps.Map($mapcanvas.get(0), options);
      
      //Put the heart marker on the map
      heart = new google.maps.Marker({
        position: home,
        title: "Drag Me!!!",
        map: gmap,
        draggable: true,
        icon: img_broken_heart
      });
      
      //Draw some helper overlay for far far away positions
      for( var i = 0; i < points.length; i++){
        var p = points[i];
        if( p.help ){
          var overlay = new google.maps.Circle({
            strokeColor: "#60FF00",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "#60FF00",
            fillOpacity: 0.35,
            map: gmap,
            center: new google.maps.LatLng(p.lat, p.lan),
            radius: 1500
          });  
          //console.log(p);
        };
      };
      
      //listen to the event when user drag the heart      
      google.maps.event.addListener(gmap, "click",function(event){
		heart.setPosition(event.latLng);
	  });	

		$('.treasure').click(function(){
		//console.log('called');
			if( $(this).is('.unlocked') ){			
				var id = $(this).attr('id').substr(6);
				var ll = new google.maps.LatLng( points[id].lat, points[id].lan );
				gmap.setCenter( ll );
				return false;
			}
		});
		
		//Read the already found item from localStorage
		if( isLocalStorageSupport ){
			var alreadyFound = localStorage['foundItems'];
			if( alreadyFound ){
				var fItems = alreadyFound.split(',');								
				for( var i = 0; i < fItems.length; i++ ){
					fItems[i] = parseInt(fItems[i], 10);					
					hasFoundItem( fItems[i] );
				};
				
			};
		};
		setInterval(updateStatus, 200);
	});
    
  };
  
  initialize();
  
});