/// <reference path="sidebarpanels.js" />
/// <reference path="dev/_references.js" />

spDispatch = _.clone(Backbone.Events);

SPView = Backbone.View.extend({
    __bbType: "SPView"
});

SPBoundView = Backbone.View.extend({
    render: function () {
        _(this.model.toJSON()).each(function (value, key) {
            _(this.$el.find('[data-bind="' + key + '"]')).each(function (element, index) {
                element.innerHTML = value;
            }, this);
            _(this.$el.find('[data-src="' + key + '"]')).each(function (element, index) {
                $(element).attr('src', value);
            }, this);
        }, this);
        return this;
    }
});

SPHistoryModal = Backbone.View.extend({
    initialize: function () {
        this.setElement($('#historyModal')[0]);
        this.$el.dialog({ modal: true, autoOpen: false, resizable: false, width: 730 });
    },

    events: {
        "click [name$='btnEnroll']": "didClickEnroll"
    },

    didClickEnroll: function (evt) {
        this.$el.find('.loading').show();
        var selected = this.$el.find('[name$="ddlProgram"]').val();

        $.ajax({
            type: 'post',
            url: '/services/DownloadService.asmx/AddToProgram',
            data: JSON.stringify({ programID: selected }),
            contentType: 'application/json',
            success: _(this.showSuccess).bind(this)
        });

        evt.preventDefault();
    },

    showSuccess: function () {
        this.$el.find('.loading').hide();
        var programName = this.$el.find('[name$="ddlProgram"] option:selected').text();
        this.$el.find('#programName').text(programName);
        this.$el.find('.addProgramSuccess').show();
    },

    show: function () {
        this.$el.dialog('open');
    },

    hide: function () {
        this.$el.dialog('close');
    }
});

SPSidebar = Backbone.View.extend({
    animates: true,
    hideAnimation: { "margin-right": "-226px", "right": "0" },
    showAnimation: { "margin-right": "-720px", "right": "50%" },
    closeAnimation: { "margin-right": "-226px", "right": "0" },
    openAnimation: { "margin-right": "0", "right": "0" },
    animationDuration: 500,
    easing: 'easeInOutCubic',
    historyModal: null,

    $handle: $('#sidebarHandle'),

    initialize: function () {
        this.setElement(document.getElementById('sidebar'));
        this.checkContext();
        this.model.on('change', this.attributesChanged, this);
        this.historyModal = new SPHistoryModal();
        this.initPanelWrapper();
        $(window).resize(_(this.checkContext).bind(this));
        $(window).scroll(_(this.checkContext).bind(this));
        return this;
    },

    events: {
        "click .sidebarHandleActive": "open",
        "click .sidebarHandleOpen": "close",
        "click .launchHistory": "didClickHistory"
    },

    initPanelWrapper: function () {
        this.panelWrapper = new SPSidebarPanelWrapper({ el: document.getElementById('sidebarPanels'), model: this.model });
        this.panelWrapper.on('refresh', this.checkContext, this);
        return this;
    },

    didClickHistory: function (e) {
        e.preventDefault();


        _(function () {
            this.historyModal.$el.dialog('open');
        }).chain().bind(this).defer().value();
        

        spDispatch.trigger('modalOpened', this.historyModal);
    },

    jqAnimate: function (cssObject) {
        if (this.animates)
            this.$el.stop().animate(cssObject, this.animationDuration, this.easing);
        return this;
    },

    hide: function () {
        this.jqAnimate(this.hideAnimation);
        this.$handle.addClass('sidebarHandleActive');
        this.$handle.removeClass('sidebarHandleOpen');
        return this;
    },

    show: function () {
        this.jqAnimate(this.showAnimation);
        this.$handle.removeClass('sidebarHandleActive sidebarHandleOpen');
        return this;
    },

    open: function () {
        this.jqAnimate(this.openAnimation);
        this.$el.addClass('sidebarOpen');
        this.$handle.addClass('sidebarHandleOpen');
        return this;
    },

    close: function () {
        this.jqAnimate(this.closeAnimation);
        this.$el.removeClass('sidebarOpen');
        this.$handle.removeClass('sidebarHandleOpen');
        return this;
    },

    checkContext: function () {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var sidebarHeight = this.$el.height();
        var sidebarWidth = this.$el.width();
        this.widthResponder(windowWidth < (960 + (sidebarWidth * 2)));
        this.heightResponder(windowHeight < sidebarHeight)
        return this;
    },

    widthResponder: function (isLowWidth) {
        if (isLowWidth) {
            this.$el.addClass("lowWidth");
            if(!this.$handle.hasClass('sidebarHandleOpen'))
                this.hide();
        }
        else {
            this.$el.removeClass("lowWidth");
            this.show();
        }
        return this;
    },

    heightResponder: function (isLowHeight) {
        if (isLowHeight)
            this.$el.addClass("lowHeight");
        else
            this.$el.removeClass("lowHeight");
        return this;
    },

    attributesChanged: function () {
        return this;
    },

    clearSidebar: function () {
        this.model.set(this.model.clearDefaults());
        console.log("Sidebar: sidebar cleared!");
        return this;
    }

});

