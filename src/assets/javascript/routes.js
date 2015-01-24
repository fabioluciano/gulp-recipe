(function () {
    'use strict';

    application.app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                title: 'a',
                templateUrl: 'a',
                controller: 'a'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
}());
