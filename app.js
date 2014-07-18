(function() {
  angular.module('flipflops.page.sidebar.github', ['flipflops.page.sidebar.github.directive']);

}).call(this);

(function() {
  angular.module('flipflops.page.sidebar.twitter', ['flipflops.page.sidebar.twitter.directive']);

}).call(this);

(function() {
  angular.module('flipflops.content.blog.list', ['ui.router', 'flipflops.content.blog.list.controller', 'content.blog.list.template']).config(function($stateProvider) {
    return $stateProvider.state('blog.list', {
      url: '/posts/',
      controller: 'BlogListCtrl',
      templateUrl: 'content/blog/list'
    });
  });

}).call(this);

(function() {
  angular.module('flipflops.content.blog', ['ui.router', 'flipflops.content.blog.list', 'flipflops.content.blog.post']).config(function($stateProvider) {
    return $stateProvider.state('blog', {
      template: "<div ui-view></div>"
    });
  });

}).call(this);

(function() {
  angular.module('flipflops.content.blog.post', ['ui.router', 'flipflops.content.blog.post.controller', 'content.blog.post.template']).config(function($stateProvider) {
    return $stateProvider.state('blog.post', {
      url: '/posts/*path',
      controller: 'BlogPostCtrl',
      templateUrl: 'content/blog/post'
    });
  });

}).call(this);

(function() {
  angular.module('flipflops.content.home', ['ui.router', 'flipflops.content.home.controller', 'content.home.template']).config(function($stateProvider) {
    return $stateProvider.state('home', {
      url: '/',
      controller: 'HomeCtrl',
      templateUrl: 'content/home'
    });
  });

}).call(this);

(function() {
  angular.module('flipflops.content', ['flipflops.content.home', 'flipflops.content.blog', 'flipflops.content.pages', 'flipflops.content.nav', 'ngAnimate']).run(function($document, $rootScope) {
    return $document.bind('keyup', function(ev) {
      if (ev.which === 39) {
        $rootScope.$broadcast("NEXT!");
      }
      if (ev.which === 37) {
        return $rootScope.$broadcast("PREVIOUS!");
      }
    });
  });

}).call(this);

(function() {
  angular.module('flipflops.content.nav', ['flipflops.content.nav.directive']);

}).call(this);

(function() {
  angular.module('flipflops.content.pages', ['ui.router', 'flipflops.content.pages.controller', 'content.pages.template']).config(function($stateProvider) {
    return $stateProvider.state({
      name: 'page',
      url: '/*path',
      controller: 'PageCtrl',
      templateUrl: 'content/pages'
    });
  });

}).call(this);

(function() {
  angular.module('flipflops', ['ui.router', 'flipflops.page']).config(function($urlRouterProvider, $locationProvider) {
    return $urlRouterProvider.otherwise('/');
  });

}).call(this);

(function() {
  angular.module('flipflops.page', ['flipflops.page.directive']);

}).call(this);

