QUnit.module('jquery.skillsoft.videorapi');

QUnit.test('Instantiate no options', function (assert) {

	assert.expect(2);

	assert.ok(skillsoft.videorapi, 'registered');

	var defaults = {
		"HashkeyProxyContentType": "application/x-www-form-urlencoded",
		"RAPIVersion": "v3",
		"loginpath": "/skillportfe/rapi/video/authSharedSecret/login",
		"logoutpath": "/skillportfe/rapi/video/authSharedSecret/logout",
		"videocontentlocationpath": "/skillportfe/rapi/video/video/{{videoid}}/contentLocation",
		"videodetailspath": "/skillportfe/rapi/video/video/{{videoid}}/details"
	};

	var rapi = skillsoft.videorapi();
	assert.propEqual(rapi.options, defaults, 'default settings are available');
	rapi.resetDefaults();
});

QUnit.test('Instantiate with options', function (assert) {
	assert.expect(2);

	assert.ok(skillsoft.videorapi, 'registered');

	var options = {
		hostname: 'HOSTNAME',
		sharedsecret: 'SHAREDSECRET',
		HashkeyProxy: 'HASHKEYPROXY',
		HashkeyProxyContentType: 'CONTENTTYPE',
		RAPIVersion: 'RAPIVERSION',
		loginpath: 'LOGINPATH',
		logoutpath: 'LOGOUTPATH',
		videodetailspath: 'VIDEODETAILSPATH',
		videocontentlocationpath: 'VIDEOCONTENTLOCATIONPATH'
	};

	var rapi = skillsoft.videorapi(options);
	assert.propEqual(rapi.options, options, 'options set');
	rapi.resetDefaults();
});

QUnit.test('Update options', function (assert) {
	assert.expect(3);

	assert.ok(skillsoft.videorapi, 'registered');

	var defaults = {
		"HashkeyProxyContentType": "application/x-www-form-urlencoded",
		"RAPIVersion": "v3",
		"loginpath": "/skillportfe/rapi/video/authSharedSecret/login",
		"logoutpath": "/skillportfe/rapi/video/authSharedSecret/logout",
		"videocontentlocationpath": "/skillportfe/rapi/video/video/{{videoid}}/contentLocation",
		"videodetailspath": "/skillportfe/rapi/video/video/{{videoid}}/details"
	};

	var rapi = skillsoft.videorapi();
	assert.propEqual(rapi.options, defaults, 'default settings are available');

	var options = {
		"hostname": "HOSTNAME",
		"sharedsecret": "SHAREDSECRET",
	};

	var afterUpdate = {
		"hostname": "HOSTNAME",
		"sharedsecret": "SHAREDSECRET",
		"HashkeyProxyContentType": "application/x-www-form-urlencoded",
		"RAPIVersion": "v3",
		"loginpath": "/skillportfe/rapi/video/authSharedSecret/login",
		"logoutpath": "/skillportfe/rapi/video/authSharedSecret/logout",
		"videocontentlocationpath": "/skillportfe/rapi/video/video/{{videoid}}/contentLocation",
		"videodetailspath": "/skillportfe/rapi/video/video/{{videoid}}/details"
	};

	rapi.update(options);
	assert.propEqual(rapi.options, afterUpdate, 'options updated');
	rapi.resetDefaults();
});
