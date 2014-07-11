angular.module('flipflops.page.sidebar.twitter.directive', [
    'page.sidebar.twitter.template'
]).directive 'twitter', ->
    restrict: 'AE'
    templateUrl: 'page/sidebar/twitter'
    link: post: ->
        do (d = document, s = "script", id = "twitter-wjs") ->
            js = undefined
            fjs = d.getElementsByTagName(s)[0]
            p = (if /^http:/.test(d.location) then "http" else "https")
            unless d.getElementById(id)
                js = d.createElement(s)
                js.id = id
                js.src = p + "://platform.twitter.com/widgets.js"
                fjs.parentNode.insertBefore js, fjs
            return
