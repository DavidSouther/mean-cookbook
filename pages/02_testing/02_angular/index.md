---
title: Testing Angular
---

### Problem

A single page application made of many components requires each component to be
tested in isolation, and across many platform targets.

### Solution

Utilizing the [karma][karma] test runner tool, a project that makes full use of
Angular's modules can be easily tested to whatever granularity is needed by the
tester. Starting from the configuration we have in the
[client layout](/01_layout/01_areas/04_client), add these configuration settings
for Karma.

```coffeescript
grunt.Config =
    # ...

    browsers = []
    unless process.env['DEBUG']
        if process.env['BAMBOO']
            browsers = ['PhantomJS']
        else
            browsers = ['Chrome']

    preprocessors =
        'src/client/**/*test.coffee': [ 'coffee' ]
        'src/client/**/*mock.coffee': [ 'coffee' ]
        'src/client/tools/*.coffee': [ 'coffee' ]
        'src/client/**/*.jade': [ 'jade', 'ng-html2js' ]

    cover =
        if process.env.DEBUG and not process.env.COVER
            'coffee'
        else
            'coverage'

    for type in appFileOrdering
        if type.indexOf('.coffee') > -1
            preprocessors[type] = [cover]


    ###
    After defining a few properties, including whether to run coverage
    preprocessors, grunt-recurse's Config property allows us to continue adding
    config definitions.
    ###
    grunt.Config =
        karma:
            ###
            Configure Karma to run mocha tests on the project.
            ###
            client:
                options:
                    browsers: browsers
                    frameworks: [ 'mocha', 'sinon-chai' ]
                    reporters: [ 'spec', 'junit', 'coverage' ]
                    singleRun: true,
                    logLevel: 'INFO'
                    ###
                    Preprocessors include ng-jade, coverage, etc.
                    ###
                    preprocessors: preprocessors
                    files: [
                        # 'bower_components/jquery/jquery.js'
                        'bower_components/angular/angular.js'
                        'bower_components/angular-route/angular-route.js'
                        'bower_components/angular-resource/angular-resource.js'
                        # 'bower_components/angular-animate/angular-animate.js'
                        'bower_components/angular-cookies/angular-cookies.js'
                        'bower_components/angular-mocks/angular-mocks.js'
                        'src/client/**/*mock.coffee'
                        'src/client/tools/**/*'
                        appFileOrdering
                        grunt.expandFileArg('src/client', '**/')
                    ].reduce(flatten, [])
                    ngHtml2JsPreprocessor:
                        cacheIdFromPath: jadeTemplateId
                        moduleName: 'teals.templates'
                    junitReporter:
                        outputFile: 'build/reports/karma.xml'
                    coverageReporter:
                        type: 'lcov'
                        dir: 'build/reports/coverage/'

    grunt.registerTask 'testClient',
        'Run karma tests against the client.',
        [
            'karma:client'
        ]

```

### Discussion

There are a few points to highlight in this configuration. First, the browser is
dynamically chosen depending on environment variables. This lets developers run
`DEBUG=1 grunt test`, which will open no browser, and let them connect
themselves; or just run `grunt test`, and get Chrome (`google-chrome` will need
to be in `PATH`); or with `BAMBOO=1 grunt test` will assume it's on a CI server
and skip straight to headless PhantomJS.

This particular configuration will load all the files it finds for your app (via
`appFileOrdering`), all the tests and mocks files (`src/client/**/*mock.coffee`
and `grunt.expandFileArg('src/client', '**/')`), and finally, any other tools
needed for stubbing out test services (`'src/client/tools/**/*'`). That last one
we'll look at more closely in some other sections.

This configuration uses [mocha][mocha] for the testing library (for `describe`,
`it`, `beforeEach`, etc), [chai][chai] for the assertions library (take your
choice of `assert`, `expect`, or `should`), and [sinon][sinon] to provide spies
and stubs. Karma is very configurable, having plugins that we use here for
rendering templates, providing reports from the command line to jUnit, and
instrumenting our code (when requested) with [ibrik][ibrik] coverage reporting.

The `src/client/tools/` folder is treated specially. It is not part of your
delivered project specifically, but provides a place to put extra mock and stub
code your project will use. We use it in the sections on
[httpBackend](./01_httpBackend) and [rendering](03_rendering), with a full
explanation in [injections](02_injections). Saving details on the code for then,
start a file in that folder called `backend.coffee`, and put a basic mocks guard
in.

```coffeescript
# src/client/tools/backend.coffee

if angular.mock
    window.httpBackend = angular.mock.httpBackend = (data, afterEach = ->)->
```

We'll fill that out the method body next section. This method, `httpBackend`,
will be available only if we're mocking code out (as indicated by angular.mock
being defined). We also export it on the window, in the mocking environment, for
convenience. This is the one exceptional case where globals are sane and useful.

karma: http://karma-runner.github.io/0.12/index.html
mocha: http://visionmedia.github.io/mocha/
chai: http://chaijs.com/
sinon: http://sinonjs.org/
ibrik: https://github.com/Constellation/ibrik
