# jQuery Skillsoft Video Restful API Plugin

jQuery 3.x plugin for using Skillsoft Video Restful API

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/martinholden-skillsoft/jquery.skillsoft.videorapi/master/dist/jquery.skillsoft.videorapi.min.js
[max]: https://raw.github.com/martinholden-skillsoft/jquery.skillsoft.videorapi/master/dist/jquery.skillsoft.videorapi.js

In your web page:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js"></script>
<script src="dist/jquery.skillsoft.videorapi.min.js"></script>
<script>
 $(function () {
        var options = {
            //This is the base URL of the Skillport site - i.e. customername.skillport.com
            hostname: "{{SKILLPORTURL}}",
            //This is the path to a page that will be passed a JSON object with:
            //  username, timestamp, hostname
            //The page uses these values along with a sharedsecret to generate an MD5 hash MD5(username + "&" + timestamp + "&" + sharedsecret) that is used as the bearer token for authentication
            //It returns JSON with:
            //  hashkey
            //This approach is used to SECURE the sharedsecret
            HashkeyProxy: "{{URLTOHASHPROXY}}"
            //Optionally for testing, but should not be used in production situation
            //Comment out HashkeyProxy above and uncomment below, to have Pluging generate hash
            //client side
            //sharedsecret: "{{SKILLPORTSHAREDSECRET}}
        }

        //Initialise the Plugin
        var rapi = skillsoft.rapi(options);

        //Create object to contain the username, this object will be extended with the response data to the login request
        var rapiInfo = {
            //Skillport username that must exist and be activated
            username: 'olsatest',
        };

        //Create object to contain the video, this object will be extended with the response data to the video details request
        var videoInfo = {
            //Skillport unique Id for video, that must exist and be entitled to the user
            id: '95120',
        };

        rapi.login(rapiInfo.username)
            .done(function (data, textStatus, jqXHR) {
                //Extend the rapiInfo object with the response
                $.extend(rapiInfo, data);
            })
            .fail(function (jqXHR, textStatus, errorThrown, errorId) {
                //Do something with the error information
            })
            .then(function (data, textStatus, jqXHR) {
                rapi.videoDetails(rapiInfo.rapiToken, videoInfo.id)
                    .done(function (data, textStatus, jqXHR) {
                        $.extend(videoInfo, data);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown, errorId) {
                        //Do something with the error information
                    });
            });
 });
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
