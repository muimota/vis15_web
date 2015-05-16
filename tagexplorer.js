
var am;

$(document).ready(function(){
	$.get('protests.json',init);
});

function init(data){
	
	articlesmodel = new ArticlesModel(data);
	am = articlesmodel;
	//am = am.getTags(['Corrupción']);

	$('#timerange').slider({'min':0,'max':am.timeline.length-1,'step':1,'value':[0,100]});
	$('#timerange').on('change',updateRange);
	$('#tagButton').click(updateTags);

	$('#timeslider').slider({'min':0,'max':am.timeline.length-1,'step':1});
	$('#timeslider').on('change',updateArticles);
	
	updateTags();
}

function updateArticles(){
	
	var index  = $('#timeslider').slider('getValue');
	
	var date = am.timeline[index];
	var articles = am.articles[date];
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
			var tagName = am.tags[article['tags'][j]];
			var spanTag = $('<span />').addClass('label').addClass(' label-info').html(tagName);
			manifestacion.find('.tags').append(spanTag);		
		}
		manifestacion.find('.things').empty();
		if('things' in article){
		
			for(var thingId in article.things){
				
				var thingName = am.things[thingId];
				var spanTag = $('<span />').addClass('label').addClass('label-success').html(thingName+':'+article.things[thingId]);
				
				manifestacion.find('.tags').append(spanTag);	

			}

		}

		$('#manifestaciones').append(manifestacion);

	}		
}

function updateRange(){

	var indexes  = $('#timerange').slider('getValue');
	var startDate = articlesmodel.timeline[indexes[0]];
	var endDate   = articlesmodel.timeline[indexes[1]];
	
	$('#datesrange').text(ArticlesModel.formatDate(startDate) + ' - ' + ArticlesModel.formatDate(endDate));

}

function updateTags(){

	var indexes  = $('#timerange').slider('getValue');
	var startDate = articlesmodel.timeline[indexes[0]];
	var endDate   = articlesmodel.timeline[indexes[1]];
	
	$('#datesrange').text(ArticlesModel.formatDate(startDate) + ' - ' + ArticlesModel.formatDate(endDate));
	
	var articlesinrange = am.getArticlesInDateRange(startDate,endDate);
	var tagStats = articlesinrange.getTagStats();
	var sortedTags = ArticlesModel.sortTagStats(tagStats,200);

	var values = []
	for(var i=0;i<sortedTags.length;i++){
		var tagId = sortedTags[i]
		values.push(am.tags[tagId] +':'+tagStats[tagId]);
	}
	$('#tagsexplorer').text(values.join(', '));


	
}
