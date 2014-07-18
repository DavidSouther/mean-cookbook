---
title: Angular Services
---

### Problem

Complex applications require a strong, consistent data model, something often
missing in traditional web development.

### Solution

Angular Services will be the bread and butter of your data model. Angular
implements services as data factories - each service will be instantiated
exactly once. This instance is responsible for managing a certain set of your
data. Let's see this in action.

```coffeescript
ACTIVITY_WINDOW = 20#minutes

class Activity
    constructor: (data)->
        angular.extend @, data
        @timestamp = Date.parse @timestamp

    isInScope: ->
        earliest = new Date (new Date()).setMinutes -ACTIVITY_WINDOW
        @timestamp < earliest

class ActivitySvc
    constructor: (socket)->
        @window = []
        @mostRecent = 0
        socket.$on 'window', (_)=> @setWindow _
        socket.$on 'activity', (_)=> @addActivity _

    setWindow: (window)->
        @window = window.map (_)-> new Activity _
        # TODO Reset sort bounds
        @

    getWindow: ->
        @window.slice(@mostRecent)

    addActivity: (data)->
        @window.push new Activity data
        @

    checkActivity: ->
        while not @window[@mostRecent].isInScope()
            @mostRecent += 1
        @

ActivitySvc.$inject = ['SocketSvc']

angular.module('dolores.activity.service', [
    'dolores.socket.service'
]).service 'ActivitySvc', ActivitySvc

```

In this program, an `Activity` is a timestamped list of things that have
happened in the system. The data isn't important, except that each data piece
has a `timestamp` field. The only business rule at this point is that pieces of
data older than a compile time threshold (currently 20 minutes) should not be
included in the view, but should be available for metrics, debugging, etc.

This example uses `socket.io`, with one exception - the `$on` method was added
to wrap `socket.io::on` in a call to `$rootScope.$apply`, letting Angular know
something has happened.
