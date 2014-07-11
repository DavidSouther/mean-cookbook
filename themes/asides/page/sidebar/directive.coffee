angular.module('flipflops.page.sidebar.directive', [
  'flipflops.page.sidebar.twitter'
  'flipflops.page.sidebar.github'
  'page.sidebar.template'
]).directive 'ffSidebar', ->
  restrict: 'AE'
  templateUrl: 'page/sidebar'
