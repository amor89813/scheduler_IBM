(function ($) {

    SPModalProto = SPView.extend({
        modalDispatch: _(Backbone.Events).clone()
    });

    /* Modal Manager */

    SPModalManager = SPModalProto.extend({

        initialize: function () {
            if(window.Sys) Sys.Application.add_load(_(this.getFieldData).bind(this));

            this.genericModals = [];
            this.openModal = null;

            this.discover();

            spDispatch.on('didRenderResources', this.discover, this);

            _(this.initVideos).chain().bind(this).defer().value();

            spDispatch.on('didUpdateSidebar', this.getFieldData, this);
            this.app.user.on('change', this.didChangeUser, this);

            this.$el.show();

            spDispatch.on('fieldDataSent', this.updateFieldData, this);

            spDispatch.on('openedDownloadModal', this.didOpenDownloadModal, this);
            spDispatch.on('openedVimeoModal', this.didOpenVimeoModal, this);
            spDispatch.on('modalOpened', this.didOpenModal, this);
            spDispatch.on('modalClosed', this.didCloseModal, this);

            this.loadFormIds();
        },

        discover: function () {
            this.downloadButtons = [];
            this.vimeoButtons = [];

            this.detectDownloadButtons();
            this.detectVimeoButtons();
        },

        detectDownloadButtons: function () {
            _($(document.body).find('.launchDownload')).each(function (element) {
                this.addDownloadButton(element);
                //this.downloadButtons.push(new SPDownloadButton({ el: element }));
            }, this);
        },

        detectVimeoButtons: function () {
            _($(document.body).find('.launchVimeo')).each(function (element) {
                this.vimeoButtons.push(new SPVimeoButton({ el: element }));
                this.loadVideo(element);
            }, this);
        },

        delegateEvents: function () {
            Backbone.View.prototype.delegateEvents.apply(this, arguments);
            _(this.downloadButtons).each(function (downloadButton) {
                downloadButton.delegateEvents();
            }, this);
            _(this.vimeoButtons).each(function (vimeoButton) {
                vimeoButton.delegateEvents();
            }, this);
        },

        didOpenModal: function (modal) {
            //if (this.openModal) {
            //    this.closeAll();
            //}

            this.openModal = modal;
        },

        didCloseModal: function () {
            this.openModal = null;
        },

        closeAll: function () {
            try {
                this.openModal.$el.dialog('close');
            } catch (ex) {
                console.log(ex);
            }
            this.openModal = null;
        },

        loadFormIds: function () {
            var formIds = JSON.parse($('#hfFormIds').val() || $('[data-pageid]').data("pageid"));
            this.formIds = formIds;
            this.currentFormId = this.formIds.downloadFormPageId;
        },

        didOpenDownloadModal: function () {
            console.log('Setting page reference...');
            this.currentFormId = this.formIds.downloadFormPageId;
            this.getFieldData();
        },

        didOpenVimeoModal: function (callback) {
            this.fieldDataCallback = callback;
            console.log('Setting page reference...');
            this.currentFormId = this.formIds.vimeoFormPageId;
            this.getFieldData();
        },

        loadVideo: function (element) {
            var apiUrl = 'http://vimeo.com/api/v2/video/' + $(element).attr('data-vimeo') + '.json';
            var apiScript = document.createElement('script');
            apiScript.setAttribute('type', 'text/javascript');
            apiScript.setAttribute('src', apiUrl);
            document.getElementsByTagName('head')[0].appendChild(apiScript);
            return this;
        },

        initVideos: function () {
            _(this.app.vimeoManager.videos.models).each(function (video) {
                this.vimeoButtons.push(new SPVimeoButton({ el: video.figure.el, model: video }));
            }, this);
        },

        addDownloadButton: function (element) {
            var $element = $(element);
            if (!$element.hasClass('hasDownloadView')) {
                $element.addClass('hasDownloadView');
                this.downloadButtons.push(new SPDownloadButton({ el: element }));
            }
        },

        getFieldData: function () {
            console.log("Modal Manager: sent request for field data...");
            $.ajax({
                url: "/services/engageformpage.aspx?PageId=" + this.currentFormId,
                contentType: "application/json",
                success: _(this.parseFieldData).bind(this),
                error: _(this.errorFieldData).bind(this)
            });
        },

        errorFieldData: function (response) {
            console.log("error loading field data \n\t", arguments);
        },

        parseFieldData: function (response) {
            var fieldData = JSON.parse(response);
            fieldData.fields = this.adjustFields(fieldData.fields)
            console.log("ModalManager: recieved field data \n\t", fieldData);
            SPModalProto.prototype.fieldData = fieldData;
            this.modalDispatch.trigger('didUpdateFieldData');
            spDispatch.trigger('didUpdateModals');

            if (this.fieldDataCallback && typeof this.fieldDataCallback === 'function') {
                this.fieldDataCallback();
                this.fieldDataCallback = null;
            }
        },

        updateFieldData: function () {
            spDispatch.trigger('didStartReloadingFields');
            console.log("ModalManager: requesting field data update");
            this.app.user.fetch();
            this.getFieldData();
        },

        didChangeUser: function () {
            if ('fieldData' in this) {
                _(this.fieldData.fields).each(function (field) {
                    if (field.fieldName === "FirstName") {
                        field.fieldValue = (this.app.user.get('firstName') || "");
                    }
                    else if (field.fieldName === "Email") {
                        field.fieldValue = (this.app.user.get('emailAddress') || "");
                    }
                }, this);
            }
            spDispatch.trigger('didUpdateFieldsFromUser');
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

        createGenericModal: function (options) {
            var newModal = new SPGenericModal(options);
            this.genericModals.push(newModal);
            newModal.render();
        },

        reloadTemplates: function () {
            $.get('/js/templates/modals/modaltemplates.js');
        }

    });

    /** Modal Launch Buttons **/

    SPDownloadButton = SPModalProto.extend({

        events: {
            "click": "didClick"
        },

        didClick: function (evt) {
            evt.preventDefault();

            this.modal = new SPDownloadModal({ downloadInfo: this.el.attributes });
            this.modal.render();
        }

    });

    SPVimeoButton = SPModalProto.extend({
        events: {
            "click": "didClick"
        },

        initialize: function () {
            this.pageReference = 1111;

            var hasAttributes = !!this.el.attributes,
                hasVimeo = hasAttributes && !!this.el.attributes['data-vimeo'];

            if (hasVimeo) {
                var vimeoId = this.el.attributes['data-vimeo'].value;
                $.getJSON('//vimeo.com/api/oembed.json?url=http://vimeo.com/' + vimeoId + '&callback=?', _(this.vimeoCallback).bind(this));
            }
        },

        vimeoCallback: function (response) {
            if (typeof response === 'string') {
                response = JSON.parse(response);
            }
            this.$el.attr('data-title', response.title);
            //this.$el.attr('data-event', 'product-demo-a-registration');

            if (!this.$el.find('img').attr('src') && response['thumbnail_url']) {
                this.$el.find('img').attr('src', response.thumbnail_url);
                this.thumbnail = response.thumbnail_url;
            }
        },

        didClick: function (evt) {
            evt.preventDefault();

            if (this.model && !this.model.attributes.gated) {
                this.model.modal.show();
            } else if (this.model && this.model.attributes.gated) {
                this.modal = new SPGatedVimeo({ downloadInfo: this.el.attributes, model: this.model });
                this.modal.checkForFormEmptiness();
            } else {
                this.modal = new SPWatchVimeoModal({ downloadInfo: this.el.attributes });
                this.modal.render();
            }
        }
    });

    /** Modals **/

    SPModal = SPModalProto.extend({
        template: _.template(''),
        modalWidth: 690,

        modalPosition: {
            my: "top",
            at: "top+10%",
            of: window
        },

        initialize: function () {
            this.$el.dialog({
                position: this.modalPosition,
                width: this.modalWidth,
                autoOpen: true,
                modal: true,
                open: function (event, ui) {
                    window.setTimeout(function () {
                        jQuery(document).unbind('mousedown.dialog-overlay').unbind('mouseup.dialog-overlay');
                    }, 100);
                }
            });
            $(window).resize(_(this.didResizeWindow).bind(this));
        },

        events: {
            "dialogclose": "didCloseDialog"
        },

        didResizeWindow: function () {
            this.$el.dialog('option', 'position', this.modalPosition);
        },

        didCloseDialog: function () {
            this.$el.remove();
            spDispatch.trigger('modalClosed');
        },

        openPanel: function (panelName) {
            _(this.panels).each(function (value, key) {
                this.panels[key].hide();
            }, this);
            if (this.panels[panelName]) {
                this.panels[panelName].show();
                this.trigger('didOpenPanel:' + panelName);
            }
        },

        hide: function () {
            this.$el.dialog('close');
        }

    });

    SPGenericModal = SPModal.extend({
        className: "modal genericModal",

        template: Handlebars.templates.genericModal,

        render: function () {
            spDispatch.trigger('modalOpened', this);
            this.el.innerHTML = this.template(this);
        }
    });

    SPGatedVimeo = SPModal.extend({
        className: "modal resourceDownload",

        initialize: function () {
            SPModal.prototype.initialize.apply(this, arguments);

            var callback = _.bind(function () {
                this.panels = {};
                this.panels.registerForm = new SPVimeoRegisterForm({ downloadInfo: this.options.downloadInfo, modal: this });
                this.el.appendChild(this.panels.registerForm.render().el);

                this.emailEntry = {};
                this.panels.emailEntry = new SPGatedVimeoEmailEntry({ downloadInfo: this.options.downloadInfo, modal: this });
                this.el.appendChild(this.panels.emailEntry.render().el);

                this.openPanel('registerForm');

                this.on('didSubmitForm', this.formSubmitSuccess, this);
                spDispatch.on('didSocialSignIn', this.didSocialSignIn, this);

                spDispatch.trigger('modalOpened', this);
            }, this);

            spDispatch.trigger('openedVimeoModal', callback);
        },
        
        setThumb: function () {
            this.model.getThumb().done(_(function(result) {
                this.$el.find('#imgThumbnail').attr('src', result);
            }).bind(this));
        },

        didSocialSignIn: function () {
            this.formSubmitSuccess();
        },

        formSubmitSuccess: function () {
            this.hide();
            this.model.modal.options.downloadInfo = this.options.downloadInfo;
            spDispatch.trigger('modalOpened', this.model.modal);
            this.model.modal.render();
            //this.model.modal.$el.dialog('open');
            this.model.modal.show();
        },

        checkForFormEmptiness: function () {
            if (!this.fieldData) {
                window.setTimeout(_(this.checkForFormEmptiness).bind(this), 30000);
                return;
            }
            
            var hasNonHidden = _(this.fieldData.fields).detect(function (field) {
                return field.fieldType.type !== "Hidden";
            }, this);
            if (!hasNonHidden) {
                this.formSubmitSuccess();
            } else {
                this.render();
            }
        },
        
        render: function() {
            SPModal.prototype.render.apply(this, arguments);
            setTimeout(_(function() {
                this.setThumb();
            }).bind(this), 250);
        }
    });

    SPWatchVimeoModal = SPModal.extend({
        className: "modal resourceDownload",
        modalWidth: 730,

        initialize: function () {
            SPModal.prototype.initialize.apply(this, arguments);
            this.panels = {};
            this.panels.watchVimeo = new SPWatchVimeo({ downloadInfo: this.options.downloadInfo, modal: this });
            this.el.appendChild(this.panels.watchVimeo.render().el);

            this.openPanel('watchVimeo');

            spDispatch.trigger('modalOpened', this);
        }
    });

    SPDownloadModal = SPModal.extend({
        className: "modal resourceDownload",

        initialize: function () {
            SPModal.prototype.initialize.apply(this, arguments);

            spDispatch.trigger('openedDownloadModal');

            this.panels = {};
            this.panels.registerForm = new SPRegisterForm({ downloadInfo: this.options.downloadInfo, modal: this });
            this.el.appendChild(this.panels.registerForm.render().el);

            this.panels.downloadComplete = new SPDownloadComplete({ downloadInfo: this.options.downloadInfo, modal: this });
            this.el.appendChild(this.panels.downloadComplete.render().el);

            this.emailEntry = {};
            this.panels.emailEntry = new SPEmailEntry({ downloadInfo: this.options.downloadInfo, modal: this });
            this.el.appendChild(this.panels.emailEntry.render().el);

            this.on('didOpenPanel:downloadComplete', this.triggerDownload, this);
            this.on('didOpenPanel:registerForm', function () {
                this.panels['registerForm'].loadUserData();
            }, this);

            spDispatch.on('didUpdateModals', this.didUpdateModals, this);
            spDispatch.on('didSocialSignIn', this.didSocialSignIn, this);

            this.openPanel('registerForm');
            this.checkForFormEmptiness();

            spDispatch.trigger('modalOpened', this);
        },

        events: _(SPModal.prototype.events).chain().clone().extend({
            "click input[type='submit']": "didClickSubmit",
            "click [data-bb='altDownload']": "triggerDownload"
        }).value(),

        didUpdateModals: function () {
            console.log('form data loaded');
            this.panels['registerForm'].render(false);
            this.checkForFormEmptiness();
        },

        didSocialSignIn: function () {
            this.openPanel('downloadComplete');
        },

        didClickSubmit: function () {
            var data = JSON.parse($('#hfPageData').val()),
                eventName = this.options.downloadInfo['data-title'].value,
                eventType = "white-paper-a-download";

            _.extend(data, {
                eventName: eventName,
                eventType: eventType
            });

            //spEngageTracking.trackModalForm(data);
            $('.userNotFound').hide();
        },

        checkForFormEmptiness: function () {
            if (!this.fieldData) {
                window.setTimeout(_(this.checkForFormEmptiness).bind(this), 500);
                return;
            }

            var hasNonHidden = _(this.fieldData.fields).detect(function (field) {
                return field.fieldType.type !== "Hidden";
            }, this);
            if (!hasNonHidden)
                this.openPanel('downloadComplete');
        },

        triggerDownload: function () {
            var callback = _.bind(function () {
                silverpop.modalManager.updateFieldData();
                var fileLoc = "/services/DownloadHandler.ashx?path=" + this.options.downloadInfo["data-file"].value + "&name=" + this.options.downloadInfo["data-title"].value;
                //location.href = fileLoc;
                $('#dlFrame').attr('src', fileLoc);
            }, this);

            var data = JSON.parse($('#hfPageData').val()),
                eventName = this.options.downloadInfo['data-title'].value,
                eventType = "white-paper-a-view";

            _.extend(data, {
                eventName: eventName,
                eventType: eventType
            });

            spEngageTracking.trackModalDownload(data, callback);
        }
    });


    /** Modal Panels **/

    SPModalPanel = SPModalProto.extend({

        initialize: function () {
            this.loadUserData();
        },

        show: function () {
            this.render();
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        formSubmitSuccess: function () {
            this.trigger('didSubmitForm');
            this.options.modal.openPanel('downloadComplete');
        },

        loadUserData: function () {
            var callback = _.bind(function (response) {
                response = response.d;
                this.nameText = response.firstName || response.email;
                if (!this.nameText) {
                    $('.notUser').hide();
                } else {
                    $('#notUserText').text(response.firstName || response.email);
                }
            }, this);

            $.ajax({
                type: 'post',
                url: '/services/downloadservice.asmx/GetUserData',
                dataType: 'json',
                contentType: 'application/json',
                success: callback
            });
        },

        loadFormData: function () {
            this.formData = silverpop.modalManager.fieldData;
        },

        render: function () {
            this.loadFormData();
            this.el.innerHTML = this.template(this);
            _(this.el.querySelectorAll('.registerFieldsWrap')).each(function (element) {
                this.fieldsView = new SPRegisterFields({ el: element, downloadInfo: this.options.downloadInfo, panel: this });
                this.fieldsView.render();
                this.fieldsView.on('submitComplete', this.formSubmitSuccess, this);
            }, this);
            this.trigger('renderComplete');
            return this;
        }

    });

    SPRegisterForm = SPModalPanel.extend({
        className: "downloadRegister",

        template: Handlebars.templates.registerForm,

        initialize: function () {
            this.on('renderComplete', this.loadUserData, this);
        },

        events: {
            "click .provideEmail": "didClickProvideEmail",
            "click .notUser": "didClickLogOut",
            "click .socialSignIn a": 'didClickSocialSignIn'
        },

        didClickSocialSignIn: function (evt) {
            $target = $(evt.currentTarget);
            var targetString = $target.attr('data-target');
            $('#' + targetString).click();
            evt.preventDefault();
        },

        didClickProvideEmail: function (evt) {
            $('.userNotFound').hide();
            this.options.modal.openPanel('emailEntry');
            evt.preventDefault();
        },

        render: function (showSpinner) {
            SPModalPanel.prototype.render.apply(this, arguments);

            return this;
        },

        

        didSubmitIncorrectEmail: function () {
            $('.userNotFound').show();
        },

        didClickLogOut: function (evt) {
            evt.preventDefault();
            $.ajax({
                type: 'post',
                url: '/services/downloadservice.asmx/Logout',
                success: _.bind(function () {
                    this.loadUserData(function () {
                        window.location = '/My-Profile';
                    });
                }, this)
            });
        },

        loadUserData: function (onComplete) {
            this.options.modal.$el.css('background', 'url(/img/bg_resource_modal.png) repeat-y');

            var callback = _.bind(function (response) {
                response = response.d;
                var nameText = response.firstName || response.email;
                if (!nameText) {
                    $('.notUser').hide();
                } else {
                    $('#notUserText').text(response.firstName || response.email);
                }

                if (onComplete && typeof onComplete === 'function') onComplete();
            }, this);

            $.ajax({
                type: 'post',
                url: '/services/downloadservice.asmx/GetUserData',
                dataType: 'json',
                contentType: 'application/json',
                success: callback
            });
        }
    });

    SPVimeoRegisterForm = SPRegisterForm.extend({
        formSubmitSuccess: function () {
            this.options.modal.formSubmitSuccess();
        }
    });

    SPDownloadComplete = SPModalPanel.extend({
        className: "formBox downloadComplete",

        template: Handlebars.templates.downloadComplete,

        initialize: function () {
            this.on('renderComplete', this.setSocialLinks);

        },

        setSocialLinks: function () {
            if (this.options.downloadInfo['data-url']) {
                var pageUrl = (window.location.protocol + "//" + window.location.hostname).concat(this.options.downloadInfo['data-url'].value || ""),
                    qString = this.getLinkedInQueryString();

                console.log(this.options.downloadInfo);

                var socialIcons = {
                    facebook: { $el: this.$el.find('.share.facebook'), url: 'http://facebook.com/sharer/sharer.php?u=' + pageUrl },
                    linkedIn: { $el: this.$el.find('.share.linkedin'), url: 'https://www.linkedin.com/shareArticle?mini=true&url=' + pageUrl + qString },
                    google: { $el: this.$el.find('.share.google'), url: 'https://plus.google.com/share?url=' + pageUrl },
                    twitter: { $el: this.$el.find('.share.twitter'), url: 'https://twitter.com/intent/tweet?url=' + pageUrl }
                };

                _.each(socialIcons, function (iconSet) {
                    iconSet.$el.attr('href', iconSet.url);
                }, this);
            }
        },

        getLinkedInQueryString: function () {
            var qString = "";
            qString += "&title=" + this.getAttributeValue('data-title');
            qString += "&summary=" + this.getAttributeValue('data-description');
            qString += "&source=" + this.getAttributeValue('data-url');
            return qString;
        },

        getAttributeValue: function (attributeName) {
            var fakeAttribute = { value: '' };
            return (this.options.downloadInfo[attributeName] || fakeAttribute).value;
        }
    });

    SPWatchVimeo = SPModalPanel.extend({
        className: "",

        template: Handlebars.templates.watchVimeo,

        formSubmitSuccess: function () {
            console.log("finish");
        },

        render: function () {
            this.el.innerHTML = this.template({ vimeoId: this.options.downloadInfo['data-vimeo'].value });

            var $frame = this.$el.find('iframe');
            $frame.fadeTo(0, 0);
            $frame.on('load', _.bind(function () {
                var player = $f($frame[0]);
                player.addEvent('play', _.bind(this.onPlay, this));
                $frame.fadeTo(700, 1);
            }, this));

            return this;
        },

        onPlay: function () {
            var videoTitle = this.options.downloadInfo['data-title'].value;

            spEngageTracking.trackCustom('webinar-a-view', videoTitle);
        }
    });

    SPEmailEntry = SPModalPanel.extend({
        template: Handlebars.templates.emailEntry,

        events: {
            "click input[type='submit']": "didClickSubmit",
            "click .cancelEmailEntry": "didClickCancel"
        },

        didClickSubmit: function (evt) {
            evt.preventDefault();
            var emailAddress = this.$el.find('[data-bind="emailAddress"]').val();
            silverpop.user.set('emailAddress', emailAddress);
            this.options.modal.openPanel('registerForm');
            spDispatch.trigger('didStartEmailRequest');
            $.ajax({
                type: "POST",
                url: "/Services/DownloadService.asmx/EmailAddressHasUser",
                cache: false,
                contentType: "application/json",
                data: JSON.stringify({ emailAddress: emailAddress }),
                dataType: "json",
                complete: _(this.didSubmitEmail).bind(this)
            });
        },

        didClickCancel: function (evt) {
            this.options.modal.openPanel('registerForm');
            evt.preventDefault();
        },

        didSubmitEmail: function (response) {
            spDispatch.trigger('didFinishEmailRequest');
            var data = JSON.parse(response.responseText).d;
            if (data.WasSuccessful) {
                silverpop.modalManager.updateFieldData();
            } else {
                // show error message
                this.options.modal.panels['registerForm'].didSubmitIncorrectEmail();
            }
        }

    });

    SPGatedVimeoEmailEntry = SPEmailEntry.extend({
        didSubmitEmail: function (response) {
            SPEmailEntry.prototype.didSubmitEmail.apply(this, arguments);

            var data = JSON.parse(response.responseText).d;
            if (data.WasSuccessful) {
                this.options.modal.formSubmitSuccess();
            }
        }
    });


    /** Register Field **/

    SPRegisterFields = SPModalProto.extend({
        __bbtype: "SPRegisterFields",

        template: Handlebars.templates.registerFields,

        initialize: function () {
            this.shouldShowEmail = false;
            spDispatch.on('didFinishEmailRequest', this.didFinishEmailRequest, this);
            spDispatch.on('didStartEmailRequest', this.didStartEmailRequest, this);
            spDispatch.on('willSocialSignIn', this.willSocialSignIn, this);
            spDispatch.on('didUpdateModals', this.didUpdateModals, this);
            spDispatch.on('didUpdateFieldsFromUser', this.didUpdateFieldsFromUser, this);
        },

        didUpdateFieldsFromUser: function () {
            this.render();
        },

        didUpdateModals: function () {
            this.render();
        },

        didStartEmailRequest: function () {
            this.shouldShowEmail = true;
            this.$el.find('.emailAjaxIndicator').show();
        },

        willSocialSignIn: function () {
            this.shouldShowEmail = true;
            this.$el.find('.emailAjaxIndicator').show();
        },

        didFinishEmailRequest: function () {
            this.$el.find('.emailAjaxIndicator').fadeOut(_(function () {
                this.shouldShowEmail = false;
            }).bind(this));
        },

        isVisible: function (type) {
            return (type !== "Hidden");
        },

        events: {
            "click input[type='submit']": "didClickSubmit",
        },

        updateFields: function () {
            _(this.fieldData.fields).each(function (field) {
                _(this.el.querySelectorAll('[data-field-name="' + field.fieldName + '"]')).each(function (element) {
                    field.fieldValue = $(element).find('input, select').first().val();
                }, this);
            }, this);
        },

        didClickSubmit: function (evt) {
            evt.preventDefault();
            var inputsAreValid = this.validateControls("input");
            var selectsAreValid = this.validateControls("select");

            if (inputsAreValid && selectsAreValid) {
                this.updateFields();
                this.sendFieldData();
            }
        },

        sendFieldData: function () {
            console.log("Modal: sending field data: \n\t", this.fieldData);
            this.$el.find('.fieldAjaxIndicator').fadeIn();
            var ajaxData = _(this.fieldData).extend({
                campaignId: (this.options.downloadInfo['data-campaignid'] || { value: "" }).value,
                campaignStatus: (this.options.downloadInfo['data-campaignstatus'] || { value: "" }).value,
                leadSource: (this.options.downloadInfo['data-leadsource'] || { value: "" }).value,
                promoCode: (this.options.downloadInfo['data-promocode'] || { value: "" }).value
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
        },

        sendSuccess: function (evt) {
            this.trigger('submitComplete');
            spDispatch.trigger('fieldDataSent');
        }, 

        validateControls: function (inputType) {
            var allValid = true;
            _(this.$el.find(inputType)).each(function (element) {
                var error = $(element).siblings('span.error');
                var valid = this.isValidInput(element);

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

        isValidInput: function (el) {
            var $el = $(el);

            if ($el.is("select")) {
                return this.isValidSelect(el);
            }
            else if ($el.is("input")) {
                return this.isValidTextInput(el);
            }

        },

        isValidTextInput: function (element) {
            var isValid = true;
            var $target = $(element);
            var required = $target.parents('[data-validate-required="true"]').length !== 0;
            var regex = $target.parents('[data-validate-regex]').length !== 0;
            var isNumber = $target.parents('[data-validate-number="true"]').length !== 0;

            if (required) {
                isValid = element.value.length !== 0;
            }

            if (isValid && regex) {
                var patternString = $target.parents('[data-validate-regex]')[0].attributes["data-validate-regex"].value;
                var pattern = new RegExp(patternString);
                isValid = element.value.match(pattern);
            }

            if (isValid && isNumber) {
                isValid = Number(element.value) !== NaN;
            }

            return isValid;
        },

        isValidSelect: function (element) {
            var $target = $(element);
            if ($target.parents('[data-validate-required="true"]').length !== 0) {
                return !!$target.val();
            }
            else {
                return true;
            }
        },

        render: function () {
            this.el.innerHTML = this.template(this);
            this.$el.find('.fieldAjaxIndicator').hide();
            if (!this.shouldShowEmail)
                this.$el.find('.emailAjaxIndicator').hide();
        }


    });

    /** User Model **/

    SPUser = Backbone.Model.extend({

        defaults: {
            firstName: '',
            email: '',
            recipientId: 0
        },

        parse: function (response) {
            this.set({
                firstName: response.d.firstName,
                email: response.d.email,
                recipientId: response.d.recipientId
            });

            this.updatePageData();
        },

        updatePageData: function () {
            var $hfData = $('#hfPageData'),
                currentData = '';

            if ($hfData.val()) {
                currentData = JSON.parse($hfData.val());
            }

            _(currentData).extend(this.attributes);

            $hfData.val(JSON.stringify(currentData));
        },

        initialize: function () {
            this.fetch();
        },

        fetch: function (callback) {
            var runCallbacks = _.bind(function (response) {
                this.parse(response);
                if (callback && typeof callback === 'function')
                    callback();
            }, this);

            $.ajax({
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                url: '/Services/UserService.asmx/Get',
                success: runCallbacks
            });
        }
    });


    /** handlebars **/
    Handlebars.registerHelper('call', function (method, context) {
        return method.call(context);
    });

    Handlebars.registerHelper('inputForType', function (field) {
        var element;
        var type = field.fieldType.type;

        if (type === "Text") {
            element = document.createElement('input');
            element.setAttribute('type', 'text');
            element.setAttribute('value', field.fieldValue)
        }
        else if (type === "Hidden") {
            element = document.createElement('input');
            element.setAttribute('type', 'hidden');
            element.setAttribute('value', field.fieldValue)
        }
        else if (type === "Select") {
            element = document.createElement('select');
            _(field.fieldType.options).each(function (optPair) {
                var opt = document.createElement('option');
                opt.setAttribute('value', optPair.Value);
                opt.innerHTML = optPair.Key;
                if(optPair.Value == field.fieldValue)
                {
                    opt.setAttribute('selected', 'selected');
                }
                element.appendChild(opt);
            }, this);
        }
        else {
            element = document.createElement('span');
            element.innerText = type;
        }

        if (field.isRequired)
            $(element).addClass('req');

        return element.outerHTML;
    });

})(jQuery);