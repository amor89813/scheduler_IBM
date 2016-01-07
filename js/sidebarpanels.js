/// <reference path="dev/_references.js" />

/*** MODELS ***/

SPSidebarAttributes = Backbone.Model.extend({
    getUrl: "/Services/SidebarService.asmx/GetSidebarAttributes",
    updateUrl: "/Services/SidebarService.asmx/UpdateSidebarAttributes",

    defaults: function () {
        return {
            name: null,
            industry: null,
            crmSystem: null,
            nameViewCount: 0,
            industryViewCount: 0,
            clientSuccessViewCount: 0,
            resourcesViewCount: 0,
            productResourcesViewCount: 0,
            demoViewCount: 0,
            hasViewedClientSection: false
        };
    },

    clearDefaults: function () {
        return {
            name: null,
            industry: null,
            crmSystem: null,
            nameViewCount: 0,
            industryViewCount: 0,
            clientSuccessViewCount: 0,
            resourcesViewCount: 0,
            productResourcesViewCount: 0,
            contactViewCount: 0,
            demoViewCount: 0,
            hasViewedClientSection: false
        };
    },

    initialize: function () {
        this.loadLocal();
        this.textProperties = new SPSidebarText();

        spDispatch.on('didUpdateModals', this.fetchSilent, this);
        spDispatch.on('shouldSaveSidebarAttributes', this.save, this);
        this.on('change', this.didChange, this);

        return this;
    },

    didChange: function () {
        this.saveLocal();
    },

    beginLoad: function () {
        this.textProperties.on('finishedLoading', this.fetch, this);
        this.textProperties.fetch();
        return this;
    },

    saveLocal: function () {
        localStorage.setItem('sidebarCache', JSON.stringify(this.toJSON()));
    },

    loadLocal: function () {
        var cached = localStorage.getItem('sidebarCache');
        if(cached) {
            this.set(JSON.parse(cached), { silent: true });
        }
    },

    fetchSilent: function () {
        $.ajax({
            url: this.getUrl,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: this.ajaxError,
            success: _(this.fetchSilentSuccess).bind(this),
        });
    },

    fetch: function () {
        $.ajax({
            url: this.getUrl,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: this.ajaxError,
            success: _(this.fetchSuccess).bind(this)
        });
        return this;
    },

    fetchSuccess: function (response) {
        console.log("Sidebar: applying new attributes \n\t", response.d);
        this.set(response.d);
        spDispatch.trigger('didUpdateSidebar');
        return this;
    },

    fetchSilentSuccess: function (response) {
        this.set(response.d);
        return this;
    },

    save: function () {
        var ajaxData = {
            sidebarAttributes: this.toJSON()
        };
        console.log("Sidebar: sending attributes \n\t", ajaxData.sidebarAttributes);
        $.ajax({
            url: this.updateUrl,
            type: 'POST',
            data: JSON.stringify(ajaxData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            error: _(this.ajaxError).bind(this),
            success: _(this.saveSuccess).bind(this)
        });
        return this;
    },

    saveSuccess: function (response) {
        console.log("Sidebar: applying new attributes \n\t", response.d);
        this.set(response.d, { silent: true });
        spDispatch.trigger('updateSidebarWhitepaper');
        return this;
    },

    ajaxError: function () {
        return this;
    },

    trimmedWhitepaperTitle: function () {
        var title = this.get('whitepaperTitle') || "";
        if (title.length > 40) {
            title = title.slice(0, 40);
            title += "...";
        }
        return title;
    }
});

SPSidebarText = Backbone.Model.extend({

    defaults : {
        clientSuccessPrompt: "",
        contactText: "",
        industryLink: "",
        industryPrompt: "",
        namePrompt: "",
        resourcesPrompt: "",
        resourcesPromptViewed: "",
        titleText: ""
    },

    getUrl: "/Services/SidebarService.asmx/GetSidebarText",

    initialize: function () {
        this.loadLocal();
        this.on('change', this.saveLocal, this);
        this.industries = new SPSidebarIndustryList();
        this.crmSystems = new SPSidebarCRMSystemList();
    },

    saveLocal: function () {
        localStorage.setItem('sidebarTextProperties', JSON.stringify(this.toJSON()));
    },

    loadLocal: function () {
        var cachedJSON = localStorage.getItem('sidebarTextProperties');
        if (cachedJSON) {
            this.set(JSON.parse(cachedJSON), { silent: true });
        }
    },

    fetch: function () {
        $.ajax({
            url: this.getUrl,
            type: 'POST',
            success: _(this.fetchSuccess).bind(this),
            error: _(this.ajaxError).bind(this),
            contentType: 'application/json'
        });
        return this;
    },

    fetchSuccess: function (response) {
        this.industries.add(response.d.industries);
        this.crmSystems.add(response.d.crmSystems);
        delete response.d.industries;
        delete response.d.crmSystems;
        this.set(response.d);
        this.trigger('finishedLoading');
        return this;
    },

    ajaxError: function (response) {
        console.error("Error getting sidebar text from server \n\t", response);
        return this;
    }

});

SPSidebarIndustry = Backbone.Model.extend({

});

SPSidebarIndustryList = Backbone.Collection.extend({
    model: SPSidebarIndustry
});

SPSidebarCRMSystem = Backbone.Model.extend({
    defaults: {
        demoText: "default demo text",
        productResourcesPrompt: "default product resource prompt"
    }
});

SPSidebarCRMSystemList = Backbone.Collection.extend({
    model: SPSidebarCRMSystem,

    getByName: function (name) {
        return _(this.select(function (crmSystem) {
            return crmSystem.get('name') === name;
        })).first();
    }
});

/*** VIEWS ***/


SPSidebarPanelWrapper = Backbone.View.extend({

    initialize: function () {
        this.forceLoadingPanel = false;
        this.$el.hide();
        this._initPanels();
        this.modelChangeCount = 0;

        this.model.on('change', this.didChangeModel, this);
        this.model.textProperties.on('change', this.didChangeTextProperties, this);
        this.model.on('change:name', this.didChangeName, this);
        spDispatch.on('didUpdateModals', this.queueRender, this);
        spDispatch.on('didClickSidebarLink', this.didClickSidebarLink, this);
        this._clientPageCheck();
        _(this._incrementCurrent).chain().bind(this).delay(1000).value();
    },

    queueRender: function () {
        _(function () {
            this.render();
        }).chain().bind(this).defer().value();
    },

    didChangeModel: function () {
        console.log('Sidebar: attributes change count ', this.modelChangeCount);
        this.modelChangeCount++;
        this.render();
    },

    didChangeTextProperties: function () {
        this.render();
    },

    render: function () {
        this._closeOpenPanels();
        var activePanel = this._determinePanel();
        this.panels[activePanel].render().show();
        spDispatch.trigger('didChangePanel');
        return this;
    },

    didChangeName: function () {
        spDispatch.trigger('didChangeFirstName', this.model.get('name'));
    },

    openPanel: function (sidebarPanel) {
        this._closeOpenPanels();
        try {
            this.panels[sidebarPanel.panelKey].show();
            this._triggerRefresh();
        }
        catch (e) {
            console.group("error opening panel with name: ", panelName);
            console.log(e.message);
            console.groupEnd();
        }
    },

    didClickSidebarLink: function () {
        this.forceLoadingPanel = true;
    },

    _clientPageCheck: function () {
        if (window.location.href.indexOf('/Clients/') !== -1)
            this.model.set('hasViewedClientSection', true);
        return this;
    },

    _initPanels: function () {
        this.panels = {
            name: new SPSidebarPanelName({ model: this.model }),
            industry: new SPSidebarPanelIndustry({ model: this.model }),
            clientSuccess: new SPSidebarPanelClientSuccess({ model: this.model }),
            resources: new SPSidebarPanelResources({ model: this.model }),
            productResources: new SPSidebarPanelProductResources({ model: this.model }),
            demo: new SPSidebarPanelDemo({ model: this.model }),
            contact: new SPSidebarPanelContact({ model: this.model }),
            loading: new SPSidebarPanelLoading({ model: this.model })
        }
        _(this.panels).each(function (panel, panelName) {
            this.el.appendChild(panel.el);
            panel.on('refresh', this._triggerRefresh, this);
            panel.on('forceOpen', this.openPanel, this);
        }, this);
        return this;
    },

    _incrementCurrent: function () {
        var panelKey = this._determinePanel();
        this.panels[panelKey]._incrementViewCount();
        this._closeAllPanels();
        this.panels[panelKey].show();
        _(function () {
            this.$el.slideDown(function () {
                $(this).addClass('opened');
            });
        }).chain().bind(this).defer().value();
    },

    _triggerRefresh: function () {
        this.trigger('refresh');
        return this;
    },

    _closeOpenPanels: function () {
        _(this.panels).each(function (panel) {
            if (!panel.$el.is(".opened")) {
                panel.hide();
                panel.$el.removeClass('opened');
            }
        });
        return this;
    },

    _closeAllPanels: function () {
        _(this.panels).each(function (panel) {
            panel.$el.removeClass('opened');
            panel.hide();
        }, this);
    },

    _determinePanel: function () {
        if (this.forceLoadingPanel) {
            return "loading";
        }
        else if (this.modelChangeAcount === 0) {
            return "loading";
        }

        var hasIndustry = (this.model.get('industry') !== "(Select One)" && !!this.model.get('industry'));
        var hasName = !!this.model.get('name');
        var hasCRM = (this.model.get('crmSystem') !== "(Select One)" && !!this.model.get('crmSystem'));

        var bypassName = (this.model.get('nameViewCount') > 2);
        var bypassIndustry = (this.model.get('industryViewCount') > 2);
        var bypassClientSuccess = (this.model.get('clientSuccessViewCount') > 2);
        var bypassResources = (this.model.get('resourcesViewCount') > 2);
        var bypassProductResources = (this.model.get('productResourcesViewCount') > 2);
        var bypassDemo = (this.model.get('demoViewCount') > 2);

        var reachesName = (!hasName && !bypassName);
        var reachesIndustry = (!reachesName && !hasIndustry && !bypassIndustry);
        var reachesClientSuccess = (!reachesIndustry && !bypassClientSuccess);
        var reachesResources = (!reachesClientSuccess && !bypassResources);
        var reachesProductResources = (!reachesResources && !bypassProductResources);
        var reachesDemo = (!reachesProductResources && !bypassDemo);

        if (reachesName)
            return "name";
        else if (reachesIndustry)
            return "industry";
        else if (reachesClientSuccess)
            return "clientSuccess";
        else if (reachesResources)
            return "resources";
        else if (reachesProductResources)
            return "productResources";
        else if (reachesDemo)
            return "demo";
        else
            return "contact";

    }

});

SPSidebarPanel = SPView.extend({

    panelKey: "default",

    template: _.template(''),

    templatePath: "/js/templates/sidebarPanels/name.html",

    initialize: function () {
        this.model.on('change', this.render, this);
        this._loadTemplate();
    },

    events: {
        "click a": "_didClickLink",
        "click [data-bb='genericModal']": "_didClickOpenGenericModal"
    },

    _didClickLinkNoLoading: function () {
        this.model.set(this.panelKey + 'ViewCount', 4);
        return this;
    },

    _didClickLink: function (evt) {
        spDispatch.trigger('didClickSidebarLink');
        this.model.set(this.panelKey + 'ViewCount', 4);
        return this;
    },

    _didClickOpenGenericModal: function () {
        silverpop.modalManager.createGenericModal({
            content: "Generic Modal Test Content"
        });
    },

    didChangeIndustry: function (evt) {
        var indText = $(evt.currentTarget).find('option:selected').attr('value');
        indText = indText.replace('(Select One)', '');
        this.model.set('industry', indText);
        spDispatch.trigger('shouldSaveSidebarAttributes');
        return this;
    },

    show: function () {
        this.$el.show();
        return this;
    },

    hide: function () {
        clearTimeout(this.timeout);
        this.$el.hide();
        return this;
    },

    render: function () {
        this.el.innerHTML = this.template();
        this.trigger('render');
        return this;
    },

    forceOpen: function () {
        this.trigger('forceOpen', this);
        return this;
    },

    _incrementViewCount: function () {
        var attr = this.panelKey + "ViewCount";
        this.model.set(attr, this.model.get(attr) + 1);
        console.log('incremented ' + attr + ' to ' + this.model.get(attr));
    },

    _loadTemplate: function () {
        $.get(this.templatePath, _(this._parseTemplate).bind(this), 'html');
        return this;
    },

    _parseTemplate: function (response) {
        this.template = _.template(this._cleanTemplate(response));
        this.render();
        return this;
    },

    _cleanTemplate: function (dirty) {
        var clean = dirty.replace(/\<\!\[CDATA\[/g, '').replace(/]]>/g, '').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\/js\/templates\/sidebarPanels\//g, "");
        return clean;
    }

});

SPSidebarPanelName = SPSidebarPanel.extend({

    panelKey: "name",

    templatePath: "/js/templates/sidebarPanels/name.html",

    events: _(SPSidebarPanel.prototype.events).chain().clone().extend({
        "change .firstName": "_didChangeFirstName",
        "click [data-modal]": "_didClickOpenLink",
        "click .sidebarNameSubmit": "_didChangeFirstName"
    }).value(),

    _didChangeFirstName: function (evt) {
        evt.preventDefault();
        this.model.set('name', evt.currentTarget.value);
        this.app.user.set('firstName', evt.currentTarget.value);
        spDispatch.trigger('shouldSaveSidebarAttributes');
        return this;
    },
    
    _didClickOpenLink: function (evt){
        var propertyName = evt.currentTarget.attributes["data-modal"].value;
        silverpop.modalManager.createGenericModal({
            content : this.model.textProperties.get(propertyName)
        });
    }
});

SPSidebarPanelIndustry = SPSidebarPanel.extend({

    panelKey: "industry",

    templatePath: "/js/templates/sidebarPanels/industry.html",

    events: _(SPSidebarPanel.prototype.events).chain().clone().extend({
        "change .industrySelect": "didChangeIndustry"
    }).value(),

    render: function (evt) {
        SPSidebarPanel.prototype.render.call(this);
        this.$el.find('.industrySelect').val(this.model.get('industry'));
        return this;
    }
});

SPSidebarPanelClientSuccess = SPSidebarPanel.extend({

    panelKey: "clientSuccess",

    templatePath: "/js/templates/sidebarPanels/clientSuccess.html",

    initialize: function () {
        SPSidebarPanel.prototype.initialize.apply(this, arguments);
        spDispatch.on('updateSidebarWhitepaper', this.updateSidebarWhitepaper, this);
    },

    updateSidebarWhitepaper: function () {
        this.render();
    },

    events: _(SPSidebarPanel.prototype.events).chain().clone().extend({
        "change .industrySelect": "didChangeIndustry",
        "click .fakeLink": "_didClickLinkNoLoading"
    }).value(),

    render: function () {
        SPSidebarPanel.prototype.render.call(this);
        this.$el.find('.industrySelect').val(this.model.get('industry'));

        _(this.initWhitepaperButton).chain().bind(this).defer(this).value();
        return this;
    },

    initWhitepaperButton: function (evt) {
        silverpop.modalManager.addDownloadButton(this.$el.find('.launchDownload')[0]);
    }

});

SPSidebarPanelResources = SPSidebarPanel.extend({

    panelKey: "resources",

    templatePath: "/js/templates/sidebarPanels/resources.html"

});

SPSidebarPanelProductResources = SPSidebarPanel.extend({

    panelKey: "productResources",

    templatePath: "/js/templates/sidebarPanels/productResources.html",

    events: _(SPSidebarPanel.prototype.events).chain().clone().extend({
        "change .crmSelect": "didChangeCRM"
    }).value(),

    didChangeCRM: function (evt) {
        this.model.set('crmSystem', evt.currentTarget.value);
        spDispatch.trigger('shouldSaveSidebarAttributes');
        return this;
    },

    render: function () {
        SPSidebarPanel.prototype.render.call(this);
        var crmSystem = this.model.get('crmSystem');
        this.$el.find('.crmSelect').val(crmSystem);
        this.$el.find('.crmText').hide();
        this.$el.find('[data-crm="' + crmSystem + '"]').show();
        return this;
    }
});

SPSidebarPanelDemo = SPSidebarPanel.extend({

    panelKey: "demo",

    templatePath: "/js/templates/sidebarPanels/demo.html",

    render: function () {
        SPSidebarPanel.prototype.render.call(this);
        this.$el.find('.crmDemoText').hide();
        var crmSystem = this.model.get('crmSystem');
        if (crmSystem !== "(Select One)" && crmSystem) {
            this.$el.find('[data-crm="' + crmSystem + '"]').show();
        }
        else {
            this.$el.find('[data-crm]').last().show();
        }
        return this;
    }

});

SPSidebarPanelContact = SPSidebarPanel.extend({

    panelKey: "contact",

    templatePath: "/js/templates/sidebarPanels/contact.html"

});

SPSidebarPanelLoading = SPSidebarPanel.extend({

    panelKey: "loading",

    templatePath: "/js/templates/sidebarPanels/loading.html"

});

var spSidebarIncrementQueue = null;

/*******/

