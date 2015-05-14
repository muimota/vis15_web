
var pm;

$(document).ready(function(){
	$.get('protestas.json',init);
});

function init(data){
	
	pm = new ProtestModel(data);
	pm = pm.getTags(['Miguel Ángel Blanco Garrido']);

	$('#timeslider').slider({'min':0,'max':pm.timeline.length-1,'step':1});
	$('#timeslider').on('change',updateUI);
	
}

function updateUI(){
	
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
		for(var i=0;i<article.tags.length;i++){
			var tagName = pm.tags[article['tags'][i]];
			var spanTag = $('<span />').addClass('label').addClass(' label-info').html(tagName);
			manifestacion.find('.tags').append(spanTag);		
		}
		$('#manifestaciones').append(manifestacion);
	}		
}

