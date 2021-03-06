
var am;
var articlesinrange;
$(document).ready(function(){
	$.get('protests4.json',init);
});

function init(data){
	
	am = new ArticlesModel(data,4);
	
	
	$('#timerange').slider({'min':0,'max':am.timeline.length-1,'step':1,'value':[0,100]});
	$('#timerange').on('change',updateTags);
	$('#tagButton').click(updateTags);
	//$('#calculateButton').click(function())
	$('#tagsexplorer').click(tagsHandler);
	$('#calcButton').click(calculateTags);
	updateTags();
}


function updateRange(){

	var indexes  = $('#timerange').slider('getValue');
	var startDate = am.timeline[indexes[0]];
	var endDate   = am.timeline[indexes[1]];
	
	$('#datesrange').text(ArticlesModel.formatDate(startDate) + ' - ' + ArticlesModel.formatDate(endDate));

}

function getActiveTags(){
	var activeSpans = $('#tagsexplorer').find('.label').not('.label-default');
	var activeTags = [];
	for(var i = 0;i<activeSpans.length;i++){
		var activeSpan = activeSpans[i];
		var tagId = $(activeSpan).attr('id').substring(3);
		activeTags.push(parseInt(tagId));
	}

	return activeTags;
}

function tagsHandler(e){
	if($(e.target).hasClass('label')){
		$(e.target).toggleClass('label-success').toggleClass('label-default');
		calculateTags();
	}else{
		return;
	}
}

function calculateTags(){
	
	//get tags 
	var activeTags = getActiveTags();
	var articlesWithActiveTags = 0;
	var tagsArticles = [];

	for(var i=0;i<activeTags.length;i++){
		var tagId = activeTags[i];
		var tagArticles = articlesinrange.tagMap[tagId];
		for(var j=0;j<tagArticles.length;j++){
			if(tagsArticles.indexOf(tagArticles[j]) == -1){
				tagsArticles.push(tagArticles[j]);
			}
		}	
	}//get tags 
	var activeTags = getActiveTags();
	$('#stats').text(''+articlesinrange.length+'/'+tagsArticles.length+'('+activeTags.join(',')+')');
	
}

function updateTags(){

	var indexes  = $('#timerange').slider('getValue');
	var startDate = am.timeline[indexes[0]];
	var endDate   = am.timeline[indexes[1]];
	
	$('#datesrange').text(ArticlesModel.formatDate(startDate) + ' - ' + ArticlesModel.formatDate(endDate));
	
	articlesinrange = am.getArticlesInDateRange(startDate,endDate);
	var tagStats   = articlesinrange.getTagStats();
	var sortedTags = ArticlesModel.sortTagStats(tagStats,180);
	
	//get tags 
	var activeTags = getActiveTags();

	var totalArticles = articlesinrange.length;
	var articlesWithActiveTags = articlesinrange.getArticlesWithTagIds(activeTags).length;

	console.log(totalArticles + " - " + articlesWithActiveTags);

	//merge activeTags and sortedTags
	for(var i=0;i<activeTags.length;i++){
		var tagId = activeTags[i]
		if(!(tagId in tagStats)){
			sortedTags.push(tagId);
			tagStats[tagId] = 0;
		}
	}

	$('#tagsexplorer').empty();
	for(var i=0;i<sortedTags.length;i++){
		var tagId = sortedTags[i]
		var tagText = am.tagNames[tagId]+':'+tagStats[tagId];
		var spanTag = $('<span />').addClass('label').addClass(' label-default').html(tagText);
		spanTag.attr('id','tag'+tagId);
		$('#tagsexplorer').append(spanTag);	
	}

	for(var i=0;i<activeTags.length;i++){
		var tagId = activeTags[i]
		var spanTag = $('#tag'+tagId);

		spanTag.toggleClass('label-default');

		if(tagStats[tagId]==0){
			spanTag.toggleClass('label-warning');
		}else{
			spanTag.toggleClass('label-success');
		}
	}

}
