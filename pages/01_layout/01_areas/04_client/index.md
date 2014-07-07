---
title: Client Layout
---

### Problem

Components in an Angular application have several ways to fit into Angular's module loading system.

### Solution

```
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

Similar to the [server layout][server_layout], the client code is separated along component seams, rather than module type seams. The main entry point to the application is `index.jade`, which should be compiled as-is and returned as a static asset on any page load. Each component then has a `template.jade` file, which will be compiled and injected into Angular's template loading system. The stylus files are broken into three types, for the three media queries `all`, `print`, and `screen`.  This lets your app have a quick and easy way to define many styles for varius media. The coffee files are compiled individually, then concattenated in order. That order is not terribly important, as each file will define a module to be loaded at runtime.

### Discussion

There are many ways to turn this directory structure into served code on the client. [Grunt][gruntjs] is the most popular JS build tool, though many others are also viable. These tools take the source directory, pass it through a series of transformations, and store the finished file elsewhere in the project structure (usually `build/`). Other tools, like [stassets][stassets], work as an express middleware. Because they operate entirely in memory and don't write to disk, these are much faster; however, they generally offer less flexibility. Stassets is built to handle project structures like this one.


[server_layout]: /01_layout/01_areas/03_server
[stassets]: https://www.npmjs.org/package/stassets
[gruntjs]: http://gruntjs.org
