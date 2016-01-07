(function ($) {
    AjaxQueue = Backbone.Model.extend({
        defaults: {
            async: true
        },

        initialize: function () {
            _.bindAll(this);
            this.runAjaxRequest = $.ajax;
            $.ajax = this.ajax;
        },

        ajax: function (opts) {
            var call = _.bind(function () {
                var callback = _.bind(function () {
                    if (this.queue.length > 0) {
                        this.queue.pop()();
                    } else {
                        _(function () {
                            this.runEmptyCallbacks();
                        }).chain().bind(this).defer().value();
                    }
                }, this);

                this.runAjaxRequest(opts).done(callback);
            }, this);

            _(function () {
                this.queue.push(call);

                _(this.queue).last()();

                console.log("Pushed ajax ", this.queue, this.queue.length);
            }).chain().bind(this).defer().value();

            return this;
        },

        isEmpty: function () {
            return this.queue.length == 0;
        },

        addEmptyCallback: function (callback) {
            this.emptyCallbacks.push(callback);
        },

        runEmptyCallbacks: function () {
            while (this.emptyCallbacks.length > 0)
                this.emptyCallbacks.pop()();
        },

        runAjaxRequest: null,

        emptyCallbacks: [],

        queue: []
    });

    $.fn.ajaxQueue = function () {
        window.ajaxQueue = new AjaxQueue();
    }
}(jQuery));