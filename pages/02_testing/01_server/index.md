---
title: Testing Node.js Components
---

### Problem

Individual classes and components in a node application must be tested, prefferably in isolation.

### Solution

Use [Mocha][mocha] to organize tests, [Chai][chai] to provide assertion facilities, and include modules using node's commonjs module system.

In this worked example, the application must manage a list of activities over the past 20 minutes. Each activity can have arbitrary information, but must have a `timestamp` field with a valid JS Date value. In our layout, this component is called `activity`, and has a straightforward implementation.


```coffeescript
# src/server/activity/activity.coffee

###
Activities manages a list of user activities, over a certain time window. Any
activities older than a certain time (default 20 minutes) are pruned.
###
DEFAULT_WINDOW_SIZE = 20 # Minutes

class ActivityWindow
    constructor: (@windowSize = DEFAULT_WINDOW_SIZE)->
        @_activities = []

    add: (activity)->
        unless activity.timestamp instanceof Date
            throw new Error "Invalid timestamp"
        @_activities.push activity
        @

    prune: ->
        debugger
        (cutoff = new Date()).setMinutes(cutoff.getMinutes() - @windowSize)
        @_activities = @_activities.filter (_)-> _.timestamp >= cutoff
        @

    getWindow: ->
        @_activities

module.exports = ActivityWindow
```

This class is easy to test, letting us focus on the form of the test code.

```coffeescript
# src/server/activity/activity.test.coffee
ActivityWindow = require './activity'

describe 'Activity Window', ->
    activities = null
    beforeEach ->
        activities = new ActivityWindow

    it 'rejects activities without a Date timestamp', ->
        message = 'Invalid timestamp'

        date = "2014-07-04"

        # Three variations on how we can call `ActivityWindow::add`
        addWithNoTimestamp = -> activities.add {}
        addWithStringTimestamp = -> activities.add { timestamp: date }
        addWithDateTimestamp = -> activities.add { timestamp: new Date date }

        addWithNoTimestamp.should.throw(
            message
            'Throws on no timestamp'
        )
        addWithStringTimestamp.should.throw(
            message
            'Throws on string timestamp'
        )
        addWithDateTimestamp.should.not.throw(
            message
            'Does not throw on valid timsstamp'
        )


    # Date utilities - get `now` once, use that to create records as needed.
    now = new Date()
    y = now.getYear() + 1900
    m = now.getMonth()
    d = now.getDate()
    H = now.getHours()
    M = now.getMinutes()
    S = now.getSeconds()

    addActivity = (delta)->
        timestamp = new Date(y, m, d, H, M - delta, S)
        activities.add { timestamp }

    it 'has a window of activities', ->
        addActivity 2
        addActivity 3
        addActivity 4

        activities.getWindow().length.should.equal 3

    it 'prunes older posts', ->
        addActivity 2
        addActivity 3
        addActivity 40

        activities.prune().getWindow().length.should.equal 2
```

We can configure Mocha using `grunt-mocha-test`. In our gruntfile, the server test section is short and sweet.

```coffeescript
# ./src/server/Gruntfile.coffee
process.env.LOG_LEVEL = 'error'
module.exports = (grunt)->
    grunt.initConfig
        mochaTest:
            server:
                options:
                    reporter: 'spec'
                src: 'src/server/**/*.test.*'

    grunt.loadNpmTasks 'grunt-mocha-test'

    grunt.registerTask 'testServer', 'Test the server.', [
        'mochaTest:server'
    ]
```

With this in place, running the tests in grunt assures us our solution works.

```
$ grunt testServer
Running "mochaTest:server" (mochaTest) task


  Activity Window
    ✓ rejects activities without a Date timestamp
    ✓ has a window of activities
    ✓ prunes older posts


  3 passing (11ms)


Done, without errors.
```

### Discussion

Using Mocha as a test runner handles orchestrating the various tests. The Chai library provides several flavors of assertion handling. Teams can choose the flavor that suits them best; once decided, the tests largely proceed along the same guidelines.

Structure code with one class or module per file. Create tests in a seperate file, with the same name, and a `.test.coffee` extension. In the test, require the module using a relative path - `var activity = require('./activity');`. Structure your tests along blocks that work, conceptual, for the thing you're testing. Generally, one top level `describe` block for the component as a whole, one for component setup/teardown, and one each for broad types of functionality. Then, have one test case per business requirement or user story (broken in to some detail). These test cases should follow the regular set up / operate / assert flow.

For Mocha, I personally prefer the **BDD** flavor; using `describe(module, fn)`, `it(test, fn)`, `beforeEach(fn)` etc. Mocha also provides **TDD** (`suite`, `test`, `setup`) and **exports** (using a deep exported object); choose the flavor that works best for your team ([Mocha Interface Documentation][mocha_interfaces]). For assertions, I prefer the **should** flavor; `listOfThings<wbr>.length<wbr>.should<wbr>.equal(3)`, `returnValue<wbr>.should<wbr>.equal(false)`, `dataStruct<wbr>.should<wbr>.have<wbr>.property('foo')<wbr>.with<wbr>.value('bar')`. Chai also supports flavors for **expect** (`expect(listOfThings.length)<wbr>.to<wbr>.equal(3)`, `expect(returnValue)<wbr>.to<wbr>.equal(false)`, `expect(dataStruct)<wbr>.to<wbr>.have<wbr>.property('foo')<wbr>.with<wbr>.value('bar')`) and **assert** (`assert(listOfThings.length == 3)`, `assert<wbr>.isFalse(returnValue)`, `assert<wbr>.isDefined(dataStruct) ; assert<wbr>.strictEqual(dataStruct.foo, 'bar')`). In any flavor, all the assertions allow an optional final string property to print a human-readable error when the assertion fails.

[mocha]: http://visionmedia.github.io/mocha/
[chai]: http://chaijs.com/
[mocha_interfaces]: http://visionmedia.github.io/mocha/#interfaces