SPVimeoFigure = SPBoundView.extend({
    vimeoModal: null,

    initialize: function () {
        this.vimeoModal = new SPVimeoModal({ model: this.model });

        (function (self) {
            self.model.modal.$el.dialog({ modal: true, autoOpen: false, resizable: false, width: 730, beforeClose: function (event, ui) { self.didClose(); } });
            self.vimeoModal.$el.dialog({ modal: true, autoOpen: false, resizable: false, width: 730, beforeClose: function (event, ui) { self.didClose(); } });
        }(this));
        this.model.on('change', this.render, this);

        return this;
    },

    //events: {
    //    "click": "didClick",
    //},

    showVimeo: function () {
        //this.vimeoModal.$el.dialog('open');
        this.vimeoModal.show();
    },

    didClick: function (evt) {
        //this.vimeoModal.$el.dialog('open');
        this.vimeoModal.show();
        evt.preventDefault();
        return this;
    },

    didClose: function () {
        this.model.modal.setSource();
        return this;
    }
});

SPVimeoModal = Backbone.View.extend({
    template: Handlebars.templates.watchVimeo,

    initialize: function () {
        this.model.on('change', this.render, this);
        this.render();
        return this;
    },

    setSource: function () {
        var player_url = this.$el.find('iframe').attr('src');
        this.$el.find('iframe').attr('src', player_url);
    },

    onPlay: function () {
        var videoId = this.model.get('videoId'),
            eventType = this.model.get('playEventType'),
            title = this.model.get('title');

        if (!title) {
            var titleAttr = this.model.figure.el.attributes['data-title'];
            if (titleAttr)
                title = titleAttr.value;
        }

        spEngageTracking.trackCustom(eventType, title);
    },

    render: function () {
        this.el.innerHTML = this.template({ vimeoId: this.model.get('videoId') });
        this.setSource();

        return this;
    },
    
    show: function () {
        var $frame = this.$el.find('iframe');
        $frame.fadeTo(0, 0);

        this.setSource();

        $frame.on('load', _.bind(function () {
            var player = $f($frame[0]);
            player.addEvent('play', _.bind(this.onPlay, this));
            $frame.fadeTo(300, 1);
        }, this));

        this.$el.dialog('open');
    }
});

SPVimeoVideo = Backbone.Model.extend({
    initialize: function () {
        this.load();
        return this;
    },

    load: function () {
        var apiUrl = 'http://vimeo.com/api/v2/video/' + this.get('videoId') + '.json?callback=vimeoResponder';
        var apiScript = document.createElement('script');
        apiScript.setAttribute('type', 'text/javascript');
        apiScript.setAttribute('src', apiUrl);
        document.getElementsByTagName('head')[0].appendChild(apiScript);
        return this;
    },

    requestSuccess: function (response) {
        var apiData = _(response).first();
        _(apiData).extend({ player_url: "http://player.vimeo.com/video/" + this.get('videoId') + "?api=1" });
        this.set(apiData);
        return this;
    },
    
    getThumb: function () {
        var defer = $.Deferred(),
            thumbnailUrl = { url: '' };

        $.get('//vimeo.com/api/oembed.json?url=http://vimeo.com/' + this.get('videoId') + '.json', _(function(response) {
            if (response && response['thumbnail_url']) {
                thumbnailUrl.url = response.thumbnail_url;
                defer.resolve(thumbnailUrl.url);
            }
        }).bind(this));
            
        return defer.promise(thumbnailUrl);
    }
});

