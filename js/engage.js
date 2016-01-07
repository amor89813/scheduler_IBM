SPTracker = Backbone.Model.extend({
    defaults: {
        href: '',
        eventName: '',
        type: '',
        recipientId: 0,
        eventType: '',
        redirectUrl: ''
    },

    toJSON: function () {
        return JSON.stringify({
            eventName: this.get('eventName') || '',
            eventType: (this.get('eventType') || this.get('type')) || '',
            referringUrl: (this.get('href') || this.get('referringUrl')) || '',
            recipientId: this.get('recipientId') || ''
        });
    },

    doTrack: function (callback) {
        $.ajax({
            type: "POST",
            url: "/Services/DownloadService.asmx/TrackEngageData",
            cache: false,
            contentType: "application/json",
            dataType: "json",
            data: this.toJSON()
        }).done(_.bind(function () {
            this.track(callback);
        }, this));
    },

    redirect: function () {
        var landingOverride = $('#hfConfirmationUrl').val();
        var optOut = $('input:checkbox[data-name="OptOut"]').first();
        var optOutUrl = $("#hfOptOutRedirect").val();
        if (hasRedirect = (this.get('redirectUrl') && this.get('redirectUrl') !== '') || landingOverride) {
            // GL:  Im so sorry for this....
            var assetID = $('#hfAssetEPiID').val();

            if (landingOverride) {
                if (assetID) {
                    window.location = landingOverride + "?assetID=" + assetID;
                }
                else {
                    window.location = landingOverride;

                }
            }

            // Redirect if opting out
            else if (optOut.length && optOut.first().prop('checked') && optOutUrl !== '') {
                // GL 7/17: Redirect code needs to read from hidden field and redirect to that URL if it is set.  See GL for details.
                window.location = optOutUrl;
            }
            else {
                window.location = this.get('redirectUrl');
            }
        }
    }
});

SPFormTracker = SPTracker.extend({
    track: function (callback) {
        var href = null;
        _(function () {
            ewt.trackFormSubmit({ name: this.get('eventName'), type: this.get('eventType') });
            

            window.setTimeout(_(this.redirect).bind(this), 700);
        }).chain().bind(this).defer().value();

        if (callback && typeof callback === 'function') callback();

    }

    
});

SPLinkTracker = SPTracker.extend({
    defaults: {
        link: null
    },

    track: function () {
        _(function () {
            ewt.trackLink({ name: this.get('eventName'), type: 'click', link: this.get('link') });
        }).chain().bind(this).defer().value();
        location.href = this.get('href');
    }
});

SPDownloadTracker = SPTracker.extend({
    track: function (callback) {
        _(function () {
            var eventType = this.get('eventType') != '' ? this.get('eventType') : 'download';
            ewt.track({ name: this.get('eventName'), type: eventType });
            if (callback && typeof callback === 'function') setTimeout(callback, 700);
        }).chain().bind(this).defer().value();

    }
});

SPCustomTracker = SPTracker.extend({
    defaults: {
        type: null
    },

    track: function (callback) {
        _(function () {
            ewt.track({ name: this.get('eventName'), type: this.get('eventType') });
            if (callback && typeof callback === 'function') setTimeout(callback, 700);
        }).chain().bind(this).defer().value();

    }
});

