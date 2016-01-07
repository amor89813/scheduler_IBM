(function () {
	window.blogItemViewTemplate = "\
		<h3><a href=\"<%= this.model.get('LinkURL') %>\"><%= this.model.get('Title') %></a></h3> \
		<div class='blogItemInfo'> \
		<a href=\"#\"><img src=<%= this.model.get('ImageURL') %> /></a> \
		<h5>By: <a href=\"<%= this.model.get('AuthorBlogURL') %>\"><%= this.model.get('AuthorName') %></a> (<a href=\"<%= this.model.get('AuthorTwitterLink') %>\"><%= this.model.get('AuthorTwitterName') %></a>)</h5> \
		<span><%= this.model.get('DateString') %></span> \
        <div class=\"blogShareBox\" data-text=\"<%= this.model.get('Title') %>\" data-href=\"<%= this.model.get('LinkURL') %>\"></div>\
		<div class='blogContent'><%= this.model.get('SummaryText') %> <p><a href=\"<%= this.model.get('LinkURL') %>\">Read More</a></p> </div> \
		</div>";
})();

BlogItem = Backbone.Model.extend({
	defaults: {
		LinkURL: null,
        Title: null,
        ImageURL: null,
        DateString: null,
        AuthorBlogURL: null,
        AuthorTwitterLink: null,
        AuthorTwitterName: null,
        SummaryText: null,
        Toolbox: null
	},

	initialize: function () {
		this.view = new BlogItemView({ model: this });
		this.set('Toolbox', $('#toolboxTemplate').html());
	}
});

BlogItemView = Backbone.View.extend({
	tagName: "div",
	className: "blogItem",

	render: function () {
		this.$el.html(this.template());
		return this;
	},

	template: _.template(window.blogItemViewTemplate)
});

BlogItemCollection = Backbone.Collection.extend({
	model: BlogItem,
	parsedJSON: null,
	currentStartIndex: 0,
	totalItems: 0,

	initialize: function () {
		this.on('add', this.didAddBlogItem, this);
		this.parsedJSON = JSON.parse($('#hfBlogItems').val() || "[]");
		$('#hfBlogItems').remove();
		this.view = new BlogItemCollectionView({ collection: this });
		this.getSubset(0);
	},

	didAddBlogItem: function () {
		if(this.models.length == 10) {
			this.view.render();
		}
	},

	getSubset: function (subsetNumber) {
		var listStart = subsetNumber * 10;
		var partialList = _(this.parsedJSON).rest(listStart);
		this.reset();
		this.add(_(partialList).first(10));		
	}

});

