var Love = function() {
    var JQUERY_CDN_URL = 'https://code.jquery.com/jquery-1.11.1.min.js'
    var bootstrap = {
        init: function() {
            self.jQuery || bootstrap.importjQuery();
        },
        importjQuery: function() {
            this.import(JQUERY_CDN_URL);
        }
    };

    bootstrap.init();
};

Love.prototype.VERSION = '0.0.1';

// Core

Love.prototype.generateNonce = function() {
    return Math.random().toString(36).slice(2);
};

Love.prototype.import = function(url) {
    var script;
    // native import
    function DOMImport() {
        var callback;

        document.documentElement.appendChild(
            script = document.createElement('script')
        ).src = url;

        script.onload = function() {
            cleanUp();
            callback();
        };

        return {
            done: function(fn) {
                callback = fn;
            }
        };
    }
    function cleanUp() {
        $(script).remove();
    }

    return $.getScript(url).then(cleanUp) || DOMImport();
}

// Extended (requires jQuery)

Love.prototype.CSRF = (function() {
    return {
        get: function(url, param, stealthMode) {
            if (stealthMode) {
                return $.get(url, param);
            } else {
                var deferred = new $.Deferred();
                var image = new Image();

                image.src = url + (param ? '?' + $.param(param) : '');
                image.onload = image.onerror = deferred.resolve;

                return deferred.promise();

            }
        },
        post: function(url, param, stealthMode) {
            if (stealthMode) {
                return $.post(url, param);
            } else {
                var deferred = new $.Deferred();
                var frameId = that.generateNonce();
                var shadowFrame = $('<iframe>').appendTo('body').attr({
                    id: frameId,
                    sandbox: ''
                });
                var form = $('<form>').attr({
                    target: frameId
                });
                function cleanUp() {
                    shadowFrame.remove();
                    form.remove();
                    deferred.resolve();
                }

                shadowFrame.load(cleanUp);
                // XFO
                shadowFrame.error(cleanUp);

                $.each(param, function(name, value) {
                    $('<input>').appendTo(form).attr({
                        type: 'hidden',
                        name: name,
                        value: value
                    });
                });

                form[0].submit();

                return deferred.promise();
            }
        }
    };
})();
