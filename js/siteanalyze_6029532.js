var _sz = _sz || [];
_sz.push(["accountid", 6029532]);
var _sz = _sz || [];
(function(k, b, h, j) {
    var a = {
        curr: window.location.href,
        ref: b.referrer,
        esc: function(d) {
            return encodeURIComponent(new String(d).replace(/(\r?\n)+/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, ""))
        },
        empty: function(d) {
            return (d == j || d == null || d == "")
        },
        tag: function(d) {
            return (b.getElementsByTagName) ? b.getElementsByTagName(d) : []
        },
        id: function(d) {
            return (b.getElementById) ? b.getElementById(d) : false
        },
        clone: function(m) {
            var l = {};
            for (var d in m) {
                if (m.hasOwnProperty(d)) {
                    l[d] = m[d]
                }
            }
            return l
        },
        rnd: function() {
            return Math.floor(Math.random() * 100000)
        },
        txt: function(d) {
            return (d.textContent) ? d.textContent : d.innerText
        },
        uuid: function() {
            var d = function() {
                return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
            };
            return (d() + d() + "-" + d() + "-" + d() + "-" + d() + "-" + d() + d() + d())
        },
        navtime: function() {
            return (k.performance) ? (new Date).getTime() - performance.timing.navigationStart : null
        },
        _isready: false,
        _readyhandlers: [],
        register: function(l, d) {
            d.base = this.actions[l];
            this.actions[l] = d
        },
        actions: {},
        action: function(l, d) {
            this.actions[l].apply(this.actions, d)
        },
        data: [],
        ready: function(d) {
            if (d === j) {
                return this._isready || a.done()
            } else {
                this.when(this.ready, d)
            }
        },
        done: function() {
            return (this._isloaded && b && b.body != null && (b.readyState == "interactive" || b.readyState == "complete"))
        },
        _isloaded: false,
        when: function(d, l) {
            d() ? l() : setTimeout(function() {
                a.when(d, l)
            }, 50)
        },
        fmt: function() {
            var d = Array.prototype.slice.call(arguments);
            var o = d[0];
            var l = d.slice(1);
            for (var m = 0; m < l.length; m++) {
                var n = new RegExp("\\{" + m + "\\}", "gm");
                o = o.replace(n, l[m])
            }
            return o
        },
        listen: function(d, l) {
            if (d.addEventListener) {
                d.addEventListener("mousedown", l, false)
            } else {
                if (d.attachEvent) {
                    d.attachEvent("onmousedown", l)
                }
            }
        },
        load: function(l) {
            var m = b.createElement("script");
            m.type = "text/javascript";
            m.async = true;
            m.src = l;
            var d = b.getElementsByTagName("script")[0];
            d.parentNode.insertBefore(m, d)
        },
        global: function(d) {
            return (k[d] !== j && k[d] !== null) ? k[d] : null
        },
        _images: [],
        _idx: 0,
        requesturl: function(m, l) {
            var n = [];
            l.rnd = h.core.rnd();
            for (d in l) {
                if (this.empty(l[d])) {
                    continue
                }
                n.push(d + "=" + this.esc(l[d]))
            }
            var d = this._idx++,
                q = m + "?" + n.join("&");
            return q
        },
        request: function(l, d) {
            var m = this.requesturl(l, d);
            this._images[e] = new Image();
            this._images[e].src = "//" + m;
            this.log("Requesting {0}", m)
        },
        _logqueue: [],
        _logshown: false,
        log: function() {
            this._logqueue.push({
                type: "msg",
                msg: Array.prototype.slice.call(arguments)
            });
            if (this._logshown) {
                this.showlog()
            }
        },
        warn: function() {
            this._logqueue.push({
                type: "warn",
                msg: Array.prototype.slice.call(arguments)
            });
            if (this._logshown) {
                this.showlog()
            }
        },
        showlog: function() {
            this._logshown = true;
            var m = b.getElementById("szdebugarea");
            if (m) {
                m.parentNode.removeChild(m)
            }
            a.cookie("szngdebug", 1);
            var q = "";
            for (var n = 0; n < this._logqueue.length; n++) {
                var p = this._logqueue[n];
                q += '<p style="padding:8px;margin:0;margin-bottom:8px;background:#' + (p.type == "msg" ? "FFF7C9" : "ca0000;color:white") + ';">' + ((p.type == "warn") ? "<b>Warning:</b> " : "") + decodeURIComponent(new String(this.fmt.apply(this, p.msg)).replace(/(&[a-z_]+=|\?)/g, "<br />&nbsp;&nbsp;&nbsp;$1")) + "</p>"
            }
            var l, d;
            d = b.createElement("a");
            d.href = "#";
            d.innerHTML = "\u00D7 Close";
            d.style.cssText = "display:block;float:right;color:black;text-decoration:none;";
            d.onclick = function(o) {
                l.parentNode.removeChild(l);
                a._logshown = false;
                a.cookie("szngdebug", null);
                return false
            };
            l = b.createElement("div");
            l.style.cssText = "position:fixed;top:10px;right:10px;background:white;border:1px #ccc solid;width:800px;padding:20px;padding-bottom:10px;font-size:12px;font-family:Arial;line-height:135%;max-height:90%;overflow-y:auto;text-align:left;z-index:999";
            l.innerHTML = q;
            l.id = "szdebugarea";
            l.appendChild(d);
            b.body.appendChild(l)
        },
        cookie: function(t, y, u) {
            if (typeof y != "undefined") {
                u = u || {
                    path: "/"
                };
                if (y === null) {
                    y = "";
                    u.expires = -1
                }
                var r = "";
                if (u.expires && (typeof u.expires == "number" || u.expires.toUTCString)) {
                    var p;
                    if (typeof u.expires == "number") {
                        p = new Date();
                        p.setTime(p.getTime() + (u.expires * 24 * 60 * 60 * 1000))
                    } else {
                        p = u.expires
                    }
                    r = "; expires=" + p.toUTCString()
                }
                var w = u.path ? "; path=" + (u.path) : "; path=/";
                var q = u.domain ? "; domain=" + (u.domain) : "";
                var x = u.secure ? "; secure" : "";
                b.cookie = [t, "=", encodeURIComponent(y), r, w, q, x].join("")
            } else {
                var m = null;
                if (b.cookie && b.cookie !== "") {
                    var l = b.cookie.split(";");
                    for (var s = 0; s < l.length; s++) {
                        var d = l[s].replace(/^\s+|\s+$/g, "");
                        if (d.substring(0, t.length + 1) == (t + "=")) {
                            m = decodeURIComponent(d.substring(t.length + 1));
                            break
                        }
                    }
                }
                return m
            }
        }
    };
    a.register("set", function(l, o) {
        var m = l.split("."),
            n = h,
            d;
        while (m.length > 0) {
            d = m.shift();
            if (n[d] === j) {
                n = 0;
                break
            }
            if (m.length == 0) {
                break
            }
            n = n[d]
        }(n && d) ? n[d] = o: a.warn("No property named {0}", l)
    });
    a.register("register", function(d) {
        a.register(d[0], d[1])
    });
    a.register("custom", function(l, n) {
        var m = "Running custom function";
        if (n && n != "") {
            m += ": <strong>" + n + "</strong>"
        }
        a.log(m);
        try {
            l()
        } catch (d) {
            a.warn("Custom function failed! " + d.message)
        }
    });
    a.register("setcurr", function(d) {
        a.curr = d
    });
    a.register("setref", function(d) {
        a.ref = d
    });
    a.register("loaded", function() {
        a._isloaded = true
    });
    a.register("showlog", function() {
        a.showlog()
    });

    function g(d) {
        var l = d[0];
        if (a.actions[l] === j) {
            a.action("set", d)
        } else {
            a.action(l, d.slice(1))
        }
    }
    var c = [];
    var f = [];
    for (var e = 0; e < h.length; e++) {
        c[e] = h[e];
        f[e] = h[e]
    }
    a.data = c;
    a.ready(function() {
        for (var d = 0; d < f.length; d++) {
            g(f[d])
        }
        while (a._readyhandlers.length > 0) {
            _readyhandlers.shift().call()
        }
        a._isready = true
    });
    h.push = function(d) {
        a.data.push(d);
        a.ready() ? g(d) : a.data.push(d)
    };
    h.core = a
})(window, document, _sz);
(function(o, a, m, n) {
    var h = {
        url: o.location.href,
        ref: a.referrer,
        title: a.title,
        res: o.screen.width + "x" + o.screen.height,
        accountid: null,
        groups: null,
        session: null,
        path: null,
        hits: null,
        sw: null,
        ct: null,
        ft: null,
        guid: null,
        uid: null,
        cid: null,
        cvid: null,
        rt: m.core.navtime(),
        prev: null,
        useurl: null,
        ourl: null,
        luid: m.core.uuid(),
        feedbackid: null,
        addcid: null
    };
    m.analytics = {
        config: {
            cantrack: true,
            noonclick: false,
            ready: true
        },
        cookie: {
            name: "nmstat",
            domain: a.domain
        },
        endpoint: {
            host: "us2",
            domain: "siteimprove.com",
            path: "image.aspx",
            fullpath: function(d, p) {
                if (!p) {
                    p = d;
                    d = this.host
                }
                return (d || this.host) + "." + this.domain + "/" + (p || this.path)
            }
        },
        state: {
            requested: false,
            requestTime: new Date()
        },
        opts: function(d) {
            return h[d]
        }
    };

    function f() {
        if (m.analytics.config.cantrack) {
            var d = m.core.cookie(m.analytics.cookie.name);
            if (!d) {
                var d = (new Date()).getTime() + m.core.rnd();
                m.core.cookie(m.analytics.cookie.name, d, {
                    expires: 1000,
                    domain: m.analytics.cookie.domain
                })
            }
            return d
        } else {
            return ""
        }
    }

    function k(p, d) {
        d.prev = f();
        m.core.request(p, d)
    }

    function l(p, d) {
        d.prev = f();
        return m.core.requesturl(p, d)
    }

    function j(d) {
        if (!m.analytics.config.cantrack) {
            return
        }
        var p = function(v) {
            try {
                if (r.href == null || r.href == "" || r.href.toLowerCase().indexOf("javascript:") == 0 || r.href.indexOf("#") == 0 || r.href.charAt(r.href.length - 1) == "#" || r.href == o.location.href || r.href.indexOf(o.location.href + "#") == 0) {
                    return true
                }
                if (!(d instanceof Array)) {
                    return false
                }
                for (var u = 0; u < d.length; u++) {
                    if (v.indexOf(d[u]) !== -1) {
                        return true
                    }
                }
                return false
            } catch (t) {
                return true
            }
        };
        var s = m.core.tag("a");
        for (var q = 0; q < s.length; q++) {
            var r = s[q];
            if (p(r.href)) {
                continue
            }(function(t) {
                m.core.listen(t, function() {
                    m.push(["request", {
                        ourl: t.href,
                        ref: o.location,
                        autoonclick: 1
                    }])
                })
            })(r)
        }
    }

    function e() {
        if (!m.core.empty(h.guid)) {
            return
        }
        var d = m.core.global("guid");
        if (!d) {
            for (var p = 0; p < a.forms.length; p++) {
                var q = a.forms[p].action.toString().toUpperCase();
                if (~q.indexOf("NRNODEGUID")) {
                    d = q.substr(q.indexOf("NRNODEGUID") + 11);
                    if (d.indexOf("%7B") == 0) {
                        d = d.substr(3, d.indexOf("%7D") - 3)
                    }
                    m.core.log("Found nrnodeguid: {0}", d);
                    break
                }
            }
        }
        h.guid = d
    }

    function g(q, d) {
        var p = m.core.global(q);
        if (p) {
            if (d && d in h) {
                h[d] = p
            } else {
                if (typeof p == "object") {
                    m.push(["param", p])
                } else {
                    m.core.warn("Nowhere to put legacy {0} (key {1}, value {2})", q, d, p)
                }
            }
        }
    }
    var b = 0;

    function c(p, d, q) {
        return {
            aid: h.accountid,
            luid: h.luid,
            c: p,
            a: d,
            l: q,
            cid: h.cid,
            cvid: h.cvid,
            o: ++b,
            d: Math.round((new Date() - m.analytics.state.requestTime) / 1000)
        }
    }
    m.core.register("eventurl", function(q, d, r, p) {
        if (!p) {
            m.core.warn("You must provide a callback function");
            return
        }
        if (!q || !d || !m.analytics.config.cantrack) {
            m.core.warn("Category and action must be provided for event.");
            return
        }
        var s = l(m.analytics.endpoint.fullpath("event.aspx"), c(q, d, r));
        p(s)
    });
    m.core.register("event", function(p, d, q) {
        if (!p || !d || !m.analytics.config.cantrack) {
            m.core.warn("Category and action must be provided for event.");
            return
        }
        k(m.analytics.endpoint.fullpath("event.aspx"), c(p, d, q))
    });
    m.core.register("legacy", function(p, d) {
        if (d !== n) {
            m.core.log("Setting legacy variable {0}, property {1}", p, d);
            g(p, d)
        } else {
            m.core.log("Setting legacy variable {0}, property {0}", p);
            g(p)
        }
    });
    m.core.register("dump", function() {
        console.debug(m.analytics);
        console.debug(h)
    });
    m.core.register("noonclick", function(d) {
        m.analytics.config.noonclick = d
    });
    m.core.register("set", function(d, p) {
        if (h.hasOwnProperty(d)) {
            h[d] = p
        } else {
            this.set.base(d, p)
        }
    });
    m.core.register("breadcrumbs", function(p) {
        if (!p || !a.querySelector) {
            return
        }
        var d = a.querySelector(p);
        if (d) {
            h.path = m.core.txt(d)
        }
    });
    m.core.register("groupselector", function(r) {
        if (!r || !a.querySelectorAll) {
            return
        }
        var q = a.querySelectorAll(r),
            d = [];
        for (var p = 0; p < q.length; p++) {
            var s = m.core.txt(q[p]);
            if (s != null) {
                d.push(s)
            }
        }
        if (d.length > 0) {
            h.groups = d.join(",");
            m.core.log("Groups set: {0}", d.join(", "))
        }
    });
    m.core.register("metagroupname", function(r) {
        var q = m.core.tag("meta"),
            d = [];
        if (h.groups) {
            d.push(h.groups)
        }
        for (var p = 0; p < q.length; p++) {
            if (q[p].name == r) {
                d.push(q[p].content)
            }
        }
        if (d.length > 0) {
            h.groups = d.join(",")
        }
    });
    m.core.register("param", function(d, p) {
        if (typeof d == "object") {
            for (i in d) {
                m.push(["param", i, d[i]])
            }
        } else {
            m.core.log("Param {0} = {1}", d, p);
            h["grk_" + d] = p
        }
    });
    m.core.register("request", function(d) {
        if (d.accountid === n) {
            d.accountid = h.accountid
        }
        k(m.analytics.endpoint.fullpath(), d)
    });
    m.core.register("trackpageview", function() {
        var d = m.analytics;
        if (!d.state.tracked && d.config.cantrack && d.config.ready) {
            k(d.endpoint.fullpath(), h);
            d.state.tracked = true;
            d.state.requestTime = new Date()
        }
    });
    m.core.register("notrack", function(d) {
        if (d === n) {
            d = true
        }
        if (d) {
            m.core.cookie("sz_notrack", "true", {
                expires: 1825
            })
        } else {
            m.core.cookie("sz_notrack", null)
        }
        m.analytics.config.cantrack = !d
    });
    m.tracking = function() {
        return m.analytics.config.cantrack
    };
    m.core.ready(function() {
        if (m.core.cookie("sz_notrack") !== null) {
            m.push(["notrack"])
        }
        g("searchWord", "sw");
        g("numberOfHits", "hits");
        g("_szpars");
        e();
        m.push(["trackpageview"]);
        if (m.analytics.config.noonclick !== true) {
            j(m.analytics.config.noonclick)
        }
    })
})(window, document, _sz);
_sz.core._isloaded = true;