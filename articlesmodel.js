
function ArticlesModel(data){
	
	this.articles = [];
	this.tags	  = data['tags'];
	this.tagRels = {}
	this.things	  = data['things'];

	this.datedArticles = data['articles'];
	this.timeline = [];

	this.length   = 0;

	for(var date in this.datedArticles) {
		this.timeline.push(date);
	}
	this.timeline.sort();

	for(var i = 0 ; i < this.timeline.length ; i++ ){
		var date = this.timeline[i];
		for(var j = 0; j < this.datedArticles[date].length ; j ++){	
			var article = this.datedArticles[date][j];
			this.articles.push(article);
		}
	}

	for(var i=0;i<this.articles.length;i++){
		var article = this.articles[i];
		for(var j=0;j<article.tags.length;j++){
			var tagId  = article.tags[j];
			if(tagId in this.tagRels){
				if(this.tagRels[tagId].indexOf(article)==-1){
					this.tagRels[tagId].push(article);
				}
			}else{
				this.tagRels[tagId] = [article];
			}
		}
	}


	

}

ArticlesModel.formatDate = function(date){
	var year  = date.substring(0,4);
	var month = date.substring(4,6);
	var day   = date.substring(6,8);
	return day + '/'+month+'/'+year;

}


ArticlesModel.sortTagStats = function(tagStats,maxcount){
	
	var tagIds = [],tagId;
	var tagCounts = []

	for(tagId in tagStats){
		tagCount = tagStats[tagId];
		tagCounts.push(tagCount);
	}
	
	if(maxcount==undefined){
		maxcount = tagCounts.length;
	}

	//http://www.w3schools.com/jsref/jsref_sort.asp
	tagCounts = tagCounts.sort(function(a, b){return b-a});
	
	for(var i=0;i<maxcount && i<tagCounts.length;i++){
		
		for(tagId in tagStats){
			if(tagStats[tagId] == tagCounts[i] && tagIds.indexOf(tagId) == -1){
				tagIds.push(tagId);
				break;
			}
		}
	}

	return tagIds;
}


ArticlesModel.prototype.getArticlesInDate = function(date){

	return this.datedArticles[date];
}


ArticlesModel.prototype.getArticlesInDateRange = function(startDate,endDate){
	
	var articles = {};
	var date;

	for(var i = 0 ; i < this.timeline.length ; i++ ){
		
		date = this.timeline[i];

		if(date >= startDate){
			
			if(date > endDate){
				break;
			}
		
			articles[date] = this.datedArticles[date];
			
		}

	}

	return new ArticlesModel({'articles':articles,'tags':this.tags,'things':this.things});
}

ArticlesModel.prototype.getArticlesWithTagIds = function(tagIds){

	var articles = {}
	var date,article,tagId;
	
	for(var i = 0 ; i < this.timeline.length ; i++ ){
		
		date = this.timeline[i];
		
		for(var j = 0; j < this.datedArticles[date].length ; j ++){
			
			article = this.datedArticles[date][j];
			
			for(var k = 0 ; k < tagIds.length ; k++ ){
				
				tagId = tagIds[k];

				if(article['tags'].indexOf(tagId) != -1){
					
						if(articles[date] == undefined){
							articles[date] = [article];
						}else{
							articles[date].push(article);
						}
						break;
					
				}
			}
		}
	}

	return new ArticlesModel({'articles':articles,'tags':this.tags});
}

ArticlesModel.prototype.getArticlesWithTags = function(tags){
	
	var tagIds=[];
	var tagId;

	for(var i = 0 ; i < tags.length ; i++ ){
		tagId = this.tags.indexOf(tags[i]);
		if(tagId != -1){
			tagIds.push(tagId);
		}
	}
	return this.getArticlesWithTagIds(tagIds);

}

//return tags count of tags present in the model {tagId0:tagCount0,...,tagIdn:tagCountn }

ArticlesModel.prototype.getTagStats = function(){
	
	var date;
	var article,articleTags;
	var tagStats = {};
	
	for(var tagId in this.tagRels){
		tagStats[tagId]=this.tagRels[tagId].length;
	}

	return tagStats;
}