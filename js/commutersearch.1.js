
var map, oResponse;

function searchSD(event){
    var sourceV = document.getElementById('fromSource').value;
    var destV = document.getElementById('toDestination').value;
    var ste =`<span class="helper-text" id="sourceError" data-error="invalid source">Source is incorrect</span>`;
    var dte =`<span class="helper-text" id="destError" data-error="invalid destination">Destination is incorrect</span>`;
    var searchRoute = "";
    if(event.keyCode === 13){
        if(sourceV === "" && destV === ""){
            if(document.getElementById('sourceError') &&  document.getElementById('destError')){
                return;
            }else  {
                document.getElementById('fromSource').insertAdjacentHTML('afterend',ste);
                document.getElementById('toDestination').insertAdjacentHTML('afterend',dte)
            }    
        }else {
            searchRoute = sourceV + " to " + destV;
            var searchResults = oResponse.filter(function(o){ //filter the search results
                return (o.route === searchRoute)
            })
            CarOwner('owners-list', searchResults); //rerender the car owner list
        }
    }  
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/carownerLocation.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function initialize(locations) {
    map = new google.maps.Map(
    document.getElementById("carOwnerLocationMap"), {
        center: new google.maps.LatLng(12.9715987, 77.59456269999998),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow
    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            title:locations[i][0],
            icon: 'http://maps.google.com/mapfiles/ms/icons/cabs.png'
		});

		google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
			return function () {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}
		})(marker, i));
    }
}

function CarOwner (ownerContainerId, ownerList){
    this.templateString =``;
    this.ownersListElem = document.getElementById(ownerContainerId);
    this.createCarOwnerContainer = function(cObj){
        return `<div class="col s6 ">
                <div class="row carowner-container">
                    <div class="col s2">
                        <a href="#" class="mdi mdi-account-circle mdi-48px"></a>
                    </div>         
                    <div class="col s10">
                        <h6>${cObj.name} <span class="right">${cObj.rating}</span></h6> 
                        <p>route:<strong>${cObj.route}</strong></p>
                        <p><span>car:<strong>${cObj.car}</strong></span>  <span>seats available: </span></p>
                    </div>
                </div>    
            </div>`
    }
    ownerList.forEach(function(i){
        this.templateString = this.templateString + this.createCarOwnerContainer(i)
    });
    this.templateString =`<div class="row">`+  this.templateString+`</div>`
    this.ownersListElem.innerHTML = this.templateString;

    
}



function successCallbackCabOwners(response){
    response = JSON.parse(response);
    oResponse = response;
    modifiedResponse = response.map(function(obj){
        return Object.keys(obj).map(function(key){
            return obj[key];
        })
    }) 
    initialize(modifiedResponse);
    //create dom structure
    CarOwner('owners-list', oResponse);
  
}

window.addEventListener('load',function(){
    loadJSON(successCallbackCabOwners)
    
},false)