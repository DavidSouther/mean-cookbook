---
title: Supertest (HTTP Testing)
---

### Problem

External HTTP server endpoints and APIs must be tested.

### Solution

Use the [superagent][superagent] library and a consistent express routing method to test API endpoints. In this example, the `stassets` library attaches routes for many static compiled files; the tests assert that the routes match some fixtures.

```coffee
# ./src/server/stassets/test.coffee
app = require('express')()

app.use(require('./handler')) # Load the component
request = require('supertest')(app) # Prepare the route

describe "Server", ->
    describe "index.html", ->
        it "returns an index", (done)->
            request.get('/index.html')
            .expect(200)
            .end done

    describe "styles", ->
        describe "all", ->
            it "returns a stylesheet", (done)->
                request.get('/all.css')
                .expect(200)
                .expect('content-type', /text\/css/)
                .end done

    describe "javascript", ->
        describe "templates", ->
            it 'returns compiled templates', (done)->
                request.get('/template.js')
                .expect(200)
                .expect('content-type', /application\/javascript/)
                .end done

```

### Discussion

Superagent wraps an HTTP server and can make any type of HTTP request. It can set headers, send data in many formats, check response headers, and provide the response body for further assertions.

[superagent]: https://github.com/visionmedia/superagent
