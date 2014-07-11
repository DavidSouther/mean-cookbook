domain = "https://api.github.com"
params = []#["callback=JSON_CALLBACK"]

angular.module('flipflops.page.sidebar.github.directive', [
    'page.sidebar.github.template'
]).directive 'github', ($http)->
    restrict: 'AE'
    templateUrl: 'page/sidebar/github'
    link: post: ($scope, $element, attrs)->
        $scope.repo =
            name: attrs.repo
            commits: []
        $scope.error = false
        $http.get("#{domain}/repos/#{attrs.repo}/commits?#{params.join '&'}")
        .success (results)->
            $scope.repo.commits = results.slice(0, 10)
        .catch (err)->
            $scope.error = err
