/*
 * jquery.skillsoft.videorapi
 * https://github.com/MNHolden/jqueryPlugin
 *
 * Copyright (c) 2018 Martin Holden
 * Licensed under the MIT license.
 */
 
;(function ($, crypto, window, document, skillsoft, undefined) {
    'use strict';

    var API,
        __defaultOptions,
        __bind,
        __rapiDone,
        __rapiFail,
        __stringisEmpty,
        __checksharedSecretOptions,
        __base;

    var VERSION = '<%= pkg.version %>';

    //Enable checking for null length options
    if (!Object.keys) {
        Object.keys = function (obj) {
            var keys = [],
                k;
            for (k in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {
                    keys.push(k);
                }
            }
            return keys;
        };
    }


    /**
     * 
     * @param {object} fn The function to bind
     * @param {object} me The item to bind to
     * @returns {object} The result of calling fn with the specified me and arguments.
     */
    __bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };

    //Wrappers around AJAX Promises, that support checking non error response from RAPI calls
    /**
    * 
    * @param {object} data The results object
    * @param {string} textStatus The Jquery Ajax status text 
    * @param {object} jqXHR The JQuery Ajax
    * @param {object} deferred The Jquery Deferred object
    */
    __rapiDone = function (data, textStatus, jqXHR, deferred) {
        deferred.resolve(data, textStatus, jqXHR);
    };

    /**
    *
    * @param {object} jqXHR The JQuery Ajax
    * @param {string} textStatus The Jquery Ajax status text
    * @param {string} errorThrown The RAPI error thrown text
    * @param {object} deferred The Jquery Deferred object
    */
    __rapiFail = function (jqXHR, textStatus, errorThrown, deferred) {
        try {
            var error = JSON.parse(jqXHR.responseText);
            if ("errorCode" in error) {
                deferred.reject(jqXHR, textStatus, errorThrown, error.errorCode);
            } else {
                deferred.reject(jqXHR, textStatus, errorThrown);
            }
        } catch (e) {
            deferred.reject(jqXHR, textStatus, errorThrown);
        }
    };

    __stringisEmpty = function (value) {
        return typeof value === 'undefined' || value === null;
    };

    __checksharedSecretOptions = function (options) {
        //Check the options
        if (typeof options === 'undefined') {
            throw new Error('options is undefined');
        }

        if (__stringisEmpty(options.hostname)) {
            throw new Error('hostname is a required option');
        }

        if (__stringisEmpty(options.HashkeyProxy)) {
            if (__stringisEmpty(options.sharedsecret)) {
                throw new Error('sharedsecret or HashkeyProxy is a required option');
            }
        }
    };

    // Plugin default options.
    __defaultOptions = {
        hostname: undefined,
        sharedsecret: undefined,
        HashkeyProxy: undefined,
        RAPIVersion: 'v3',
        loginpath: '/skillportfe/rapi/video/authSharedSecret/login',
        logoutpath: '/skillportfe/rapi/video/authSharedSecret/logout',
        videodetailspath: '/skillportfe/rapi/video/video/{{videoid}}/details',
        videocontentlocationpath: '/skillportfe/rapi/video/video/{{videoid}}/contentLocation'
    };

    API = (function () {
        function VIDEORAPI(options) {
            __base = this;

            this.options = {};

            // Extend default options.
            $.extend(true, this.options, __defaultOptions, options);

            if (Object.keys(options).length > 0) {
                __checksharedSecretOptions(__base.options);
            }

            // Bind methods.
            this.update = __bind(this.update, this);

			this.resetDefaults = __bind(this.resetDefaults, this);
			
            //Bind RAPI
            this.login = __bind(this.login, this);
            this.logout = __bind(this.logout, this);

            this.videoDetails = __bind(this.videoDetails, this);
            this.videoContentLocation = __bind(this.videoContentLocation, this);

            this.getVersion = __bind(this.getVersion, this);
        }

        // Method for updating the plugins options.
        VIDEORAPI.prototype.update = function (options) {
            $.extend(true, this.options, options);

            if (Object.keys(options).length > 0) {
                __checksharedSecretOptions(__base.options);
            }
        };

		VIDEORAPI.prototype.resetDefaults = function () {
			this.options = {};

            // Extend default options.
            $.extend(true, this.options, __defaultOptions);
        };

        //RAPI Commands - authSharedSecret
        VIDEORAPI.prototype.login = function (username) {

            __checksharedSecretOptions(__base.options);

            //Local parameter check
            if (__stringisEmpty(username)) {
                throw new Error('username is a required parameter');
            }

            var _deferred = $.Deferred();
            var _timeStamp = new Date().getTime().toString();
            var _hashKey;

            if (__stringisEmpty(this.options.HashkeyProxy)) {
                _hashKey = crypto.MD5(username + "&" + _timeStamp + "&" + this.options.sharedsecret).toString();
                var _request = "username=" + username + "&" + "hashkey=" + _hashKey + "&" + "timestamp=" + _timeStamp;

                // Settings for Jquery Ajax
                var settings = {
                    async: true,
                    crossDomain: true,
                    url: "https://" + this.options.hostname + this.options.loginpath,
                    method: "POST",
                    headers: {
                        "accept": "application/json",
                        "RAPI-version": this.options.RAPIVersion
                    },
                    processData: false,
                    data: _request
                };

                $.ajax(settings)
                    .done(function (data, textStatus, jqXHR) {
                        __rapiDone(data, textStatus, jqXHR, _deferred);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        __rapiFail(jqXHR, textStatus, errorThrown, _deferred);
                    });

            } else {
                //Call the proxy to get the hashkey DO THIS SYNC
                // Settings for Jquery Ajax
                var proxysettings = {
                    async: true,
                    crossDomain: true,
                    url: this.options.HashkeyProxy,
                    method: "POST",
                    headers: {
                        "accept": "application/json",
                    },
                    processData: false,
                    data: JSON.stringify({ username: username, timestamp: _timeStamp, hostname: this.options.hostname }),
                };

                $.ajax(proxysettings)
                    //.done(function (data, textStatus, jqXHR) {
                    .done(function (data) {
                        _hashKey = data.hashkey;
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        __rapiFail(jqXHR, textStatus, errorThrown, _deferred);
                    })
                    //.then(function (data, textStatus, jqXHR) {
                    .then(function () {
                        var _request = "username=" + username + "&" + "hashkey=" + _hashKey + "&" + "timestamp=" + _timeStamp;

                        // Settings for Jquery Ajax
                        var settings = {
                            async: true,
                            crossDomain: true,
                            url: "https://" + __base.options.hostname + __base.options.loginpath,
                            method: "POST",
                            headers: {
                                "accept": "application/json",
                                "RAPI-version": __base.options.RAPIVersion
                            },
                            processData: false,
                            data: _request
                        };

                        $.ajax(settings)
                            .done(function (data, textStatus, jqXHR) {
                                __rapiDone(data, textStatus, jqXHR, _deferred);
                            })
                            .fail(function (jqXHR, textStatus, errorThrown) {
                                __rapiFail(jqXHR, textStatus, errorThrown, _deferred);
                            });
                    });
            }
            return _deferred.promise();
        };

        VIDEORAPI.prototype.logout = function (rapitoken) {

            if (__stringisEmpty(__base.options.hostname)) {
                throw new Error('hostname is a required option');
            }

            //Local parameter check
            if (__stringisEmpty(rapitoken)) {
                throw new Error('rapitoken is a required parameter');
            }

            var _deferred = $.Deferred();

            // Settings for Jquery Ajax
            var settings = {
                async: true,
                crossDomain: true,
                url: "https://" + this.options.hostname + this.options.logoutpath,
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "RAPI-version": this.options.RAPIVersion,
                    authorization: rapitoken
                },
                processData: false,
                //We specify "text" dataType as this DOES NOT return any data
                dataType: 'text json',
                // ...but we need to override jQuery's strict JSON parsing so we can JSON for errors, and "" for okay
                converters: {
                    'text json': function (result) {
                        if (result === "") {
                            return "";
                        } else {
                            return $.parseJSON(result);
                        }
                    }
                }
            };

            $.ajax(settings)
                .done(function (data, textStatus, jqXHR) {
                    __rapiDone(data, textStatus, jqXHR, _deferred);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    __rapiFail(jqXHR, textStatus, errorThrown, _deferred);
                });

            return _deferred.promise();
        };

        //RAPI Commands - video
        VIDEORAPI.prototype.videoDetails = function (rapitoken, videoid) {

            if (__stringisEmpty(__base.options.hostname)) {
                throw new Error('hostname is a required option');
            }

            //Local parameter check
            if (__stringisEmpty(videoid)) {
                throw new Error('videoid is a required parameter');
            }

            var _deferred = $.Deferred();

            var path = this.options.videodetailspath.replace(new RegExp('{{videoid}}', 'g'), videoid.trim());


            // Settings for Jquery Ajax
            var settings = {
                async: true,
                crossDomain: true,
                url: "https://" + this.options.hostname + path,
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "RAPI-version": this.options.RAPIVersion,
                    authorization: rapitoken
                },
                processData: false
                //We specify "text" dataType as this DOES NOT return any data
                //dataType: 'text json',
                //// ...but we need to override jQuery's strict JSON parsing so we can JSON for errors, and "" for okay
                //converters: {
                //    'text json': function (result) {
                //        if (result === "") {
                //            return "";
                //        } else {
                //            return $.parseJSON(result);
                //        }
                //    }
                //},
            };

            $.ajax(settings)
                .done(function (data, textStatus, jqXHR) {
                    __rapiDone(data, textStatus, jqXHR, _deferred);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    __rapiFail(jqXHR, textStatus, errorThrown, _deferred);
                });

            return _deferred.promise();
        };

        VIDEORAPI.prototype.videoContentLocation = function (rapitoken, videoid) {

            if (__stringisEmpty(__base.options.hostname)) {
                throw new Error('hostname is a required option');
            }

            //Local parameter check
            if (__stringisEmpty(videoid)) {
                throw new Error('videoid is a required parameter');
            }

            var _deferred = $.Deferred();

            var path = this.options.videocontentlocationpath.replace(new RegExp('{{videoid}}', 'g'), videoid.trim());


            // Settings for Jquery Ajax
            var settings = {
                async: true,
                crossDomain: true,
                url: "https://" + this.options.hostname + path,
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "RAPI-version": this.options.RAPIVersion,
                    authorization: rapitoken
                },
                processData: false
                //We specify "text" dataType as this DOES NOT return any data
                //dataType: 'text json',
                //// ...but we need to override jQuery's strict JSON parsing so we can JSON for errors, and "" for okay
                //converters: {
                //    'text json': function (result) {
                //        if (result === "") {
                //            return "";
                //        } else {
                //            return $.parseJSON(result);
                //        }
                //    }
                //},
            };

            $.ajax(settings)
                .done(function (data, textStatus, jqXHR) {
                    __rapiDone(data, textStatus, jqXHR, _deferred);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    __rapiFail(jqXHR, textStatus, errorThrown, _deferred);
                });

            return _deferred.promise();
        };

        VIDEORAPI.prototype.getVersion = function () {
            return VERSION;
        };

        return VIDEORAPI;
    })();

    skillsoft.videorapi = function (options) {
        // Create a RAPI instance if not available.
        if (!this.RAPIInstance) {
            this.RAPIInstance = new API(options || {});
        } else {
            this.RAPIInstance.update(options || {});
        }

        // Display items (if hidden) and return jQuery object to maintain chainability.
        return this.RAPIInstance;
    };

})(jQuery, CryptoJS, window, document, window.skillsoft = window.skillsoft || {});