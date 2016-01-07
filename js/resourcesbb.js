SPResource = Backbone.Model.extend({
    defaults: {
        thumbnailUrl: null,
        title: null,
        summaryText: null,
        publishDate: null,
        unixPublishDate: null,
        rating: null,
        pageId: null,
        pageGuid: null,
        pageLink: null,
        isWebinar: null,
        vimeoId: null,
        showRating: null,
        thumbnailUrl: null,
        filePath: null,
        isUpcoming: null
    }
});

SPResourceList = Backbone.Collection.extend({
    sortKey: "default",
    model: SPResource,

    comparator: function (resource) {

        if (this.sortKey.toLowerCase() == "recent")
            return -parseInt(resource.get('unixPublishDate'), 10);

        if (this.sortKey.toLowerCase() == "rated"
            || this.sortKey.toLowerCase() == "popular")
            return -(parseFloat(resource.get('rating')) * 10);

        if (this.sortKey.toLowerCase() == "upcoming")
            return -parseInt(resource.get('isUpcoming'), 10);

        if (this.sortKey.toLowerCase() == "archived")
            return parseInt(resource.get('isUpcoming'), 10);

        return -parseInt(resource.get('unixPublishDate'), 10);
    }
});

SPResourceListView = Backbone.View.extend({
    resourceList: new SPResourceList(),
    resourceViews: [],
    pager: null,

    initialize: function () {
        SPResourceView.prototype.listView = this;
        this.setElement($('.resources')[0]);
        var rawJson = this.$el.find('#hfListJson').val();
        this.resourceList.on('add', this.didAddResource, this);
        this.resourceList.on('sort', this.render, this);
        this.resourceList.add(JSON.parse(rawJson));
        this.resourceList.sort();
        return this;
    },

    events: {
        "change #ddlSort": "didChangeSelect"
    },

    didChangeSelect: function (evt) {
        this.resourceList.sortKey = $(evt.currentTarget).val();
        this.resourceList.sort();
        this.pager.initialize();
        this.resourceList.sort();
        return this;
    },

    didAddResource: function (resource) {
        var resourceView = new SPResourceView({ model: resource });
        resource.set('view', resourceView);
        this.resourceViews.push(resourceView);
        

        if (this.resourceViews.length == this.resourceList.length) {
            this.render();
        }

        return this;
    },

    render: function () {
        this.$el.find('.resourceList').html('');
        _(this.resourceList.models).each(function (resource) {
            if (resource.get('view')) {
                this.$el.find('.resourceList').append(resource.get('view').render().el);
                resource.get('view').delegateEvents(resource.get('view').events);
            }
        }, this);

        if (this.pager)
            this.pager.$pager.remove();
        this.pager = new SPPager({
            el: $('.resourceList')[0]
        });

        spDispatch = window.spDispatch || {};
        spDispatch.trigger('didRenderResources');

        applicationLoadHandler();

        return this;
    }
});

SPResourceView = Backbone.View.extend({
    tagName: "li",
    modal: null,
    vimeoModal: null,

    initialize: function () {
        var newVideo = new SPVimeoVideo({
            videoId: this.model.get('vimeoId'),
            player_url: 'http://player.vimeo.com/video/' + this.model.get('vimeoId')
        });

        this.vimeoModal = new SPVimeoModal({ model: newVideo });

        (function (self) {
            self.vimeoModal.$el.dialog({ modal: true, autoOpen: false, resizable: false, width: 730, beforeClose: function (event, ui) { self.didClose(); } });
        }(this));
    },

    isWebinarList: function () {
        return this.model.attributes.isWebinar;
    },

    render: function () {
        if (this.model.collection.models[0].attributes.isWebinar)
            this.$el.html(this.webinarTemplate(this.model));
        else
            this.$el.html(this.whitepaperTemplate(this.model));

        return this;
    },

    webinarTemplate: Handlebars.templates.webinarList,

    whitepaperTemplate: Handlebars.templates.whitepaperList
});