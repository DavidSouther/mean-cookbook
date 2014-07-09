---
title: Deploy Scripts Layout
---

### Problem

A MEAN application has several server-side requirements at runtime, all of which need to be orchestrated.

### Solution

Within the project's `src` folder, create an area for `deploy`. This will have a folder for each server process that needs to run. Inside those folders, at least a `start.sh` and `stop.sh` should be present. This is a file listing from a project with a Node server backed by a Mongo database.

```tree
% tree
.
└── src
    ├── client
    ├── deploy
    │   ├── Gruntfile.coffee
    │   ├── env
    │   │   └── load.sh
    │   ├── mongo
    │   │   ├── drop.sh
    │   │   ├── dump.sh
    │   │   ├── restore.sh
    │   │   ├── start.sh
    │   │   └── stop.sh
    │   └── node
    │       ├── start.js
    │       ├── start.sh
    │       └── stop.sh
    ├── features
    └── server
```

The node and mongo server each have a `start.sh` and `stop.sh` script, which manage their individual processes using PIDs written to `./run` in the project root. In this example, the node `start.sh` will call mongo's `start.sh` directly. Both will call `env/load.sh`, which sets several environment variables to control runtime behavior. The `Gruntfile.coffee` is optional, and is for any build-time tasks that need to happen to keep the working directory clean for deployment.

The mongo server has a few additional scripts to handle database deployment. The drop, dump, and restore scripts all allow for quick migration of data between environments and instances. Node's `start.js` script is a convenient node entry point, though it could have shared that duty with `app.js` in the project root.

### Discussion

While the sample app only has a mongo and a node server, any server process which needs start and stop before the application is running can go here. Having a consistent set of shell scripts for deploying pieces of a stack eases development long term. Sysops teams have a consistent way to interact with the application. This consistency helps new devs quickly troubleshoot any changes they might need to make to the runtime setup. Having these scripts in their own area of the project allows the technologies to grow, seperately from any one portion of the source code itself. For more details on what to put in these scripts, see the chapter on [deployment][deployment].

[deployment]: /03_deployment
