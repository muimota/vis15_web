
var am;
var articlesinrange;
$(document).ready(function(){
	$.get('protests.json',init);
});

function init(data){
	
	articlesmodel = new ArticlesModel(data);
	am = articlesmodel;

	$('#timerange').slider({'min':0,'max':am.timeline.length-1,'step':1,'value':[0,100]});
	$('#timerange').on('change',updateRange);
	$('#tagButton').click(updateTags);
	//$('#calculateButton').click(function())
	$('#tagsexplorer').click(tagsHandler);
	$('#calcButton').click(calculateTags);
	updateTags();
}


function updateRange(){

	var indexes  = $('#timerange').slider('getValue');
	var startDate = articlesmodel.timeline[indexes[0]];
	var endDate   = articlesmodel.timeline[indexes[1]];
	
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
	}else{
		return;
	}

	
	console.log(getActiveTags());
}

function calculateTags(){
	
	//get tags 
	var activeTags = getActiveTags();
	var articlesWithActiveTags = 0;
	var tagsArticles = [];

	for(var i=0;i<activeTags.length;i++){
		var tagId = activeTags[i];
		var tagArticles = articlesinrange.tagRels[tagId];
		for(var j=0;j<tagArticles.length;j++){
			if(tagsArticles.indexOf(tagArticles[j]) == -1){
				tagsArticles.push(tagArticles[j]);
			}
		}	
	}
	console.log(tagsArticles.length);
}

function updateTags(){

	var indexes  = $('#timerange').slider('getValue');
	var startDate = articlesmodel.timeline[indexes[0]];
	var endDate   = articlesmodel.timeline[indexes[1]];
	
	$('#datesrange').text(ArticlesModel.formatDate(startDate) + ' - ' + ArticlesModel.formatDate(endDate));
	
	articlesinrange = am.getArticlesInDateRange(startDate,endDate);
	var tagStats   = articlesinrange.getTagStats();
	var sortedTags = ArticlesModel.sortTagStats(tagStats);
	
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
		var tagText = am.tags[tagId]+':'+tagStats[tagId];
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
