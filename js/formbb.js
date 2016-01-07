SPFormView = Backbone.View.extend({
    initialize: function () {
        this.setElement($('.engageForm:visible')[0]);
        this.populateModel();
    },

    events: {
        "click #Submit": "didClickSubmit"
    },

    populateModel: function () {
        var redirectUrl = $('[data-attr="formRedirect"]').val();
        var attributes = {
            eventName: this.$el.find('[id$="hfEventName"]').val(),
            redirectUrl: redirectUrl,
            listId: this.$el.find('[id$="hfListId"]').val(),
            validationGroup: this.$el.find('[id$="hfValGroup"]').val()
        };

        this.model.set(attributes);
    },

    didClickSubmit: function (e) {
        e.preventDefault();
        
        var that = this,
            result = null;

        // If client-side validation fails, return
        if (typeof Page_ClientValidate === 'function') {
            if (!Page_ClientValidate()) {
                return;
            }
        }

        // Hide the submit button
        this.$el.find('#Submit').hide();

        // Display loading spinner
        this.$el.find('.finish').show();

        // Submit the form data
        this.model.submit(null, success, error.bind(this));

        function success() {
            // TODO: the Engage Tracking script can be severely refactored. We should speak to the client first because
            // I could probably spend 5 hours refactoring. The trackForm() method makes an AJAX request and schedules a redirect
            // for sometime in the future. -Cal 1/7/2015
            spEngageTracking.trackForm();
        }

        function error() {
            alert('There was an error saving your preferences. Please refresh the page and try again. Thank you.');

            // Hide loading spinner
            this.$el.find('.finish').hide();
            $('.finish').removeClass('redirect');

            // Show the submit button
            this.$el.find('#Submit').show();
        }
    },

    inputs: function () {
        var sel = '[class!="contactList"] input[data-name][type!="label"][type!="image"][type!="hidden"][type!="radio"], select:visible';
        var selRadioButtons = '[type="radio"]:checked';
        var selSpecialHiddenFields = 'input[type="hidden"][data-name]';
        var inputList = _.zip(this.$el.find(sel), this.$el.find(selRadioButtons), this.$el.find(selSpecialHiddenFields));
        return _(inputList).chain().flatten().compact().value();
    },

    start: function () {
        this.$el.find('#Submit').show();
        this.$el.find('.finish').hide();
    },

    finish: function (result) {
        if (!result.showSuccess) {
            $('.finish').addClass('redirect');
        }

        this.$el.find('#Submit').hide();
        this.$el.find('.finish').show();
    }
});

SPFormHandler = Backbone.Model.extend({
    defaults: {
        eventName: null,
        redirectUrl: null,
        listId: null,
        validationGroup: null
    },

    initialize: function () {
        this.formView = new SPFormView({ model: this });
    },

    validate: function () {
        if (typeof (Page_ClientValidate) == 'function')
            Page_ClientValidate(this.get('validationGroup'));
        else return true;

        return Page_IsValid;
    },

    inputs: function () {
        return this.formView.inputs();
    },

    getValues: function () {
        var values = [];
        _.each(this.inputs(), function (el, idx, list) {
            var $el = $(el),
                id = $el.attr('id'),
                name = $el.attr('data-name') || $(el).parents('[data-form="engageField"]').find('[id$="hfEngageFieldName"]').val(),
                val = ($el.attr('type') == 'checkbox') ? $el.prop('checked') : $el.val(),
                ishidden = ($el.attr('type') == 'hidden');

            if (val === true)
                val = "Yes";
            else if (val === false)
                val = "No";

            values.push({
                id: id,
                name: name,
                val: val,
                ishidden: ishidden
            });
        }, this);
        return values;
    },

    getCheckedContactLists: function () {
        var values = [];
        _.each(this.contactLists(), function (el, idx, list) {
            var isChecked = $(el).find('input[type="checkbox"]').prop('checked') === true,
                listId = $(el).attr('data-list');
            values.push({
                listId: listId,
                shouldAdd: isChecked
            });
        }, this);
        return values;
    },

    isEmpty: function () {
        return this.inputs().length == 0;
    },

    contactLists: function () {
        return $('.contactList li > span');
    },

    inputsToJSON: function () {
        return JSON.stringify({
            listId: this.get('listId'),
            data: JSON.stringify(this.getValues())
        });
    },

    contactListToJSON: function () {
        spDispatch.trigger('shouldFollowFormRedirect');
        return JSON.stringify(this.getCheckedContactLists());
    },

    updateData: function (contactData) {
        var url = "/Services/DownloadService.asmx/UpdateData";
        var data = { formData: contactData };

        return this.doPOST({ url: url, data: data});
    },

    updateContactData: function (contactLists) {
        var url = "/Services/DownloadService.asmx/UpdateContactData";
        var data = { contactData: contactLists };

        return this.doPOST({ url: url, data: data});
    },

    /**
     * Wrapper around jQuery's POST request with added error handling to
     * ignore JSON parsing errors (occur for empty responses).
     */
    doPOST: function (options) {
        var deferred = Q.defer();

        $.ajax({
            type: "POST",
            url: options.url,
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(options.data),
            dataType: 'json',
            success: deferred.resolve,
            error: error
        });

        function error (err) {
            // Ignore failures with a 200 status code
            if (err.status === 200) deferred.resolve();

            // Otherwise, reject our deferred promise
            else deferred.reject(err);
        }

        return deferred.promise;
    },

    submitWithoutValidation: function (success, error) {
        return this.submit(true, success, error);
    },

    submit: function (bypassValidation, success, error) {
        var hasRedirect = !!this.get('redirectUrl'),
            result = {};
        
        var inputData = this.inputsToJSON(),
            contactData = this.contactListToJSON();

        if (!bypassValidation && !this.validate && error) {
            result.wasSuccessful = false;
            result.showSuccess = !hasRedirect;
            error(result);
            return;
        }

        // Update Engage data
        var that = this;
        this.updateData(inputData)
        .then(function () {
            return that.updateContactData(contactData);
        })
        .then(function () {
            result.wasSuccessful = true;
            result.data = that;
            result.showSuccess = !bypassValidation || !hasRedirect;
            if (success) success(result);
        })
        .catch(function (msg) {
            result.wasSuccessful = false;
            result.showSuccess = !hasRedirect;
            if (error) error(result);
        })
        .done();
    },
});