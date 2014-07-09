---
title: Server Layout
---

### Problem

Components in an Express application have several types of modules.

### Solution
```
.
└── src
    ├── client
    ├── deploy
    ├── features
    └── server
        ├── Gruntfile.coffee
        ├── db.coffee
        ├── logger.coffee
        ├── routers.coffee
        ├── server.coffee
        ├── test.coffee
        ├── api
        │   └── route.coffee
        ├── auth
        │   ├── authenticate.coffee
        │   ├── google.coffee
        │   ├── mock.coffee
        │   ├── route.coffee
        │   └── signout.coffee
        ├── hunts
        │   ├── model.coffee
        │   ├── route.coffee
        │   └── test.coffee
        ├── leaders
        │   └── route.coffee
        ├── static
        │   ├── handler.coffee
        │   └── test.coffee
        ├── students
        │   ├── model.coffee
        │   ├── route.coffee
        │   └── test.coffee
        └── submissions
            ├── loader
            │   └── import.coffee
            ├── model.coffee
            ├── route.coffee
            ├── runner
            │   ├── runner.coffee
            │   └── test.coffee
            └── test.coffee
```

In this project, the entry point is through `server.coffee`, which will: load the various configurations, wire the necessary handlers, and generally perform the server's base setup. Then, each component will have its own set of files to perform specific server tasks. Some are pertinent to the application, like `students` and `submissions`. Some are general to an area of business concern, like the `auth` folder. These all have a few key pieces in common, but that is only by convention.

Any file named `handler`, by convention, returns a middleware factory. A middleware factory is a function that takes a configuration object, and returns an express middleware function. See the chapter on [servers][server] for more. A file named `route`, by convention, exports a function that takes an Express application and attaches routes to that app. Files called `model` can export an ORM model definition (see [restify][restify] for an example). Files named `test` define [mocha tests][mocha_server] for that server component. Any other file can be created for a component as needed.

Business orthagonal pieces also exist, but can generally be considered part of the same component structure. The `auth` component, which ties in to passport, is a great example in this project.

### Discussion

Both the Server and Client share a code layout inverted to a traditional Rails or J2EE application. Where those systems create folders by file or module type (controllers, views, etc), build configurations today are simple enough to use the more sensible approach outlined here. The server folder is split for each component, allowing some knowledge of the hierarchy of the project into the server folder structure itself. This keeps all of the pieces together - no hunting between a tests folder and into some model definitions two pages and four directories away.

Implementing this approach is very straightforward in code, because of Node's common js module loading system. With the `[require][node_require]` function, node will intelligently look either for a library installed in `node_modules`, or will look relative to the current script for a loadable file. By default, node understands `.js` and `.json` files, but has mechanisms to load handlers for many other defined file types. After installing coffeescript for a project, calling `require('coffee-script/register')` in the application's main script will install the `.coffee` handler.

Looking more closely at the `students` component, we can see all this in action. First, in `routers.coffee` in the server root, we load the various routers we need for our components. It has a list of routable components, loads each, and passes the `app` to them. Notice that it itself is a router, and exports a function that takes an app object.

```coffeescript
routers = (app)->
    [
        'auth'
        'students'
        'leaders'
        'hunts'
        'submissions'
        'api'
    ].forEach (api)->
        require("./#{api}/route")(app)

    app

module.exports = routers
```

The students router merely loads the model and attaches it to the `app`, with some logging.

```coffeescript
winston = require('../logger').log
restify = require('express-restify-mongoose').serve

Student = require('./model')

route = (app)->
    winston.silly 'Attaching students routes...'
    restify app, Student

module.exports = route
```

Finally, the students `model.coffee` defines the model characteristics in the ORM.

```coffeescript
mongoose = require('../db')

Schema = mongoose.Schema
studentSchema = Schema({
    name: String
    email: String
    token: String
    roles: {
        teacher: Boolean
    }
})
Student = mongoose.model 'student', studentSchema

Student.expandName = (name)->
    [name, first, last] = name.match /([A-Z][a-z]+)([A-Z].*)/
    "#{first} #{last}"

module.exports = Student
```

The common thread among these files is the relative pathing in the `require` statements. Because node is very intelligent about both the distinction between local and library pathing, and in understanding file types to load. This allows tools like coffeescript to register handlers in the node environment, load those files at runtime, and interoperate between any supported file type. The project is free to lay out its files however it wishes. Choosing this component-first approach is a good way to organize your project, but so long as the approach is consistent, a project will do fine.

[server]: /07_server
[restify]: /07_server/03_mongo/03_restify
[mocha_server]: /02_testing/01_server
[node_require]: http://nodejs.org/api/modules.html
