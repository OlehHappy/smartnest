angular.module('smartnest.services')


.service('loader', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {

  function loader(createElement) {
    var promises = {};

    return function(url) {
      if (typeof promises[url] === 'undefined') {
        var deferred = $q.defer();
        var element = createElement(url);

        element.onload = element.onreadystatechange = function (e) {
          $timeout(function () {
            deferred.resolve(e);
          });
        };
        element.onerror = function (e) {
          $timeout(function () {
            deferred.reject(e);
          });
        };

        promises[url] = deferred.promise;
      }

      return promises[url];
    };
  }

  this.loadScript = loader(function (src) {
    var script = $document[0].createElement('script');

    script.src = src;

    $document[0].body.appendChild(script);
    return script;
  });

  this.loadCSS = loader(function (href) {
    var style = $document[0].createElement('link');

    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = href;

    $document[0].head.appendChild(style);
    return style;
  });
}]);
