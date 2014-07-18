angular.module('content.blog.list.template', [])
.run(function($templateCache){
    $templateCache.put('content/blog/list', '<div class="PostList"><h2>Posts List</h2><section ng-repeat="post in site.posts | orderBy:\'front.date\':true"><h3><a ui-sref="blog.post({path: site.link(post.path)})">{{ post.front.title }}</a><time>{{ post.front.date | date:short }}</time></h3></section></div>');
});
angular.module('content.blog.post.template', [])
.run(function($templateCache){
    $templateCache.put('content/blog/post', '<article><header><h2>{{front.title}}</h2><p class="_publish-date"><time>{{ front.date | date:medium }}</time></p><p class="_author">{{ front.author }}</p><p>Categories:<span ng-repeat="cat in front.categories">&nbsp;{{ cat }}</span></p></header><div ng-bind-html="content"></div><content-nav content-state="\'blog.post\'" content-previous="previous" content-next="next"></content-nav></article>');
});
angular.module('content.home.template', [])
.run(function($templateCache){
    $templateCache.put('content/home', '<article><div ng-bind-html="content"></div></article>');
});
angular.module('content.nav.template', [])
.run(function($templateCache){
    $templateCache.put('content/nav', '<footer class="PageNav"><a href="{{ srefize(previous.path) }}" ng-show="previous" class="_previous"><span class="_twist">Previous</span></a><a href="{{ srefize(next.path) }}" ng-show="next" class="_next"><span class="_twist">Next</span></a></footer>');
});
angular.module('content.pages.template', [])
.run(function($templateCache){
    $templateCache.put('content/pages', '<article><header><h2>{{front.title}}</h2></header><div ng-bind-html="content"></div><content-nav content-state="\'page\'" content-previous="previous" content-next="next"></content-nav></article>');
});
angular.module('page.template', [])
.run(function($templateCache){
    $templateCache.put('page', '<div class="Page"><header role="banner"><ff-header></ff-header></header><main role="main"><section class="Content"><ui-view></ui-view></section><nav role="navigation"><ff-navigation></ff-navigation></nav><aside role="complementary"><ff-sidebar></ff-sidebar></aside></main><footer role="contentinfo"><ff-footer></ff-footer></footer></div>');
});
angular.module('page.banner.template', [])
.run(function($templateCache){
    $templateCache.put('page/banner', '<hgroup class="Header"><h1><a ui-sref="home">{{ site.title }}</a></h1><h2 ng-show="site.subtitle">{{ site.subtitle }}</h2></hgroup>');
});
angular.module('page.footer.template', [])
.run(function($templateCache){
    $templateCache.put('page/footer', '<div class="Footer">&copy; {{ site.copyright }} {{ site.author }}</div>');
});
angular.module('page.navigation.template', [])
.run(function($templateCache){
    $templateCache.put('page/navigation', '<div class="Navigation"><ul><li ng-show="site.posts.length &gt; 0"><a ui-sref="blog.list">All Posts</a></li><li ng-repeat="path in site.index.chapters"><a ui-sref="page({path:site.link(path)})">{{ site.files[path].front.title }}</a></li></ul></div>');
});
angular.module('page.sidebar.template', [])
.run(function($templateCache){
    $templateCache.put('page/sidebar', '<div class="Sidebar"><github repo="DavidSouther/mean-cookbook"></github><twitter search="angularjs, nodejs"></twitter></div>');
});
angular.module('page.sidebar.twitter.template', [])
.run(function($templateCache){
    $templateCache.put('page/sidebar/twitter', '<div class="_twitter"><a href="https://twitter.com/search?q=%23angularjs+%23nodejs" data-widget-id="487441816292052992" class="twitter-timeline">Tweets about "#angularjs #nodejs"</a></div>');
});
angular.module('page.sidebar.github.template', [])
.run(function($templateCache){
    $templateCache.put('page/sidebar/github', '<div class="_github"><h3>Commits for {{ repo.name }}</h3><div ng-show="error" class="_error">There was an error querying github.<span class="_message">{{ error }}</span></div><ol ng-show="!error" class="_commits"><li ng-repeat="commit in repo.commits"><a ng-href="{{ commit.html_url }}">{{ commit.commit.message }}</a><span>by</span><a ng-href="{{ commit.author.url }}">{{ commit.commit.author.name }}</a></li></ol></div>');
});