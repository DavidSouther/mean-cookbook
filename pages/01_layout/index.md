---
title: Project Layout
---

### Problem

Developers working on complex projects must be able to quickly and easily find the code the need to edit to iterate on a feature.

### Solution

#### [Areas](./01_areas)

Separate the code first by execution domain, then by component hierarchy. Execution domain is which platform the code is expected to run in. Projects should have five common execution domains - the root itself, with project metadata; the deploy scripts, to start a project executing on a new system; the server which runs the data API; any code that comprises the SPA running on the client; and the tests and configurations that run entire feature tests for a project.

Before building the SPA, I recommend breaking your source code into four primary areas, within the root of your project. The first five recipes describe each of these areas -- what they're used for, what types of files live in them, and a recommended layout for components inside those modules.

1. **[Root](./01_areas/01_root)**
1. **[Deploy](./01_areas/02_deploy)**
1. **[Server](./01_areas/03_server)**
1. **[Client](./01_areas/04_client)**
1. **[Features](./01_areas/05_features)**

#### Languages

After choosing the project layout, teams today can also decide what, if any, transpiled languages to use. Transpiled languages generally serve as shorthand versions of the language they target. For instance, using Stylus in lieu of CSS allows developers to next CSS selectors, and automatically provides vendor prefixes for CSS properties. Adding these technologies does add complexity to a project; developers must understand both the underlying language, as well as the additional semantics the transpiled language provides. These sections will compare and contrast the tools, making some recommendations in a few places. If your team decides to skip the entire discussion and stick with vanilla, nothing will be lost.

1. **script**: *JavaScript* vs *Coffee* vs *Dart*
1. **markup**: *HTML* vs *Jade*
1. **styling**: *css* vs *Stylus* vs *SASS* vs *Less*

#### Build Toolchain

Once you've built a structure and layout, a build tool will orchestrate moving your source code into a small set of artifacts. This step can include transpiling, concatenationg, minifying, and even running tests at any stage of development. There are many tools available, with tradeoffs. Some work well together, others are more focuse on (and exclusive in) their space. This section looks at some of those.

1. **Grunt** *Task Configuration*
1. **Gulp** *Build Pipelines*
1. **stassets** *In memory map/reduce transpiler*
1. **Closure Compiler** *Static type safety*

#### Static Typing

As an advanced topic, there are tools available to provide various levels of compile time static typing. Teams coming from some strong typed backgrounds, especially Scala and similar, should find the tools in the section potentially very helpful.

### Discussion

Choosing a project layout has a surprising number of consequences for a team. The Java approach and conventional wisdom separates projects along language and environment seams. There are separate folders for `main/` and `test/`, and separate folders for language, `src/scala/com/...` and `src/java/...`. Rails and Rails-like stacks split the project along OO seams, creating different directories for `app/` and `test/`. Inside `app/` and `test/` are folders for `controllers/` and `templates/`. These approaches place the framework concepts front and center, forcing developers to think about the tools first and the business model second. To go from a controller to a template requires navigating up and then back down the directory structure.

A better conceptual approach is to break the application along business model seams. There are good reasons for doing so: for one, it places the conceptual model of the business itself at the forefront of development. This allows for easier mixing & matching of the various transpiled languages. Putting the business model and logic first builds in an ubiquitous language for the project, a useful concept from the field of Domain Driven Development. Team members see their business components first, and talk about the specific controller, schema, or template later. While mixing languages makes the build tools require more configuration, it usually falls to the difference in moving `coffee/**` to `**/*.coffee`. Teams can choose languages that are most comfortable to their style concerns.

After building a sensible project layout, teams can choose which of the various transpiled programming languages to use for various types of code. Broadly, the codebase has: scripts, bits of executable code; markup, declarations that will create the DOM structure; and styling, declarations to style portions of the DOM. These script types will need to be coordinated through a build system. Because SPAs are served as a collection of a half-dozen minified, compressed, cacheable files, this build process is the link between your one-module-per-file source directory, and your final `application.js` file.
