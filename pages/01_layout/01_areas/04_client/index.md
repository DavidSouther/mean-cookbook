---
title: Client Layout
---

### Problem

Components in an Angular application have several ways to fit into Angular's module loading system.

### Solution

This is an example `client/` folder from a (smallish) production application, showing the various pieces of each component in the data layer.

```tree
.
└── src
    ├── client
    │   ├── Gruntfile.coffee
    │   ├── index.jade
    │   ├── main
    │   │   ├── all.styl
    │   │   ├── footer
    │   │   │   ├── directive.coffee
    │   │   │   ├── template.jade
    │   │   │   └── test.coffee
    │   │   ├── login
    │   │   │   ├── all.styl
    │   │   │   ├── directive.coffee
    │   │   │   ├── template.jade
    │   │   │   └── test.coffee
    │   │   ├── main.coffee
    │   │   ├── nav
    │   │   │   ├── directive.coffee
    │   │   │   ├── template.jade
    │   │   │   └── test.coffee
    │   │   ├── print.styl
    │   │   ├── screen.styl
    │   │   └── test.coffee
    │   ├── scavenge
    │   │   ├── gradebook
    │   │   │   ├── directive.coffee
    │   │   │   ├── service.coffee
    │   │   │   ├── service.mock.coffee
    │   │   │   ├── service.test.coffee
    │   │   │   └── template.jade
    │   │   ├── hunts
    │   │   │   ├── all.styl
    │   │   │   ├── directive.coffee
    │   │   │   ├── directive.test.coffee
    │   │   │   ├── edit
    │   │   │   │   ├── directive.coffee
    │   │   │   │   ├── template.jade
    │   │   │   │   └── test.coffee
    │   │   │   ├── service.coffee
    │   │   │   ├── service.mock.coffee
    │   │   │   ├── service.test.coffee
    │   │   │   └── template.jade
    │   │   ├── leaders
    │   │   │   ├── all.styl
    │   │   │   ├── directive.coffee
    │   │   │   ├── template.jade
    │   │   │   └── test.coffee
    │   │   ├── students
    │   │   │   ├── directive.coffee
    │   │   │   ├── screen.styl
    │   │   │   ├── service.coffee
    │   │   │   ├── template.jade
    │   │   │   └── test.coffee
    │   │   └── submit
    │   │       ├── controller.coffee
    │   │       ├── controller.test.coffee
    │   │       ├── directive.coffee
    │   │       ├── directive.test.coffee
    │   │       ├── grading
    │   │       │   ├── controller.coffee
    │   │       │   ├── directive.coffee
    │   │       │   ├── screen.styl
    │   │       │   └── template.jade
    │   │       ├── screen.styl
    │   │       ├── service.coffee
    │   │       ├── service.mock.coffee
    │   │       ├── service.test.coffee
    │   │       └── template.jade
    │   ├── stylus
    │   │   └── definitions
    │   │       ├── mixins.styl
    │   │       └── variables.styl
    │   ├── tools
    │   │   └── render.coffee
    │   └── util
    │       ├── fileInput
    │       │   ├── directive.coffee
    │       │   ├── service.coffee
    │       │   └── test.coffee
    │       └── thsort
    │           ├── directive.coffee
    │           ├── screen.styl
    │           └── template.jade
    ├── features
    └── server
```

Similar to the [server layout][server_layout], the client code is separated along component seams, rather than module type seams. The main entry point to the application is `index.jade`, which should be compiled as-is and returned as a static asset on any page load. Each component then has a `template.jade` file, which will be compiled and injected into Angular's template loading system. The stylus files are broken into three types, for the three media queries `all`, `print`, and `screen`.  This lets your app have a quick and easy way to define many styles for various media. The coffee files are compiled individually, then concatenated in order. That order is not terribly important, as each file will define a module to be loaded at runtime.

### Discussion

There are many ways to turn this directory structure into served code on the client. [Grunt][gruntjs] is the most popular JS build tool, though many others are also capable. These tools take the source directory, pass it through a series of transformations, and store the finished file elsewhere in the project structure (usually `build/`). Other tools, like [stassets][stassets], work as an express middleware. Because they operate entirely in memory and don't write to disk, these are much faster; however, they generally offer less flexibility. Stassets is built to handle project structures like this one.

A base Gruntfile could look like this.

