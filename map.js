var am;
var paper;

var categoryTags = 
		{
			'Empleo':[1640,11,90,1853,510,1996,1291,255,1923,149,164,347,2211,268,2219,870],
			'Salud':[ 2051,911,1749,125,1803,2151,12,1167,1616],
		 	'Educación':[ 234,1513,551,547,1363,346,2254,2087,1960,1501,571,1892,2408,1907],
		 	'Vivienda':[ 392,943,333,1689,391,991,1297],
		 	'Seguridad y Justicia':[ 207,2299,1138,158,759,2099,147,915,2467,2302,120,517,1117],
		 	'Medio ambiente':[ 1754,966,213,138,209,359,1126]
		};
var categoryColors = 
	{
		'Empleo':Raphael.color('#ff0000'),
		'Salud':Raphael.color('#ffff00'),
	 	'Educación':Raphael.color('#ff00f0'),
	 	'Vivienda':Raphael.color('#f0f0f0'),
	 	'Seguridad y Justicia':Raphael.color('#ff5500'),
	 	'Medio ambiente':Raphael.color('#ff0055')
	};
var defaultColor = Raphael.color('#ffffff');

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
	var indexRadius = 50;
	var startIndex	= Math.max(index-indexRadius,0);
	var endIndex	= Math.min(index+indexRadius,am.timeline.length);
	
	var placesDict = {};
	var placeNames = [];

	for(var i=0;i<elements.length;i++){
		elements[i].remove();
	}
	elements.splice(0,elements.length);


	for(var k=startIndex;k<endIndex;k++){
		
		var date = am.timeline[k];
		var articles = am.getArticlesInDate(date);

		for(var i=0;i<articles.length;i++){
			var article = articles[i];
			drawProtest(article);
			if('place' in article){
				var places = article['place'];
				for(var j=0;j<places.length;j++){
					var place = places[j];
					placesDict[place]=true;
				}
			}

		}
	}

	for(var placeName in placesDict){
		placeNames.push(placeName);
	}

	//$('#places').text(placeNames.join(','));
	$('#date').text(ArticlesModel.formatDate(am.timeline[startIndex]) + ' - ' + 
				    ArticlesModel.formatDate(am.timeline[endIndex]));
}

function drawProtest(article){

	var coords,element;
	var radius = 3;
	var color = undefined;
	var tagIds = article['tags'];

	for(var i=0;i<tagIds.length;i++){
		var tagId = tagIds[i];
		for(var category in categoryTags){
			if(categoryTags[category].indexOf(tagId) != -1){
				color = categoryColors[category];
				break;
			}
		}
		if(color != undefined){
			break;
		}
	}
	if(color == undefined){
		color = defaultColor;
	}
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
			element = paper.circle(coords[0],coords[1],radius).attr({fill: color,opacity:0.7});
			element.data('id',article['id']);
			elements.push(element);
		}
		for(var placeName in placesDict){
			placeNames.push(placeName);
		}
	}
	
}