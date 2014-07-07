---
title: Testing with `$httpBackend`
---

### Problem

Testing rich-data services and components requires data from a server resource.

### Solution

Angular provides `$httpBackend` as a testing service to mock HTTP requests in an application. With the component-first code layout we use, the data for these tests lives side by side the services that consume it. This documents your expected wire format directly with the code that consumes it.

```tree
src/client
└── site
    ├── controller.coffee
    ├── controller.test.coffee
    ├── provider.coffee
    ├── provider.test.coffee
    └── site.mock.coffee
```

This component, the `site` from [flipflops][flipflops], holds the in-memory representation of a full CMS website. The provider works as a configurable service factory. This application defines its CMS data as an object with a key `site` containing overall site metadata, and a key `files` which is a hash of path to post and page data. This is the data that comes over the wire. After it's loaded, the service builds several convenience indexes. It also provides some utility accessors. The data for this is speced out in `site.mock.coffee`.

```coffeescript
angular.module('flipflops.site.mock', [])
.value 'SiteMock', '/site.json': JSON.stringify
    site :
        title: "FlipFlops",
        subtitle: "Quit blogging. Go to the beach.",
        author: "David Souther (DEVELOPMENT)"
    files:
        '/pages/01_chapter/01_section/index.markdown':
            front:
                title: 'Chapter 1 Section 1'
                path: '/pages/01_chapter/01_section/index.markdown'
            body: """Some text for chapter 1 section 1."""
        '/pages/01_chapter/02_section/index.md':
            front:
                title: 'Chapter 1 Section 2'
                path: '/pages/01_chapter/02_section/index.md'
            body: """Some text for chapter 1 section 2."""
        '/pages/01_chapter/index.md':
            front:
                title: 'Chapter 1 Intro'
                path: '/pages/01_chapter/index.md'
            body: """Some text for chapter 1 Intro."""
        '/pages/02_chapter/01_section/index.md':
            front:
                title: 'Chapter 2 Section 1'
                path: '/pages/02_chapter/01_section/index.md'
            body: """Some text for chapter 2 section 1."""
        '/pages/02_chapter/02_section/index.md':
            front:
                title: 'Chapter 2 Section 2'
                path: '/pages/02_chapter/02_section/index.md'
            body: """Some text for chapter 2 section 2."""
        '/pages/02_chapter/index.md':
            front:
                title: 'Chapter 2 Intro'
                path: '/pages/02_chapter/index.md'
            body: """Some text for chapter 2 Intro."""
```

To mock the data, we first define a new angular module `flipflops.site.mock`. That module has one export, a `value` to be injected for the test as `SiteMock`.
That value has a key/value mapping of http endpoints to strings of JSON data. Those keys are then available to inject into the provider test.

```coffeescript
describe 'Site', ->
    describe 'Service', ->
        beforeEach module 'flipflops.site', 'flipflops.site.mock'

        $httpBackend = null
        beforeEach -> inject (_$httpBackend_)->$httpBackend = _$httpBackend_
        beforeEach -> inject (SiteMock)-> httpBackend SiteMock

        it 'sets basic metadata', inject (Site)->
            $httpBackend.flush()
            Site.title.should.equal 'FlipFlops', 'Title'
            Site.author.should.equal 'David Souther (DEVELOPMENT)', 'Author'

        describe 'page', ->
            it 'generates good page indexes', inject (Site)->
                index = [
                    '/pages/01_chapter/index.md'
                    '/pages/01_chapter/01_section/index.markdown'
                    '/pages/01_chapter/02_section/index.md'
                    '/pages/02_chapter/index.md'
                    '/pages/02_chapter/01_section/index.md'
                    '/pages/02_chapter/02_section/index.md'
                ]

                $httpBackend.flush()
                Site.index.should.exist
                Site.index.should.have.property('pages')
                Site.index.pages.length.should.equal 6
                Site.index.pages.should.deep.equal index
```

This test is a good layout for backend tests. It begins with declaring dependencies on the modules `flipflops.site` and `flipflops.site.mock`. The second is that module we just defined with the mock data. It then injects the $httpBackend to a script local variable. Finally, it passes the `httpBackend` helper (see the [overview][/02_testing/02_angular] on angular testing) the url/data mappings from the mock, before continuing on to the actual tests.

Both tests inject the `Site`, as exported from `flipflops.site`, to the `it` test block. Both start with flushing the http cache. Because each module is reloaded on each new describe block, this give the test writer control over when the `$http` services will be executed. This then allows tests to assert on both pre and post request state. Finally, both tests run through some basic assertions.

### Discussion

The `$httpBackend` service is one of several modules provided by the Angular team to ease testing. Its `flush()` method, along with similar methods on `$timeout` and other async services, make testing much simpler by creating explicit flow constructs around asynchronous code. Given JavaScript's implicit single-threaded nature, this approach is not frought with the concurrency perils other languages might face.

[flipflops]:
