---
title: Project Root Layout
---

## Problem

The root of a project easily gets overloaded with intermediate files.

## Solution

The files in the project root should be limited to editable, project wide configuration, and one folder, `src/`, that all editable source code lives in.

```tree
% tree -a -L 1 --dirsfirst
.
├── .git # Managed by [git][git], for version control.
├── bower_components #  Managed by [bower][bower], for client-side dependencies.
├── build # Managed by [grunt][grunt] as part of the build process.
├── log # Available for writing by the server and libraries at runtime.
├── node_modules # Managed by [npm][npm] for server and build dependencies.
├── run # Available for db files and other long-term server persistance.
├── tmp # Available for PIDs and other short-term server persistence.
├── src # The project's source code. The only directory whose code can be edited.
├── .coffeelintrc # Project coffee linting rules.
├── .jshintrc # Project javascript linting rules.
├── .gitignore # Project git ignores, fileed with above directories.
├── Gruntfile.coffee # Grunt build configuration (or Gulpfile.js, etc).
├── README.md # Project README. Should include a brief overview of the project and a quickstart guide, at minimum.
├── app.js # Backend entry point to the application, by convention.
├── newrelic.js # DevOps configuration.
├── bower.json # Configuration for client dependencies.
└── package.json # Main project configuration, as well as build and server dependencies.
```

## Discussion

Keeping a clean separation between editable and generated files is critical as projects grow. In a typical MEAN application, there are folders reserved for dependencies (`bower_components` and `node_modules`), folders for runtime files (`log`, `run`, and `tmp`), folders for intermediate transpilation steps (`build`), and possibly more. Project wide configuration settings (`coffeelint`, `jslint`) apply to every area, and don't need duplicating. Some files are expected by convention - `README.md` by GitHub & other source control viewers, and `app.js` by [Phusion Passenger][passenger] and other application monitors.

[git]: http://git-scm.com/
[bower]: http://bower.io/
[npm]: http://npmjs.org/
[grunt]: http://gruntjs.com/
[passenger]: https://www.phusionpassenger.com/