SPVimeoManager = Backbone.View.extend({
    videos: new Backbone.Collection(),

    initialize: function () {
        (function (self) {
            window.vimeoResponder = function (response) {
                self.apiResponder(response);
            };
        })(this);
        this.detectVimeoFigures();
        return this;
    },

    detectVimeoFigures: function () {
        _.each($('body').find('figure[data-vimeo]'), function (element, index) {
            if ($(element).hasClass('demoModal')) return;
            var newVideo = new SPVimeoVideo({
                videoId: parseInt($(element).attr('data-vimeo')),
                gated: JSON.parse($(element).attr('data-gated')),
                eventType: $(element).attr('data-type'),
                title: $(element).attr('data-title'),
                playEventType: $(element).attr('data-playtype')
            });
            this.videos.add(newVideo);

            newVideo.modal = new SPVimeoModal({ model: newVideo });

            newVideo.figure = new SPVimeoFigure({ model: newVideo });
            newVideo.figure.setElement(element).render();
        }, this);
        return this;
    },

    apiResponder: function (response) {
        var videoId = response[0].video_id;
        this.videos.each(function (video) {
            if (video.get('videoId') === videoId)
                video.requestSuccess(response);
        });
        return this;
    }

});

SPTopics = Backbone.View.extend({
    initialize: function () {
        this.setElement($('[id$="cblToIs"]')[0]);
        this.setCheckBoxAttributes();
    },

    setCheckBoxAttributes: function () {
        _.each(this.$el.find('input[type="checkbox"]'), function (element) {
            var $element = $(element),
                labelVal = $element.next().text();

            if (labelVal.toLowerCase() != "all")
                $element.attr('data-name', labelVal);
        }, this);
    }
});

SPApp = Backbone.View.extend({

    initialize: function () {
        SPView.prototype.app = this;
        this.user = new SPUser();
        this.checkForQueryLogin();

        this.setElement(document.body);

        var sidebarEl = document.getElementById('sidebar');
        if (!!sidebarEl) {
            this.sidebar = new SPSidebar({ model: new SPSidebarAttributes() });
            this.sidebar.model.beginLoad();
        }

        this.vimeoManager = new SPVimeoManager();

        if (this.$el.find('#hfListJson').length > 0) {
            this.resourceView = new SPResourceListView();
        }

        if (document.getElementById('divDownloadForm') || window.location.href.match(/sp-blank-test/ig))
            this.modalManager = new SPModalManager({ el: document.getElementById('divDownloadForm') });

        this.topics = new SPTopics();

        this.formHandler = new SPFormHandler();

        if (typeof SP != 'undefined') {
            if (SP && SP.SPDemoModalManager) {
                this.demoModalManager = new SP.SPDemoModalManager();
            }
        }

        window.playDemoVideo = function () {
            $f(document.getElementById('demoVimeoModalFrame')).api('play');
        }
    },

    events: {
        "click [data-bb='clearStorage']" : "didClickClearStorage"
    },

    checkForQueryLogin: function () {
        var url = document.location.href;
        if (url.match(/email/) || url.match(/spUserID/)) {
            console.log('clearing for query login...');
            localStorage.clear();
        }
    },

    didClickClearStorage: function (evt) {
        localStorage.clear();
    },

    setCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + (exdays || 30));
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },

    getCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    },

    deleteAllCookies: function () {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    },

    resetContext: function () {
        this.deleteAllCookies();
        this.sidebar.clearSidebar();
        console.log("\n\n Silverpop: Context Reset! \n\n");
    }
});