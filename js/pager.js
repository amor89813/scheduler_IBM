SPPager = Backbone.View.extend({
    $pager: null,
    pager: null,
    $list: null,
    $lEllipsis: null,
    $rEllipsis: null,

    options: {
        pageSize: 10,
        textAttr: null,
        pagerClass: 'pagination',
        idxMultiplier: 0,
        maxPages: 5,
        truncatePager: false,
        onPageChange: function() {}
    },

    events: {
        "click .page": "didClickPage"
    },

    initialize: function () {
        this.$el.wrap('<div class="pager" />');
        this.createPager();

        this.$list = this.$el;
        this.$el = this.$el.parent('.pager');
        this.delegateEvents();

        this.goToPage(0);
    },

    createPager: function () {
        this.$pager = this.createPageContainer();
        this.pager = this.$pager[0];
        this.createPageLinks();
    },

    createPageContainer: function () {
        return this.$pager ||
            $(this.pagerTemplate({ pagerClass: this.options.pagerClass })).insertBefore(this.$el);
    },

    createPageLinks: function () {
        _.each(this.getPages(), function (el, idx) {
            var text = this.options.textAttr ? el.first().attr(this.options.textAttr) : String(idx + 1);
            this.$pager.append(this.pagerItemTemplate({ text: text, idx: idx }));
        }, this);
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
        
    },

    getPages: function () {
        var pages = [],
            idx = 0;

        do {
            pages.push(this.$el.find('> li').slice((idx * this.options.idxMultiplier), ((idx * this.options.pageSize) + this.options.pageSize)));
            idx += 1;
        } while((idx * this.options.pageSize) < this.$el.find('> li').length);

        return pages;
    },

    didClickPage: function (e) {
        e.preventDefault();

        var $button = $(e.currentTarget),
            pageIdx = parseInt($button.attr('data-page'));

        this.goToPage(pageIdx);
    },

    goToPage: function (idx) {
        this.$list.find('> li').hide().slice((idx * this.options.pageSize), ((idx * this.options.pageSize) + this.options.pageSize)).show();
        this.$pager.find('a').removeClass('active');
        this.$pager.find('a').eq(idx).addClass('active');

        if(this.options.truncate)
            this.truncatePageList();

        this.options.onPageChange();
    },

    pagerTemplate: _.template('<div class=<%= pagerClass %>></div>'),
    pagerItemTemplate: _.template('<a href="#" class="page" data-page=<%= idx %>><%= text %></a>')
});