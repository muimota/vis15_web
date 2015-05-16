
var pm;

$(document).ready(function(){
	$.get('protests.json',init);
});

function init(data){
	
	protestmodel = new ProtestModel(data);
	pm = protestmodel;
	//pm = pm.getTags(['Corrupción']);

	$('#timerange').slider({'min':0,'max':pm.timeline.length-1,'step':1,'value':[0,100]});
	$('#timerange').on('change',updateTags);

	$('#timeslider').slider({'min':0,'max':pm.timeline.length-1,'step':1});
	$('#timeslider').on('change',updateArticles);
	
	updateTags();
}

function updateArticles(){
	
	var index  = $('#timeslider').slider('getValue');
	
	var date = pm.timeline[index];
	var articles = pm.articles[date];
	var manifestaciones = $('.manifestacion');

	var manidiv = manifestaciones.first().clone();

	$('#manifestaciones').empty();

	var year  = date.substring(0,4);
	var month = date.substring(4,6);
	var day   = date.substring(6,8); 

	$('#date').text(day+'/'+month+'/'+year);

	for(var i=0;i<articles.length;i++){
	
		var article = articles[i];
		var manifestacion = manidiv.clone();
		
		manifestacion.find('.title>a').text(article['title']).attr("href", article['url']);
		manifestacion.find('.summary').text(article['subtitles'][0] || "");
		manifestacion.find('.place').text(article['place']);
		
		manifestacion.find('.tags').empty();
		for(var j=0;j<article.tags.length;j++){
			var tagName = pm.tags[article['tags'][j]];
			var spanTag = $('<span />').addClass('label').addClass(' label-info').html(tagName);
			manifestacion.find('.tags').append(spanTag);		
		}
		manifestacion.find('.things').empty();
		if('things' in article){
		
			for(var thingId in article.things){
				
				var thingName = pm.things[thingId];
				var spanTag = $('<span />').addClass('label').addClass('label-success').html(thingName+':'+article.things[thingId]);
				
				manifestacion.find('.tags').append(spanTag);	

			}

		}

		$('#manifestaciones').append(manifestacion);

	}		
}

function updateTags(){

	var indexes  = $('#timerange').slider('getValue');
	console.log(indexes);
	var startDate = protestmodel.timeline[indexes[0]];
	var endDate   = protestmodel.timeline[indexes[1]];
	
	$('#datesrange').text(ProtestModel.formatDate(startDate) + ' - ' + ProtestModel.formatDate(endDate));
}
