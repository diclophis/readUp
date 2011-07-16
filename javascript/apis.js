
Api = {}

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
				rpp: total || 5,
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