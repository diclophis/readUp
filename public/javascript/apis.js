
Api = {}

Api.ReadUp = {
	results: [],
	
	search: function(term){
		Api.Twitter.search(term)
		Api.Reddit.search(term)
		Api.Flickr.search(term)
		Api.Storify.search(term)
	}
	
}

Api.ReadUp.Storage = {}
Api.ReadUp.Storage.Keywords = {

	save: function(value){
		var saved = false;
		current = Api.ReadUp.Storage.Keywords.load();
		if ($.inArray(value, current) == -1){
			current.push(value);
			saved = $.Storage.saveItem("keywords", current);
		}
		return saved;
	},
	
	load: function(){
		var data = $.Storage.loadItem("keywords");
		return data || []
	}
}

Api.ReadUp.Storage.Archive = {
	
	save: function(title, url){
		var saved = false;
		var value = [title, url];
		current = Api.ReadUp.Storage.Archive.load();
		if ($.inArray(value, current) == -1){
			current.push(value);
			saved = $.Storage.saveItem("archive", current);
		}
		return saved;
	},
	
	load: function(){
		var data = $.Storage.loadItem("archive");
		return data || []
	}
	
}

Api.Twitter = {
	results: [],
	
	response: function(data){
	    $.each(data.results, function(i,item){
	    	Api.Twitter.results.push({
				'icon': item.profile_image_url,
				'title': item.from_user + ' says',
				'text': item.text,
				'image': null,
				'url': item.source
			})
	    });
		return Api.Twitter.results;
	},
	
	search: function(term, total){
		$.getJSON("http://search.twitter.com/search.json?jsonp=?",
			{
				q: term,
				rpp: total || 50,
				result_type: 'mixed',
				callback: 'Api.Twitter.response'
			}
		);
	}
}

Api.Reddit = {
	results: [],
	
	search: function(term){
		$.getJSON("http://www.reddit.com/search.json?jsonp=?",
		{
			q: term,
			sort: 'top'
		},
		function(result){
			$.each(result.data.children, function(i, item) {
				Api.Reddit.results.push({
					'icon': null,
					'title': item.data.title,
					'text': item.data.selftext,
					'image': null,
					'url': item.data.url
				});
			});
		});
	}
}

Api.Flickr = {
	results: [],
	
	search: function(term){
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
		{
			tags: term,
			tagmode: 'any',
			format: 'json'
		},
		function(data) {
		  $.each(data.items, function(i,item){
		    Api.Flickr.results.push({
				'icon': null,
				'text': null,
				'title': item.title,
				'image': item.media.m,
				'url': item.link
			});
		  });
		});
	}
}

Api.Storify = {
	results: [],
	
	response: function(data) {
	  $.each(data.stories, function(i,item){
	    Api.Storify.results.push({
			'icon': item.thumbnail,
			'text': item.description,
			'title': item.title,
			'url': item.permalink
		});
	  });
	},
	
	search: function(term){
		$.getJSON("http://storify.com/topics/"+ term +".json?jsonp=?",{
			callback: 'Api.Storify.response'
		});
	}
}