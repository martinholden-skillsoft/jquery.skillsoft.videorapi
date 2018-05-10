(function() {
  // Default to the local version.
  var path = '../libs/crypto-js/crypto-js.js';
  // Get any jquery=___ param from the query string.
  var cryptojsversion = location.search.match(/[?&]cryptojs=(.*?)(?=&|$)/);
  // If a version was specified, use that version from code.jquery.com.
  if (cryptojsversion) {
    path = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/' + jqversion[1] + '/crypto-js.js';
  }
  // This is the only time I'll ever use document.write, I promise!
  document.write('<script src="' + path + '"></script>');
}());
