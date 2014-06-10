# MEAN FAQ

The time of the Single Page App has come. Web development since even before
Rails in 2008 has been well served by the 3-tier architecture, with a web server
running Ruby, PHP, or Python pulling data from MySQL or Postgress, and rendering
a mostly static HTML asset. With the great strides in HTML5 browser
technologies, since 2012 it's been feasible to build Single Page Applications,
and as of 2014 it is practical. A SPA, rather than sending fully rendered HTML
for ever request, serves a bundle of static assets that contain code for the
entire site. This code then calls services for data through APIs, allowing
much flexibility in a system's architecture. This approach can still be 3-tier,
but now the web tier is responsible for serving data, not HTML.

There are numerous frameworks and technologies to choose between, for all layers
of the SPA stack. One set, becoming a buzzword in itself, is the MEAN approach.
A play on LAMP,  MEAN is a collection of technologies for building a SPA stack -
MongoDB, a schemaless, disk-backed database; ExpressJS, a highly extensible
middleware based HTTP handler; AngularJS, a powerful and expressive javascript
interface framework; and NodeJS, a highly asynchronous server platform written
in Javascript. This approach takes some frankly fantastic technologies, and
allows development teams to focus their efforts in the Javascript space. This
provides real benefits to teams in following a single set of best practices;
due to its inherent asynchronous nature, the Javascript Callback and Promises
patterns are leveraged at all layers of the stack. That said, the approach is
highly decoupled, and any piece can be swapped out for a more appropriate
technology as needed.

Alas, there are no frameworks as solid as Ruby on Rails for building SPAs. This
isn't a bad thing - because the technologies for building SPAs are so
decouplable, rather than providing a single architecture for every team to plug
in to, it is better to learn where each of the pieces fit together, and how to
use each effectively. This Cookbook is a collection of those best practices and
techniques, taken from experience building these systems over the past few
years. Taken a la cart, a team or developer can find good tutorials and info on
building certain parts of their application. Taken as a whole, a team can build
a full SPA stack that fits their business use case like a glove.

## Project Layout

Choosing a project layout has a surprising number of consequences for a team.
The Java approach and conventional wisdom to date have separated projects down
language and environment seams, keeping separate folders for main/ and test/,
and inside separate folders for language, src/main/scala/ and src/main/java.
Rails and Rails-likes split the project along OO seams, creating different
directories for app/ and test/, and inside app for controllers/ and templates/.
These approaches place the framework concepts front and center, making people
think about the tools first and the business model second. To go from a
controller to a template requires navigating up and then back down the directory
structure.

A better conceptual approach is to break the application along business model
seams. There are two main reasons for doing so: it places the conceptual model
of the business itself at the forefront of development, and allows easier mix &
match of the various transpiled languages. Putting the business model and logic
first builds in a ubiquitous language for the project, a very useful concept
from the field of Domain Driven Development. Team members see their business
components first, and talk about the specific controller, schema, or template
later. While mixing languages makes the build tools take slightly more
configuration, it usually falls to the difference in moving `coffee/**` to
`**/*.coffee`. Teams can choose languages that are most comfortable to their
style concerns.

### Components
1. **Deploy**
1. **Server**
1. **Client**
1. **Features**

### Languages

1. **script**: *JavaScript* vs *Coffee* vs *Dart*
1. **markup**: *HTML* vs *Jade*
1. **styling**: *css* vs *Stylus* vs *SASS* vs *Less*

### Build Toolchain

1. **Grunt** *Task Configuration*
1. **Gulp** *Build Pipelines*
1. **Closure Compiler** *Static type safety*

### Static Typing

## Testing

Testing is a great sane technique for developers to have confidence in their
code. While learning testing can be daunting to many teams, the community
support and tooling around testing in the MEAN world is truly sublime. Teams
don't have to test first, but with the techniques in this chapter, they can test
when they want. These recipes cover all levels of the SPA stack, from unit
testing through full user integration and regression tests, with code coverage
tools along the way.

