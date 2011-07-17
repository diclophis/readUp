
Api = {}

Api.ReadUp = {
	results: [],
  cursor: 0,
  count: 0,
  lastWasReady: false,
  term: "",
  page: 1,
  onNextReadyCallback: function() {},
  sources: [],

  init: function(t, c, onrc) {
    this.term = t;
    this.count = c;
    this.onNextReadyCallback = onrc;
    this.search();
  },

	search: function() {
    Api.Twitter.search(this.term, this.page);
    Api.Reddit.search(this.term, this.page);
    Api.Flickr.search(this.term, this.page);
    Api.Storify.search(this.term, this.page);
    return true;
	},

  fill: function(item) {
    this.results.push(item);
    this.sources.push(item.source);
    this.sources = $.unique(this.sources);
    has_enough_interesting_items = (this.results.length > (this.cursor + this.count)) && (this.sources.length >= 3);
    if (has_enough_interesting_items && !this.lastWasReady) {
      this.lastWasReady = true;
      this.onNextReadyCallback();
    }
  },

  previous: function() {
    if (this.lastWasReady) {
      this.cursor -= (this.count);
      if (this.cursor < 0) {
        this.cursor = 0;
      }
      console.log("prev slicing: ", this.cursor, this.count, this.results.length);
      sliced = this.results.slice(this.cursor, this.cursor + this.count)
      return sliced;
    }
  },

  next: function() {
    if (this.lastWasReady) {

      if (this.cursor == 0) {
        begin_of_seen = 0;
        begin_of_unseen = 0;
        end_of_unseen = (this.results.length);
      } else {
        begin_of_seen = (0);
        begin_of_unseen = (this.cursor + this.count);
        end_of_unseen = (this.results.length);
      }

      seen = this.results.slice(begin_of_seen, begin_of_unseen);
      unseen = this.results.slice(begin_of_unseen, end_of_unseen);
      $.shuffle(unseen);
      this.results = seen.concat(unseen);

      console.log("next slicing: ", this.cursor, this.count, this.results.length);
      sliced = this.results.slice(this.cursor, this.cursor + this.count)
      if (sliced.length == this.count) {
        this.cursor += sliced.length;
        return sliced;
      } else {
        this.lastWasReady = false;
        this.page += 1;
        if (this.page < 4) {
          console.log("nothing to pop, maybe search for page=2???");
          this.search();
        } else {
          console.log("at last page");
        }
      }
    }
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
	response: function(data){
	    $.each(data.results, function(i,item){
	    	Api.ReadUp.fill({
				'icon': item.profile_image_url,
				'title': item.from_user + ' says',
				'text': item.text,
				'image': null,
				'url': item.source,
				'source': 'Twitter'
			})
	    });
		return Api.Twitter.results;
	},
	
	search: function(term, p, total){
		$.getJSON("http://search.twitter.com/search.json?jsonp=?",
			{
				q: term,
        		page: p,
				rpp: total || 50,
				result_type: 'mixed',
				callback: 'Api.Twitter.response'
			}
		);
	}
}

Api.Reddit = {
	search: function(term, p) {
		$.getJSON("http://www.reddit.com/search.json?jsonp=?",
		{
			q: term,
			sort: 'top'
		},
		function(result){
			$.each(result.data.children, function(i, item) {
				Api.ReadUp.fill({
					'icon': null,
					'title': item.data.title,
					'text': item.data.selftext,
					'image': null,
					'url': item.data.url,
					'source': 'Reddit'
				});
			});
		});
	}
}

Api.Flickr = {
	search: function(term, p) {
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
		{
			tags: term,
			tagmode: 'any',
			format: 'json'
		},
		function(data) {
		  $.each(data.items, function(i,item){
		    Api.ReadUp.fill({
				'icon': null,
				'text': null,
				'title': item.title,
				'image': item.media.m,
				'url': item.link,
				'source': 'Flickr'
			});
		  });
		});
	}
}

Api.Storify = {
	response: function(data) {
	  $.each(data.stories, function(i,item){
	    Api.ReadUp.fill({
			'icon': item.thumbnail,
			'text': item.description,
			'title': item.title,
			'url': item.permalink,
			'source': 'Storify'
		});
	  });
	},
	
	search: function(term, p) {
		$.getJSON("http://storify.com/topics/"+ term +".json?jsonp=?", {
			page: p,
			callback: 'Api.Storify.response'
		});
	}
}
