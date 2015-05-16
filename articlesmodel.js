
function ArticlesModel(data){
	
	this.articles = data['articles'];
	this.tags	  = data['tags'];
	this.things	  = data['things'];
	this.timeline = [];
	
	for(var date in this.articles) {
		this.timeline.push(date);
	}
	this.timeline.sort();

}
ArticlesModel.formatDate = function(date){
	var year  = date.substring(0,4);
	var month = date.substring(4,6);
	var day   = date.substring(6,8);
	return day + '/'+month+'/'+year;

}


ArticlesModel.prototype.getArticlesInDate = function(date){

	return this.articles[date];
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
		
			articles[date] = this.articles[date];
			
		}

	}

	return new ArticlesModel({'articles':articles,'tags':this.tags,'things':this.things});
}

ArticlesModel.prototype.getArticlesWithTagId = function(tagIds){

	var articles = {}
	var date,article,tagId;
	var articleTagCount; //number of tags article has from tagIds array
	for(var i = 0 ; i < this.timeline.length ; i++ ){
		
		date = this.timeline[i];
		
		for(var j=0;j < this.articles[date].length ; j ++){
			
			article = this.articles[date][j];
			articleTagCount = 0;
			for(var k = 0 ; k < tagIds.length ; k++ ){
				
				tagId = tagIds[k];

				if(article['tags'].indexOf(tagId) != -1){
					articleTagCount ++ ;
					if(articleTagCount == tagIds.length){
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
	
	return this.getTagId(tagIds);

}

//return tags pressent in the model

ArticlesModel.prototype.getTagIds = function(){
	
	var date;
	var article,articleTags;
	var tagIds = [];
	
	for(var i = 0 ; i < this.timeline.length ; i++ ){
		
		date = this.timeline[i];
		
		for(var j=0;j < this.articles[date].length ; j ++){
			
			article = this.articles[date][j];
			articleTags = article.tags;
			for(var k=0; k<articleTags.length; k++ ){
				tagId = articleTags[k];
				if( tagIds.indexOf(tagId) == -1 ){
					tagIds.push(tagId);
				}
			}
		}
	}

	return tagIds;
}