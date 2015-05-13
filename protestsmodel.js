
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
	var tags = {};
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

ProtestModel.prototype.getTagId = function(tagId){

	var articles = {}
	var date,article;

	for(var i = 0 ; i < this.timeline.length ; i++ ){
		date = this.timeline[i];
		article = this.articles[date];
		if(article['tags'].indexOf(tagId)){
			articles[date]=article
		}
	}

	return new ProtestModel({'articles':articles,'tags':this.tags});
}

ProtestModel.prototype.getTag = function(tag){

	var tagId = self.tags.indexOf(tag);
	return this.getTagId(tagId);

}