var SP = window.SP || {};

_(SP).extend(function ($) {
    var SPDemo, SPDemoModalManager, SPDemoModalLauncher, SPStickyDemoModalLauncher, SPDemoModal, SPDemoModalFactory, SPDemoLauncherFactory, SPVimeoDemoModal, SPFrameDemoModal;

    SPDemoModalFactory = {
        getInstance: function (spDemoLauncher) {
            if (!spDemoLauncher instanceof SPDemoModalLauncher) {
                throw "spDemoLauncher must be an instance of SPDemoModalLauncher";
            }

            var isSticky = spDemoLauncher instanceof SPStickyDemoModalLauncher;

            if (spDemoLauncher.getVimeoId()) {
                return new SPVimeoDemoModal({ model: spDemoLauncher.model, isSticky: isSticky, launcher: spDemoLauncher });
            } else {
                return new SPFrameDemoModal({ model: spDemoLauncher.model, isSticky: isSticky, launcher: spDemoLauncher });
            }
        }
    };

    SPDemoLauncherFactory = {
        getInstance: function (el) {
            var $el = $(el),
                id = $el.attr('id'),
                isSticky = id && id.indexOf('hlDemo') !== -1;

            if (isSticky) {
                return new SPStickyDemoModalLauncher({ el: el });
            } else {
                return new SPDemoModalLauncher({ el: el });
            }
        }
    };

    SPDemo = Backbone.Model.extend({
        __bbType: 'SPDemo',

        defaults: {                  
            formPageId: 0,
            vimeoId: 0,
            iFrameUrl: '',
            isGated: true,
            eventType: '',
            campaignId: '',
            campaignStatus: '',
            leadSource: '',
            promoCode: '',
            eventName: '',
            playEventName: '',
            sidebarText: ''
        },

        getVimeoUrl: function () {
            return 'http://player.vimeo.com/video/' + this.get('vimeoId') + '?api=1&player_id=demoVimeoModalFrame';
        },

        getUrl: function () {
            return this.get('iFrameUrl');
        }
    });

    SPDemoModalManager = Backbone.View.extend({
        __bbType: 'SPDemoModalManager',

        launchers: [],

        initialize: function () {
            this.setElement(document.body);
            this.detectLaunchers();
        },

        detectLaunchers: function () {
            this.$('.button.demo, .homeBottomSideCallout, .demoModal, .wrapped-launcher').each(_(function (idx, el) {
                this.launchers.push(SPDemoLauncherFactory.getInstance(el));
            }).bind(this));
        }
    });

    SPDemoModalLauncher = Backbone.View.extend({
        __bbType: 'SPDemoModalLauncher',

        initialize: function () {
            this.modal = SPDemoModalFactory.getInstance(this);
            this.populateModel();
        },

        getLink: function () {
            var link = null;

            if (this.$el.parent().is('a')) {
                link = this.$el.parent();
            } else if (this.$el.find('a')) {
                link = this.$el.find('a').first();
            }

            return link;
        },

        shouldOverrideClickBehavior: function () {
            var link = this.getLink();

            if (link) {
                return !!$(link).attr('href') === false;
            }

            return true;
        },

        shouldDisplayModal: function () {
            var link = this.getLink();

            if (link) {
                return !!$(link).attr('href') === false || $(link).attr('href') === "#";;
            }

            return true;            
        },

        events: {
            'click': 'didClick'
        },

        didClick: function (evt) {
            evt.stopPropagation();
            if (this.shouldOverrideClickBehavior()) {
                evt.preventDefault();                
            }

            if (this.shouldDisplayModal()) {
                this.modal.render();
            }            
        },

        populateModel: function () {
            this.model = new SPDemo();
            this.model.set('vimeoId', this.getVimeoId());
            this.model.set('iFrameUrl', this.getFrameUrl());
            this.model.set('formPageId', this.getPageId());
            this.model.set('isGated', this.getIsGated());
            this.model.set('eventType', this.getEventType());
            this.model.set('campaignId', this.getCampaignId());
            this.model.set('campaignStatus', this.getCampaignStatus()); 
            this.model.set('leadSource', this.getLeadSource());
            this.model.set('promoCode', this.getPromoCode());
            this.model.set('eventName', this.getEventName());
            this.model.set('playEventType', this.getPlayEventType());
            this.model.set('sidebarText', this.getSidebarText());

            this.modal.setModel(this.model);
        },

        getContainer: function () {
            if (this.$el.attr('class') == 'homeBottomSideCallout') {
                return this.$el;
            }
            else {
                return this.$el.parents('.vimeo-slider').first();
            }
        },

        getHiddenValue: function (fieldName, defaultValue) {
            var $field = this.getContainer().find('input[type="hidden"][id$="' + fieldName + '"]');
            if ($field.length !== 0) {
                return $field.val() || defaultValue;
            }
        },

        getSidebarText: function () {
            var $text = this.getContainer().find('.sidebarText')

            if ($text.length === 0) {
                return '';
            }

            return $text.html();
        },

        getPageId: function () {
            return this.getHiddenValue('formPageID');
        },

        getVimeoId: function () {
            return this.getHiddenValue('vimeoID');
        },

        getFrameUrl: function () {
            return this.getHiddenValue('iFrameURL');
        },

        getIsGated: function () {
            var gatedFieldVal = this.getHiddenValue('demoIsGated');
            return !!Number(gatedFieldVal);
        },

        getEventType: function () {
            return this.getHiddenValue('eventType');
        },

        getCampaignId: function () {
            return this.getHiddenValue('salesForceCampaignID');
        },

        getCampaignStatus: function () {
            return this.getHiddenValue('salesForceCampaignStatus');
        },

        getLeadSource: function () {
            return this.getHiddenValue('leadSource');
        },

        getPromoCode: function () {
            return this.getHiddenValue('promoCode');
        },

        getEventName: function () {
            return this.getHiddenValue('eventName');
        },

        getPlayEventType: function () {
            return this.getHiddenValue('playEventType');
        }
    });

    SPStickyDemoModalLauncher = SPDemoModalLauncher.extend({
        __bbType: 'SPStickyDemoModalLauncher',

        getVimeoId: function () {
            return this.$el.data('vimeoid') || '';
        },

        getPageId: function () {
            return this.$el.data('formpageid') || 0;
        },

        getFrameUrl: function () {
            return this.$el.data('iframeurl') || '';
        },

        getIsGated: function () {
            var gatedFieldVal = this.$el.data('isgated') || '';
            return !!Number(gatedFieldVal);
        },

        getEventType: function () {
            return this.$el.data('eventtype') || '';
        },

        getCampaignId: function () {
            return this.$el.data('salesforcecampaignid') || '';
        },

        getCampaignStatus: function () {
            return this.$el.data('salesforcecampaignstatus') || '';
        },

        getLeadSource: function () {
            return this.$el.data('leadsource') || '';
        },

        getPromoCode: function () {
            return this.$el.data('promocode') || '';
        },

        getEventName: function () {
            return this.$el.data('eventname') || '';
        },

        getPlayEventType: function () {
            return this.$el.data('playeventname') || '';
        }
    });

    SPDemoModal = Backbone.View.extend({
        __bbType: 'SPDemoModal',

        className: 'modal resourceDownload',

        events: {
            'click .formSubmit': 'didClickSubmit',
            'click .provideEmail, .cancelEmailEntry': 'didClickProvideEmail',
            'click .login input[type="submit"]': 'didSubmitEmail',
            'click [data-bb="clearStorage"]': 'didClickClearStorage'
        },

        getFormEngageData: function () {
            var $hfPageData = $('#hfPageData'),
                engageData = {};

            if($hfPageData.length !== 0) {
                engageData = JSON.parse($hfPageData.val());
            }

            return _.extend(engageData, {
                eventName: this.model.get('eventName'),
                eventType: this.model.get('eventType')
            });
        },

        submitFormEngageData: function () {
            if (!this.formTracker) {
                this.formTracker = new SPFormTracker();
            }

            this.formTracker.set(this.getFormEngageData());
            this.formTracker.track();
        },

        didSubmitEmail: function (evt) {
            evt.preventDefault();

            var email = this.$('[data-bind="emailAddress"]').val() || '';
            silverpop.user.set('emailAddress', email);

            $.ajax({
                type: "POST",
                url: "/Services/DownloadService.asmx/EmailAddressHasUser",
                cache: false,
                contentType: "application/json",
                data: JSON.stringify({ emailAddress: email }),
                dataType: "json",
                complete: _(function (response) {
                    var data = JSON.parse(response.responseText).d;
                    if (data.WasSuccessful) {
                        silverpop.modalManager.updateFieldData();
                        this.render();
                    } else {
                        // show error message
                        this.didSubmitIncorrectEmail();
                    }
                }).bind(this)
            });
        },

        didClickClearStorage: function (evt) {
            localStorage.clear();
            evt.preventDefault();
            $.ajax({
                type: 'post',
                url: '/services/downloadservice.asmx/Logout',
                success: _.bind(function () {
                    this.render();
                }, this)
            });
        },

        didSubmitIncorrectEmail: function () {
            // display error
            this.$('.form, .login, .userNotFound').toggle();
        },

        didClickProvideEmail: function (evt) {
            evt.preventDefault();

            this.$('.form, .login').toggle();
        },

        didClickSubmit: function (evt) {
            evt.preventDefault();

            var allInputsValid = this.validateControls('input'),
                allSelectsValid = this.validateControls('select');

            if (allInputsValid && allSelectsValid) {
                this.showSubmitSpinner();
                this.submitFormEngageData();
                this.sendFieldData();
            }
        },

        sendSuccess: function () {
            this.showFinalFrame();
        },

        template: Handlebars.templates.demoModal,

        initialize: function () {
            var modalClass = '';
            var vimeoID = $('.resourceLaunch ').attr('data-vimeo');
            if (typeof vimeoID != 'undefined') {
                modalClass = 'isVimeo';
            };

            this.$el.dialog(_.extend(this.modalOpts, {
                beforeClose: _(this.beforeClose).bind(this),
                dialogClass: modalClass
            }));
        },

        playVideo: function () {

        },

        setModel: function (model) {
            this.model = model;
            this.trigger('set:model');
        },

        open: function () {
            this.$el.dialog('open');
        },

        close: function () {
            this.$el.dialog('close');
        },

        beforeClose: function () {
            this.getFinalFrame().find('iframe').attr('src', '');
        },

        modalOpts: {
            autoOpen: false,
            modal: true,
            closeText: 'X',
            width: 700
        },

        showSubmitSpinner: function () {
            this.$('.emailAjaxIndicator').show();
        },

        hideSpinners: function () {
            this.$('.emailAjaxIndicator, .fieldAjaxIndicator').hide();
            this.$el.css('background', 'white');
        },

        hasVisibleFields: function () {
            if (!this.fieldData) return false;

            return _(this.fieldData.fields).any(function (field) {
                return field.isVisible;
            }, this);
        },

        render: function () {
            var run = _(function () {
                this.el.innerHTML = this.template(this);
                this.hideSpinners();

                if (this.options.isSticky) {
                    this.$('.desc').html($('#stickySidebarText').html());
                } else {
                    this.$('.desc').html(this.model.get('sidebarText'));
                }

                this.open();

                if (this.model.get('isGated') === false || !this.hasVisibleFields()) {
                    this.showFinalFrame();
                }

                _gat._getTracker('UA-7346219-1')._trackPageview('/demo/modal');
            }).bind(this);

            if (this.model.get('isGated')) {
                this.getFieldData(run);
            } else {
                run();
            }
        },

        getFieldData: function (callback) {
            $.ajax({
                url: "/services/engageformpage.aspx?PageId=" + this.model.get('formPageId'),
                contentType: "application/json",

                success: _(function (response) {

                    var fieldData = JSON.parse(response);
                    fieldData.fields = this.adjustFields(fieldData.fields);
                    this.fieldData = this.model.fieldData = fieldData;

                    if (callback && typeof callback === 'function') {
                        callback();
                    }

                }).bind(this)
            });
        },

        adjustFields: function (fields) {
            var newFields = _(fields).map(function (field) {
                return _(field).extend({
                    isVisible: (field.fieldType.type !== "Hidden")
                });
            });
            _(newFields).each(function (field) {
                if (field.fieldName === "FirstName") {
                    if (silverpop.sidebar && silverpop.sidebar.model.get('name')) {
                        field.fieldValue = silverpop.sidebar.model.get('name');
                    }
                }
            }, this);
            return newFields;
        },

        getFinalFrame: function () {
            throw "getFinalFrame must be overridden.";
        },

        showFinalFrame: function () {
            throw "showFinalFrame must be overridden.";
        },

        validateControls: function (inputType) {
            var allValid = true;
            _(this.$el.find(inputType)).each(function (element) {
                var $element = $(element);
                var error = $element.siblings('span.error');
                var valid = this.isValidInput($element);

                if (!valid) {
                    allValid = false;
                    error.css('display', 'block');
                }
                else {
                    error.css('display', 'none');
                }
            }, this);
            return allValid;
        },

        isValidInput: function(el) {
            var $el = $(el);

            if ($el.is("select")) {
                return this.isValidSelect(el);
            }
            else if ($el.is("input")) {
                return this.isTextInputValid(el);
            }
        },

        isTextInputValid: function ($target) {
            var isValid = true;
            var required = $target.parents('[data-validate-required="true"]').length !== 0;
            var regex = $target.parents('[data-validate-regex]').length !== 0;
            var isNumber = $target.parents('[data-validate-number="true"]').length !== 0;

            if (required) {
                isValid = $target.val().length !== 0;
            }

            if (isValid && regex) {
                var patternString = $target.parents('[data-validate-regex]')[0].attributes["data-validate-regex"].value;
                var pattern = new RegExp(patternString);
                isValid = $target.val().match(pattern);
            }

            if (isValid && isNumber) {
                isValid = Number($target.val()) !== NaN;
            }

            return isValid;
        },

        isValidSelect: function ($target) {
            var required = $target.parents('[data-validate-required="true"]').length !== 0;
            var valid = required && $target.val();
            return valid;
        },

        updateFields: function () {
            _(this.fieldData.fields).each(function (field) {
                _(this.el.querySelectorAll('[data-field-name="' + field.fieldName + '"]')).each(function (element) {
                    field.fieldValue = $(element).find('input, select').first().val();
                }, this);
            }, this);
        },

        sendFieldData: function () {
            this.updateFields();
            console.log("Modal: sending field data: \n\t", this.fieldData);
            this.$el.find('.fieldAjaxIndicator').fadeIn();
            var ajaxData = _(this.fieldData).extend({
                campaignId: this.model.get('campaignId'),
                campaignStatus: this.model.get('campaignStatus'),
                leadSource: this.model.get('leadSource'),
                promoCode: this.model.get('promoCode')
            });
            $.ajax({
                type: "POST",
                url: "/Services/DownloadService.asmx/UpdateModalData",
                cache: false,
                contentType: "application/json",
                data: JSON.stringify({ data: ajaxData }),
                dataType: "json",
                complete: _(this.sendSuccess).bind(this)
            });
        }
    });

    SPVimeoDemoModal = SPDemoModal.extend({
        __bbType: 'SPVimeoDemoModal',

        initialize: function () {
            SPDemoModal.prototype.initialize.apply(this, arguments);
            this.on('set:model', _(this.loadInfo).bind(this));
        },

        loadInfo: function () {
            this.getVimeoInfo(_(function () {
                if (this.vimeoInfo && this.options.launcher) {
                    var $img = this.options.launcher.$('img');
                    if (!!$img.attr('src') === false) {
                        $img.attr('src', this.vimeoInfo.thumbnail_large);
                    }
                }
            }).bind(this));
        },

        showFinalFrame: function () {
            var $vimeo = this.getFinalFrame(),
                $frame = $vimeo.find('iframe');

            $frame.attr('src', this.model.getVimeoUrl());
            this.$('div').hide();
            $vimeo.show();

            this.playVideo();
        },

        getFinalFrame: function () {
            return this.$('[data-bb="vimeo"]');
        },

        vimeoInfo: null,

        getVimeoInfo: function (callback) {
            var runCallback = function (arg) {
                if (callback && typeof callback === 'function') {
                    callback(arg);
                }
            };

            if (!this.vimeoInfo) {
                var vimeoId = this.model.get('vimeoId');

                $.getJSON('//vimeo.com/api/v2/video/' + vimeoId + '.json?callback=?', _(function (response) {
                    this.vimeoInfo = response[0];
                    console.log(this.vimeoInfo);
                    runCallback(this.vimeoInfo);
                }).bind(this));
            } else {
                runCallback(this.vimeoInfo);
            }
        },

        playVideo: function () {
            var iframe = this.getFinalFrame().find('iframe')[0],
                player = $f(iframe);

            player.addEvent('ready', _(function () {
                window.playDemoVideo();

                player.addEvent('play', _(function () {
                    var vimeoId = this.model.get('vimeoId');

                    $.getJSON('//vimeo.com/api/v2/video/' + vimeoId + '.json?callback=?', _(function (response) {
                        var videoTitle = response && response[0] ? response[0].title || '' : '';
                        if (!this.customTracker) {
                            this.customTracker = new SPCustomTracker();
                        }

                        this.customTracker.set(_.extend(this.getFormEngageData(), {
                            eventName: videoTitle
                        }));

                        this.customTracker.track();
                    }).bind(this));

                }).bind(this));
            }).bind(this));
        }
    });

    SPFrameDemoModal = SPDemoModal.extend({
        __bBType: 'SPFrameDemoModal',

        showFinalFrame: function () {
            var $frame = this.getFinalFrame();
            $frame.find('iframe').attr('src', this.model.getUrl());
            this.$('div').hide();
            $frame.show();
        },

        getFinalFrame: function () {
            return this.$('[data-bb="iframe"]');
        }
    });

    return {
        SPDemoModalManager: SPDemoModalManager
    };

}(jQuery));