(function() {
  angular.module('flipflops.renderer', []).provider('Renderer', function() {
    var Renderer, options, treeLang;
    options = {
      renderer: marked.Renderer,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function(code, language) {
        if (language) {
          return hljs.highlight(language, code).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    };
    this.defineLanguage = function(name, lang) {
      return hljs.registerLanguage(name, function() {
        return lang;
      });
    };
    this.registerLanguage = hljs.registerLanguage;
    treeLang = function() {
      return {
        contains: [hljs.HASH_COMMENT_MODE]
      };
    };
    this.registerLanguage('tree', treeLang);
    this.updateOptions = function(opts) {
      return options = angular.extend(options, opts);
    };
    Renderer = function($q) {
      options.renderer = new options.renderer();
      marked.setOptions(options);
      return {
        render: function(src) {
          return $q.when(marked(src));
        }
      };
    };
    Renderer.$inject = ['$q'];
    this.$get = Renderer;
  });

}).call(this);

(function() {
  var Site;

  Site = (function() {
    var indexArrayOrder, indexOrder;

    function Site(promise) {
      this.loaded = promise.then((function(_this) {
        return function(response) {
          angular.extend(_this, response.data.site);
          _this.files = angular.extend({}, response.data.files);
          _this.buildIndex();
          return _this;
        };
      })(this));
    }

    indexArrayOrder = function(a, b) {
      if (a.length === 0 && b.length === 0) {
        return 0;
      }
      if (a.length === 0 && b.length > 0) {
        return -1;
      }
      if (a.length > 0 && b.length === 0) {
        return 1;
      }
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      if (a[0] === b[0]) {
        return indexArrayOrder(a.slice(1), b.slice(1));
      }
      throw new Exception("Unsupported boolean magic in indexArrayOrder.");
    };

    indexOrder = function(a, b) {
      return indexArrayOrder(a.replace(/\/index\.m(d|arkdown)/, '').split('/'), b.replace(/\/index\.m(d|arkdown)/, '').split('/'));
    };

    Site.prototype.buildIndex = function() {
      angular.forEach(this.files, function(file, path) {
        return file.path = path;
      });
      this.index = {
        files: Object.keys(this.files),
        posts: Object.keys(this.files).filter(function(_) {
          return _.indexOf('/posts/') === 0;
        }),
        pages: Object.keys(this.files).filter(function(_) {
          return _.indexOf('/pages/') === 0;
        })
      };
      this.index.posts.sort(indexOrder);
      this.index.pages.sort(indexOrder);
      this.index.chapters = this.index.pages.filter(function(path) {
        return path.split('/').length <= (3 + 1);
      });
      this.posts = this.index.posts.reduce(((function(_this) {
        return function(a, f) {
          a.push(_this.files[f]);
          return a;
        };
      })(this)), []);
      return this.pages = this.index.pages.reduce(((function(_this) {
        return function(a, f) {
          a.push(_this.files[f]);
          return a;
        };
      })(this)), []);
    };

    Site.prototype.link = function(file) {
      return (file || '').replace('/pages/', '').replace('/posts/', '').replace('index.md', '').replace('index.markdown', '');
    };

    Site.prototype.findNoIndex = function(path) {
      return this.files["" + path + "index.md"] || this.files["" + path + "index.markdown"] || this.files["" + path + "/index.md"] || this.files["" + path + "/index.markdown"] || null;
    };

    Site.prototype.find = function(path) {
      if (path === '/README.md' && (this.files[path] != null)) {
        return this.files[path];
      }
      if (path.indexOf('/posts/') !== 0) {
        path = "/pages/" + path;
      }
      return this.findNoIndex(path);
    };

    return Site;

  })();

  angular.module('flipflops.site', []).provider('Site', function() {
    var config, siteFactory;
    config = '/site.json';
    this.configPath = function(_) {
      return config = _;
    };
    siteFactory = function($http) {
      var promise;
      promise = $http.get(config);
      return new Site(promise);
    };
    siteFactory.$inject = ['$http'];
    this.$get = siteFactory;
  });

}).call(this);

(function() {
  angular.module('flipflops.content.blog.list.controller', ['ui.router', 'flipflops.site']).controller('BlogListCtrl', function($scope, Site, $stateParams) {});

}).call(this);

(function() {
  angular.module('flipflops.content.blog.post.controller', ['ui.router', 'flipflops.site', 'flipflops.renderer']).controller('BlogPostCtrl', function($scope, Site, $stateParams, Renderer, $sce, $state) {
    var link, path;
    $scope.content = '';
    path = "/posts/" + $stateParams.path;
    Site.loaded.then(function() {
      var file;
      file = Site.find(path);
      $scope.front = file.front;
      file.front.date = new Date(file.front.date);
      link(file);
      return Renderer.render(file.body).then(function(content) {
        return $scope.content = $sce.trustAsHtml(content);
      });
    });
    return link = function(file) {
      var index;
      index = Site.index.posts.indexOf(file.path);
      if (index > 0) {
        $scope.previous = Site.files[Site.index.posts[index - 1]];
      }
      if (index < Site.index.posts.length - 1) {
        return $scope.next = Site.files[Site.index.posts[index + 1]];
      }
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.content.home.controller', ['flipflops.site', 'flipflops.renderer']).controller('HomeCtrl', function($scope, Site, Renderer, $sce) {
    var path;
    $scope.content = '';
    path = "/README.md";
    return Site.loaded.then(function() {
      var file;
      file = Site.find(path);
      $scope.front = file.front;
      file.front.date = new Date(file.front.date);
      return Renderer.render(file.body).then(function(content) {
        return $scope.content = $sce.trustAsHtml(content);
      });
    });
  });

}).call(this);

(function() {
  angular.module('flipflops.content.nav.controller', ['ui.router', 'flipflops.site']).controller('ContentNavCtrl', function($scope, $state, Site) {
    var go;
    $scope.srefize = function(path) {
      return $state.href($scope.state, {
        path: Site.link(path)
      });
    };
    $scope.$on('NEXT!', function() {
      if ($scope.next) {
        return go($scope.next);
      }
    });
    $scope.$on('PREVIOUS!', function() {
      if ($scope.previous) {
        return go($scope.previous);
      }
    });
    return go = function(where) {
      return $state.go($scope.state, {
        path: Site.link(where.path)
      });
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.content.pages.controller', ['ui.router', 'flipflops.site', 'flipflops.renderer']).controller('PageCtrl', function($scope, Site, $stateParams, Renderer, $sce, $state) {
    var link;
    Site.loaded.then(function() {
      var file;
      file = Site.find($stateParams.path);
      $scope.front = file.front;
      link(file);
      return Renderer.render(file.body).then(function(content) {
        return $scope.content = $sce.trustAsHtml(content);
      });
    });
    return link = function(file) {
      var index;
      index = Site.index.pages.indexOf(file.path);
      if (index > 0) {
        $scope.previous = Site.files[Site.index.pages[index - 1]];
      }
      if (index < Site.index.pages.length - 1) {
        return $scope.next = Site.files[Site.index.pages[index + 1]];
      }
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.site.controller', ['flipflops.site']).controller('Site', function($scope, Site) {
    return $scope.site = Site;
  });

}).call(this);

(function() {
  angular.module('flipflops.page.sidebar.directive', ['flipflops.page.sidebar.twitter', 'flipflops.page.sidebar.github', 'page.sidebar.template']).directive('ffSidebar', function() {
    return {
      restrict: 'AE',
      templateUrl: 'page/sidebar'
    };
  });

}).call(this);

(function() {
  var domain, params;

  domain = "https://api.github.com";

  params = [];

  angular.module('flipflops.page.sidebar.github.directive', ['page.sidebar.github.template']).directive('github', function($http) {
    return {
      restrict: 'AE',
      templateUrl: 'page/sidebar/github',
      link: {
        post: function($scope, $element, attrs) {
          $scope.repo = {
            name: attrs.repo,
            commits: []
          };
          $scope.error = false;
          return $http.get("" + domain + "/repos/" + attrs.repo + "/commits?" + (params.join('&'))).success(function(results) {
            return $scope.repo.commits = results.slice(0, 10);
          })["catch"](function(err) {
            return $scope.error = err;
          });
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.page.sidebar.twitter.directive', ['page.sidebar.twitter.template']).directive('twitter', function() {
    return {
      restrict: 'AE',
      templateUrl: 'page/sidebar/twitter',
      link: {
        post: function() {
          return (function(d, s, id) {
            var fjs, js, p;
            js = void 0;
            fjs = d.getElementsByTagName(s)[0];
            p = (/^http:/.test(d.location) ? "http" : "https");
            if (!d.getElementById(id)) {
              js = d.createElement(s);
              js.id = id;
              js.src = p + "://platform.twitter.com/widgets.js";
              fjs.parentNode.insertBefore(js, fjs);
            }
          })(document, "script", "twitter-wjs");
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.content.nav.directive', ['content.nav.template', 'flipflops.content.nav.controller']).directive('contentNav', function() {
    return {
      replace: true,
      restrict: 'AE',
      scope: {
        'next': '=contentNext',
        'previous': '=contentPrevious',
        'state': '=contentState'
      },
      controller: 'ContentNavCtrl',
      templateUrl: 'content/nav',
      link: function($scope, $element, $attributes) {}
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.page.banner.directive', ['page.banner.template']).directive('ffHeader', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'page/banner'
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.page.directive', ['flipflops.site.controller', 'flipflops.page.banner.directive', 'flipflops.page.navigation.directive', 'flipflops.page.sidebar.directive', 'flipflops.page.footer.directive', 'flipflops.content', 'page.template']).directive('ffPage', function() {
    return {
      restrict: 'AE',
      templateUrl: 'page'
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.page.footer.directive', ['page.footer.template']).directive('ffFooter', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'page/footer'
    };
  });

}).call(this);

(function() {
  angular.module('flipflops.page.navigation.directive', ['page.navigation.template']).directive('ffNavigation', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'page/navigation',
      controller: function($scope) {
        return $scope.isPost = function(_) {
          return _.indexOf('/posts/') === 0;
        };
      }
    };
  });

}).call(this);
