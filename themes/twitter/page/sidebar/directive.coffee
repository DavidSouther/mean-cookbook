angular.module('flipflops.page.sidebar.directive', [
  'flipflops.page.sidebar.twitter'
  'page.sidebar.template'
]).directive 'ffSidebar', ->
  restrict: 'AE'
  templateUrl: 'page/sidebar'