BlogItemCollectionView = Backbone.View.extend({
	$pager: null,

	options: {
		maxPages: 5
	},

	events: {
		"click .pagination a": "didClickPage"
	},

	didClickPage: function (e) {
		e.preventDefault();
		var pageNumber = parseInt($(e.currentTarget).attr('data-page'));
		// this.collection.getSubset(pageNumber);

		// this.$pager.find('a').not(e.currentTarget).removeClass('active');
		// $(e.currentTarget).addClass('active');

		// this.truncatePageList();
		this.goToPage(pageNumber);
	},

	goToPage: function (idx) {
		this.collection.getSubset(idx);

		this.$pager.find('a').removeClass('active');
		this.$pager.find('a').eq(idx).addClass('active');

		this.truncatePageList();
	},

	initialize: function () {
		this.setElement($('#blogContainer')[0]);
	},

	render: function () {
		var pager = this.$el.find('.pagination');
		this.$el.empty();
		this.$el.append(pager);

		_.each(this.collection.models, function (blogItem) {
			this.$el.append(blogItem.view.render().el);
		}, this);
		
		this.createPager();
		this.delegateEvents();

		this.$pager.find('a').eq(0).addClass('active');

		spDispatch.trigger('blog:didRenderList');
	},

	createPager: function () {
		if(this.$pager != null) {
			return;
		}

		this.$pager = $('<div class="pagination" />').prependTo(this.$el);

		_.each(this.getPages(), function (el, idx) {
			this.$pager.append(this.pagerItemTemplate({ idx: idx }));
		}, this);

		this.truncatePageList();
	},

	pagerItemTemplate: _.template('<a data-page=<%= idx %>><%= idx + 1 %></a>'),

	getPages: function () {
		var pages = [],
			idx = 0,
			pageSize = 10;

		do {
			pages.push($(this.collection.models).slice((idx * pageSize), ((idx * pageSize) + pageSize)));
			idx += 1;
		} while ((idx * pageSize) < this.collection.parsedJSON.length);

		return pages;
	},

	truncatePageList: function () {
        if(this.options.maxPages % 2 == 0)
            this.options.maxPages += 1;

        if(this.$lEllipsis) this.$lEllipsis.remove();
        if(this.$rEllipsis) this.$rEllipsis.remove();

        var $list = this.$pager.find('a'),
            activeIndex = this.$pager.find('a.active').index(),
            $innerList = $list.slice(1, ($list.length - 1)),
            bufferLeft = bufferRight = Math.floor(this.options.maxPages / 2),
            numToLeft = activeIndex;
            numToRight = $innerList.length - (activeIndex - 1),
            $first = $(_($list).first()),
            $last = $(_($list).last());

        $innerList.hide();

        if(bufferLeft > numToLeft) {
            var diff = bufferLeft - numToLeft;
            bufferLeft -= diff;
            bufferRight += diff;
        }
        else if (bufferRight > numToRight) {
            var diff = bufferRight - numToRight;
            bufferRight -= diff;
            bufferLeft += diff;
        }

        $innerList.slice((activeIndex - bufferLeft), (activeIndex + bufferRight)).show();

        if(bufferLeft < numToLeft) {
            this.$lEllipsis = $('<em>...</em>').insertAfter($first);
        }
        if(bufferRight < numToRight) {
            this.$rEllipsis = $('<em>...</em>').insertBefore($last);    
        }
        
    }
});

BlogSocialFrame = Backbone.View.extend({
    template: Handlebars.templates.socialLinks,

    initialize: function () {
        this.pathname = this.options.pathname;
        this.fullHref = location.protocol + "//" + location.host + this.pathname;
        this.testHref = "http://silverpop.adagetechnologies.com/" + this.pathname;

        var hrefAttr = this.$el.attr('data-href');
        if (hrefAttr) {
            this.fullHref = hrefAttr;
        }

        var tweetTitle = this.$el.attr('data-text');
        if (tweetTitle) {
            this.title = tweetTitle;
        }

        this.render();
    },

    render: function () {
        this.el.style.visibility = "hidden";

        this.el.innerHTML = this.template(this);

        _(function () {
            this.el.style.visibility = "visible";
        }).chain().bind(this).delay(2000);

    }

});

BlogPostView = SPView.extend({

    initialize: function () {
        this.socialFrames = [];

	    _($('.blogShareBox')).each(function (element) {
	        this.socialFrames.push(new BlogSocialFrame({ el: element, pathname: location.pathname }));
	    }, this);

    }

});

Blog = Backbone.View.extend({
    initialize: function () {
        this.blogs = new BlogItemCollection();
        this.postViews = [];

        spDispatch.on('blog:didRenderList', this.initPostViews, this);

        _(this.initPostViews).chain().bind(this).delay(100);
    },

    initPostViews: _(function () {
        _(this.$el.find('.blogItem:visible')).each(function (element) {
            var $element = $(element);
            if (!$element.hasClass('social-init')) {
                this.postViews.push(new BlogPostView({ el: element }));
                $element.addClass('social-init');
            }
        }, this);

        _(function () {
            if (typeof gapi != 'undefined') gapi.plusone.go();
            if (typeof twttr != 'undefined') twttr.widgets.load();
            if (typeof FB != 'undefined') FB.XFBML.parse();
            if (typeof IN != 'undefined') IN.parse();
        }).defer();

    }).debounce(100)
});

$(function () {
    silverpop.blog = new Blog({ el: document.body });
});