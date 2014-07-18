---
title: AngularJS Module Organization
---

### Problem

AngularJS has a specific module layout, using terminology that is not
imediateley intuitive to developers from other projects.

### Solution

In this section, we'll go through each of the AngularJS `module` methods,
discuss what they are for, and look at their best practices.

Modules themselves are little different from any other module system - a module
has a name, a (possibly empty) dependency list, and whatever symbols it defines.
Those definitions are limited, but provide a well-demonstrated set of component
types. We'll explore those in each of the parts of this section.

There are two approaches to organizing modules. Most applications start with the
all-in-one approach, defining a single module name for all the app code and
filling it with all the components necessary. This approach does not scale.
Preferred is a one module per file approach, with module names inferred from
(but not mandated by) the folder structure. In this approach, each module name
has the form `app.component.subcomponent.piece`, where `app` is the name of the
app as whole, `component` and `subcomponent` match the folder structure in the
`src/client/` part of the project, and `piece` is [`service`](./01_services),
[`controller`](./02_controllers), [`directive`](./03_directives),
[`filter`](./04_filters), or [`provider`](./05_providers). This full string is
the name other modules will use to load the module.

In this format, a project's file headers begin to look similar to a Java class
definition or Python import section. This sample, from [FlipFlops][flipflops],
manages a `page` of a website as a whole, with sections for the header, footer,
content, etc.

```coffeescript
angular.module('flipflops.page.directive', [
    'flipflops.site.controller'
    'flipflops.page.banner.directive'
    'flipflops.page.navigation.directive'
    'flipflops.page.sidebar.directive'
    'flipflops.page.footer.directive'

    'flipflops.content'

    'page.template'
]).directive 'ffPage', ->
    restrict: 'AE'
    templateUrl: 'page'
```

The first line declares what the module name is, for others to use. The next
few lines list its dependencies. In this case, it's mostly directives, with a
controller, template, and server thrown in for good measure. The templates have
their own convention with module naming (dropping the app name), this is
enforced for this app at the build level. See the
[sample gruntfile](/01_layout/01_areas/04_client) for more details.

[flipflops]:
