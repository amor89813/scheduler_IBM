
(function () {

    if (typeof window.janrain !== 'object') window.janrain = {};
    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};

    janrain.settings.tokenAction = 'event';

    janrain.settings.providers = [
        'facebook',
        'linkedin',
        'google',
        'yahoo',
        'twitter',
        'salesforce'
    ]

    function isReady() { janrain.ready = true; };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
        window.attachEvent('onload', isReady);
    }

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.id = 'janrainAuthWidget';

    if (document.location.protocol === 'https:') {
        e.src = 'https://rpxnow.com/js/lib/spopconfig/engage.js';
    } else {
        e.src = 'http://widget-cdn.rpxnow.com/js/lib/spopconfig/engage.js';
    }

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
})();

function janrainWidgetOnload() {
    janrain.events.onProviderLoginToken.addHandler(function (tokenResponse) {
        spDispatch.trigger('willSocialSignIn');
        console.log("Janrain: attaching events");
        $.ajax({
            type: "POST",
            url: "/services/SocialSignIn.asmx/GetToken",
            data: JSON.stringify({
                token: tokenResponse.token
            }),
            contentType: "application/json",
            success: function (response) {
                if (response.d === "true") {
                    spDispatch.trigger('didSocialSignIn');

                    if (!!silverpop.formHandler.formView.el) {
                        silverpop.formHandler.submitWithoutValidation();
                        var ephemeralTracker = new SPCustomTracker();
                        spDispatch.on('shouldFollowFormRedirect', ephemeralTracker.redirect);
                    }

                }
                else {
                    alert("An error occurred while attempting social sign-in. Please refresh the page and try again.");
                }
            },
            error: function (res) {
                alert("An error occurred while attempting social sign-in. Please refresh the page and try again.");
            }
        });
    });
}