### Server
1. **Supertest**
1. **Logging**
1. **Coverage**

### Angular
1. **$httpBackend**
1. **Managing Injections**
1. **Rendering Directives**
1. **Coverage**

### Integration / Feature
1. **cucubmberjs**, *qcumber*, *qcumberbatch*
1. **Mappings Model**

### BDD / TDD
1. **Writing Failing Features**
1. **Writing Failing Server Tests**
1. **Writing Failing Client Tests**

## Deployment

Deployment for many can be a black box, something handled by the SysOps team and
never shall the Devs and Ops meet. While this has worked for many teams and
organizations, the experiences and successes of continuous integration at places
like Etsy speak to the benefits of a DevOps culture. These recipes provide some
techniques for handling the deployment of each of the main pieces of the MEAN
stack, and provide a template for orchestrating much larger and more complex
deployments.

1. **Node** *Install*, *Start*, *Stop*
1. **Mongo** *Install*, *Start*, *Stop*, *Snapshot*, *Restore*, *Drop*
1. **Managing Environment vars**
1. **Blue / Green / Round**
1. **Docker**
1. **Heroku**

## Client

The client, in the MEAN stack, is anything that runs on a user's device, outside
the server. In practice, this means code that is running in a browser, or in a
WebView on a mobile device. Angular provides numerous framework utilities,
including dependency injection for application management; a complete MVVM
architecture; extensible HTML components; and a full http & REST suite. There
are also many techniques to manage CSS, a common contributor of technical debt
to large web applications.

### Organization
1. **Services**
1. **Controllers**
1. **Directives**
1. **Filters**
1. **Providers**

### Data
1. **$http**
1. **$resource**
1. **Restangular**
1. **Sockets**

### Forms
1. **css**
1. **ngModelOptions**
1. **Custom Validation**
1. **ngMessage**

### Utility Directives
1. **Using ngModel**
1. **th(sort)**
1. **select**

### Styles
1. **Bootstrap**
1. **BEM**
1. **all** / **print** / **screen**

### Animation
1. **css**
1. **ngAnimate**
1. **Staggering Animations**

## Advanced Client

Injecting outside the box, Angular provides a great paradigm to build incredibly
rich user interfaces and components. These recipes should serve as a jumping off
point for adding increasingly fantastic functionality to your SPA.

### Routing / History / State

1. **ngRoute**
1. **ui-router**

### Complex UX Controls

1. **Tables**
1. **Modals**
1. **Wizards**

### Wrapping HTML5 as Services

1. **LocalStorage**
1. **FileReader**
1. **Geolocation**
1. **WebRTC** *Audio*, *Video*, *P2P*

### Visualizations

1. **d3 interop**
1. **SVG**
1. **WebGL**

### Analytics

1. **segment.io**

### Security

### Performance

1. **3d rendering**

## Mobile
*Don't Be Crazy*

By following that simple rule, your SPA will work on a mobile device. With a few
wrapper technologies, your SPA will be its own distributable, on both the Play
and App stores (or distributed internally, for internal tools).

### Application Cache

### Rarely On

### Ionic

### Cordova

1. **Bundling**
1. **Installing**
1. **Phone Features**

## Server

The Server is anything that runs on your hardware, in the cloud or data center.
The server should be focused entirely on providing an API for your business'
data. Whether this is only privately accessible, or open for your customers to
use responsibly, the server recipes will get you from zero to REST. The concepts
are applicable across other server backends, and the flexibility of a RESTful
API pays back in spades.

### Logging
1. **winston**
1. **What to Log**

### File System
1. **fs**
1. **Q.denodeify**

### Mongo
1. **mongo native driver**
1. **mongoose-q**
1. **express-restify-mongoose**

### SQLite
1. **node-sqlite3**
1. **RESTify**

### Passport
1. **Local**
1. **Google**
1. **Locking down resources**

## Realtime

Realtime data takes a special level of consideration that cuts across the server
and client.

### Distributed Eventing

### socket.io