```coffeescript
module.exports = (grunt)->
    flatten = (a, b)-> a.concat b

    module = 'teals.scavenger'


    ###
    This array defines watch patterns for the application's client files.
    Templates must be in jade format; services, controllers, directives, etc are
    coffee. Any other files, like providers or custom model modules, could be
    added here.
    ###
    appFileOrdering = [
        '**/template.jade'
        '**/main.coffee'
        '**/service.coffee'
        '**/controller.coffee'
        '**/directive.coffee'
    ].map((a)->"src/client/#{a}").reduce flatten, []


    ###
    grunt.Config is a convenience property defined in `grunt-recurse`. It allows
    gruntfiles to be more iterative in defining their configuartion.
    ###
    grunt.Config =
        ###
        With `grunt watch:client`, watch any client files, including tests.
        ###
        watch:
            client:
                files: [
                    'src/client/**/*.js'
                    'src/client/**/*.coffee'
                    'src/client/**/*.jade'
                    'src/client/**/*.styl'
                ]
                tasks: [
                    'client'
                ]
                options:
                    spawn: false

        ###
        Jade itself only compiles the index.
        ###
        jade:
            index:
                files: {
                    'build/client/index.html': ['src/client/index.jade']
                }
        ###
        ng-jade is a custom jade compiler, that injects the compiled jade
        html into an angular module, in this case, named `teals.templates`. Any
        angular directive that specifies a `templateUrl` can specify the folder
        path to the file, eg the `**` portion of the `src` pattern, to load the
        rendered HTML.
        ###
        ngjade:
            templates:
                files: [{
                    expand: false
                    src: ['src/client/**/template.jade']
                    dest: 'build/client/templates.js'
                }]
                options:
                    moduleName: 'teals.templates'
                    processName: (filepath)->
                        r_template = /^src\/client\/(.*)\/template.(html|jade)$/
                        path = filepath.replace r_template, '$1'
                    newModule: true
        ###
        There are three types of stylus targets, one for each of `all` media
        types, `screen` media types, and `print` media types. Adding more stylus
        targets, eg for `braile` or other css media types, is perfectly fine.
        ###
        stylus:
            options:
                paths: [
                    'src/client/stylus/definitions'
                ]
                import: [
                    'mixins'
                    'variables'
                    'nib'
                ]
            all:
                files:
                    'build/client/all.css': "src/client/**/all.styl"
            print:
                files:
                    'build/client/print.css': "src/client/**/print.styl"
            screen:
                files:
                    'build/client/screen.css': "src/client/**/screen.styl"

        ###
        Two sets of files get copied as-is: the client assets, and the needed
        vendor files out of bower_components. The bower_components could also
        use `grunt-contrib-concat` to build a compiled `vendors.js`.
        ###
        copy:
            client:
                files: [
                    expand: true
                    cwd: 'src/client'
                    src: ['index.html', 'assets/**/*']
                    dest: 'build/client'
                ]
            vendors:
                files: [
                    expand: true
                    cwd: 'bower_components'
                    src: [
                        'angular/angular.*'
                        'angular-route/angular*'
                        'angular-cookies/angular*'
                        'angular-resource/angular*'
                        # 'angular-ui/build/**/*'
                        'bootstrap/dist/**/*'
                        'angular-bootstrap/**/*'
                        'angular-ui-codemirror/**/*'
                        'codemirror/**/*'
                        'css-social-buttons/css/*'
                    ]
                    dest: 'build/client/vendors'
                ]

        ###
        All the application coffee scripts are joined and compiled in order. The
        angular module definition tools are used to manage client internal
        dependencies.
        ###
        coffee:
            options:
                bare: false
                join: true
            client:
                files:
                    'build/client/app.js': appFileOrdering
                        .filter (file)-> file.match(/\.coffee$/)

    grunt.registerTask 'buildClient',
        'Prepare the build/ directory with static client files.',
        [
            'copy:client'
            'copy:vendors'
            'ngjade:templates'
            'jade:index'
            'coffee:client'
            'stylus'
        ]

    grunt.registerTask 'client',
        'Prepare and test the client.',
        [
            'testClient' # See the section on Angular in the Testing chapter
            'buildClient'
        ]
```

This Gruntfile is fully featured and used in several projects. It takes `src/client`, and builds those to this.

```tree
build/client
├── all.css
├── app.js
├── index.html
├── print.css
├── screen.css
├── templates.js
└── vendors
    ├── angular
    │   ├── angular.js
    │   ├── angular.min.js
    │   ├── angular.min.js.gzip
    │   └── angular.min.js.map
    ├── angular-bootstrap
    │   ├── bower.json
    │   ├── ui-bootstrap-tpls.js
    │   ├── ui-bootstrap-tpls.min.js
    │   ├── ui-bootstrap.js
    │   └── ui-bootstrap.min.js
    ├── angular-cookies
    │   ├── angular-cookies.js
    │   ├── angular-cookies.min.js
    │   └── angular-cookies.min.js.map
    ├── angular-resource
    │   ├── angular-resource.js
    │   ├── angular-resource.min.js
    │   └── angular-resource.min.js.map
    ├── angular-route
    │   ├── angular-route.js
    │   ├── angular-route.min.js
    │   └── angular-route.min.js.map
    ├── angular-ui-codemirror
    │   ├── ui-codemirror.js
    │   └── ui-codemirror.min.js
    ├── bootstrap
    │   └── dist
    │       ├── css
    │       │   ├── bootstrap-theme.css
    │       │   ├── bootstrap-theme.css.map
    │       │   ├── bootstrap-theme.min.css
    │       │   ├── bootstrap.css
    │       │   ├── bootstrap.css.map
    │       │   └── bootstrap.min.css
    │       ├── fonts
    │       │   ├── glyphicons-halflings-regular.eot
    │       │   ├── glyphicons-halflings-regular.svg
    │       │   ├── glyphicons-halflings-regular.ttf
    │       │   └── glyphicons-halflings-regular.woff
    │       └── js
    │           ├── bootstrap.js
    │           └── bootstrap.min.js
    ├── codemirror
    │   ├── lib
    │   │   ├── codemirror.css
    │   │   └── codemirror.js
    │   ├── mode
    │   │   └── python
    │   │       └── python.jss
    │   └── theme
    │       └── monokai.css
    └── css-social-buttons
        └── css
            ├── zocial-regular-webfont.eot
            ├── zocial-regular-webfont.svg
            ├── zocial-regular-webfont.ttf
            ├── zocial-regular-webfont.woff
            └── zocial.css
```

If the build file chose to minify the vendors, rather than copying them, the build would be even smaller.

[server_layout]: /01_layout/01_areas/03_server
[stassets]: https://www.npmjs.org/package/stassets
[gruntjs]: http://gruntjs.org
