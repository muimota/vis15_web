
function ProtestModel(data){
	
	this.articles = data['articles'];
	this.tags	  = data['tags']
	this.timeline = [];
	
	for(var date in this.articles) {
		this.timeline.push(date);
	}
	this.timeline.sort();

}

ProtestModel.prototype.getDate = function(date){

	return this.articles[date];
}


ProtestModel.prototype.getDateRange = function(startDate,endDate){
	
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

	return new ProtestModel({'articles':articles,'tags':this.tags});
}

ProtestModel.prototype.getTagId = function(tagIds){

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

	return new ProtestModel({'articles':articles,'tags':this.tags});
}

ProtestModel.prototype.getTags = function(tags){
	
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