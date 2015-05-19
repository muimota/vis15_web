var am;
var paper;

var elements = [];
$(document).ready(function(){
	$.get('protests4.json',init);
});

function init(data){
	
	am = new ArticlesModel(data);
	//pm = pm.getTags(['Corrupción']);

	$('#timeslider').slider({'min':0,'max':am.timeline.length-1,'step':1});
	$('#timeslider').on('change',sliderHandler);
	paper = Raphael('map',992,684)
	paper.image('images/map.png',0,0,992,684);
	sliderHandler();
}

function sliderHandler(){
	var index  = $('#timeslider').slider('getValue');
	

	var date = am.timeline[index];
	var articles = am.getArticlesInDate(date);
	var placesDict = {};
	var placeNames = [];
	for(var i=0;i<articles.length;i++){
		var article = articles[i];

		drawProtest(article);
		if('place' in article){
			var places = article['place'];
			var placesDict = {};
			for(var j=0;j<places.length;j++){
				var place = places[j];
				placesDict[place]=true;
			}
		}

	}
	for(var placeName in placesDict){
		placeNames.push(placeName);
	}
	$('#places').text(placeNames.join(','));
	$('#date').text(ArticlesModel.formatDate(date));
}

function drawProtest(article){

	var coords,element;
	var radius = 3;
	
	for(var i=0;i<elements.length;i++){
		elements[i].remove();
	}
	elements.splice(0,elements.length);

	if('things' in article){
		var things = article['things'];
		var thingIndex=99999;
		for(var thingId in things){
			index = validThings.indexOf(am.things[thingId]);
			if(index > -1 && index<thingIndex){
				thingIndex = index;
				radius = Math.max(3,Math.min(50,mapValue(things[thingId],0,10000,3,50)));
			}
		}
	}

	if('place' in article){
		var places = article['place'];
		var placesDict = {};
		var placeNames = [];
		for(var i=0;i<places.length;i++){
			var place = places[i];
			placesDict[place]=true;
			coords  = getCoordinates(place);
			element = paper.circle(coords[0],coords[1],radius).attr({fill: "#f00",opacity:0.7});
			elements.push(element);
		}
		for(var placeName in placesDict){
			placeNames.push(placeName);
		}
		$('#places').text(placeNames.join(','));
	}
	
}