SPEngage = Backbone.View.extend({
    linkTracker: null,
    formTracker: null,
    downloadTracker: null,
    customTracker: null,
    isCapturingForm: false,

    initialize: function () {
        this.setElement($('body')[0]);
        this.linkTracker = new SPLinkTracker();
        this.formTracker = new SPFormTracker();
        this.downloadTracker = new SPDownloadTracker();
        this.customTracker = new SPCustomTracker();
    },

    events: {
        "click a.trackEngage": "trackLink",
        "click .fakeDownload": "trackDownload",
        "click .landingPageDownload": "trackDownload",
        "click .commentPost": "trackComment",
        "click .caseStudyDownload": "trackCaseStudy",
        "click .formSubmit": "trackForm"
    },

    trackLink: function (e) {
        e.preventDefault();

        var link = $(e.currentTarget),
            href = link.attr('href'),
            eventName = link.attr('rel'),
            hfEngageData = $('#hfEngageData').val();

        var data = $.extend(JSON.parse(hfEngageData), {
            href: href,
            eventName: eventName,
            type: 'click',
            link: link
        });

        this.linkTracker.set(data).doTrack();
    },

    trackForm: function (e) {
        if (!this.validate()) {
            return;
        }

        var callback = _.bind(function () {
            var hfEngageData = $('#hfEngageData').val(),
                data = JSON.parse(hfEngageData || '{}'),
                hfPageData = $('#hfPageData').val(),
                pageData = JSON.parse(hfPageData || '{}');

            var modalOpen = !!silverpop.modalManager.openModal;

            var titleAttr, typeAttr;
            if (modalOpen) {
                titleAttr = silverpop.modalManager.openModal.options.downloadInfo['data-title'];
                typeAttr = silverpop.modalManager.openModal.options.downloadInfo['data-type'];

                if (titleAttr)
                    titleAttr = titleAttr.value;
                if (typeAttr)
                    typeAttr = typeAttr.value;
            }

            var redirectUrl = this.$el.find('[data-attr="formRedirect"]').val(); 
            var recipientId = silverpop.user.get('recipientId');
            var eventName = modalOpen ? (this.getAttribute('data-event') || titleAttr || typeAttr) : data.eventName || pageData.eventName || silverpop.modalManager.fieldData.eventName;
            var eventType = modalOpen ? this.getAttribute('data-type') || "white-paper-a-download" : data.eventType || pageData.eventType || silverpop.modalManager.fieldData.eventType;

            _.extend(data, {
                redirectUrl: redirectUrl,
                recipientId: recipientId,
                eventName: eventName,
                eventType: eventType
            });

            if (data.eventName) {
                this.formTracker.set(data).doTrack();
            } else {
                this.formTracker.set(data).redirect();
            }

        }, this);

        var run = _.bind(function () {
            silverpop.user.fetch(callback);
        }, this);

        _(run).delay(1000);
    },

    getAttribute: function (attributeName) {
        var attr = silverpop.modalManager.openModal.options.downloadInfo[attributeName];
        return attr ? attr.value : undefined;
    },

    trackModalForm: function (data) {
        //this.formTracker.set(data).doTrack();
    },

    trackModalDownload: function (data, callback) {
        var fetchCallback = _.bind(function () {
            _.extend(data, {
                recipientId: silverpop.user.get('recipientId')
            });

            this.downloadTracker.set(data).doTrack(callback);
        }, this);

        var run = _.bind(function () {
            silverpop.user.fetch(fetchCallback);
        }, this);

        _(run).delay(1000);
    },

    trackDownload: function (e) {
        e.preventDefault();

        var link = $(e.currentTarget),
            eventName = link.attr('data-file'), // name of file
            hfEngageData = $('#hfEngageData').val(),
            hfPageData = $('#hfPageData').val();

        var data = $.extend(JSON.parse(hfEngageData), {
            eventName: eventName,
            recipientId: JSON.parse(hfPageData).recipientId
        });

        var callback = _.bind(function () {
            _($('#btnDownload')).each(function (button) {
                button.click();
            });
        }, this);

        this.downloadTracker.set(data).doTrack(callback);
    },

    trackComment: function (e) {
        e.preventDefault();

        var hfEngageData = $('#hfEngageData').val() || $('#hfPageData').val();

        var data = JSON.parse(hfEngageData);

        this.clickThrough = _(function () {
            $(e.currentTarget).siblings('.hiddenCommentPost').click();
        }).bind(this);

        var checkActive = function (ifNone) {
            if ($.active === 0 && ifNone) ifNone();
            else window.setTimeout(function () { checkActive(ifNone); }, 200);
        };

        var callback = _.bind(function () {
            checkActive(this.clickThrough);
        }, this);

        this.customTracker.set(data).doTrack(callback);
    },

    trackCaseStudy: function (e) {
        e.preventDefault();

        var hfEngageData = $('#hfEngageData').val();

        var data = JSON.parse(hfEngageData);

        var callback = _.bind(function () {
            $(e.currentTarget).siblings('.hiddenCasestudyDownload').click();
        }, this);

        this.customTracker.set(data).doTrack(callback);
    },

    trackCustom: function (eventType, eventName) {
        var data = JSON.parse($('#hfPageData').val());
        _.extend(data, {
            eventType: eventType,
            eventName: eventName
        });

        this.customTracker.set(data).doTrack();
    },

    validate: function () {
        if (silverpop.modalManager.openModal)
            return true;
        if (typeof (Page_ClientValidate) == 'function')
            Page_ClientValidate();
        else return true;

        return Page_IsValid;
    }
});