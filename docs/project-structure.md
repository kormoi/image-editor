# MART Editor Project Structure

## Overview

The project is organized into small, focused modules. Each folder has a single responsibility.

```
/
│
├── assets/
├── css/
├── docs/
├── js/
├── vendor/
├── index.html
├── README.md
└── package.json (future)
```

---

# js/

The `js` directory contains the editor source code.

```
js/
│
├── api/
├── canvas/
├── commands/
├── core/
├── events/
├── export/
├── history/
├── import/
├── nodes/
├── panels/
├── project/
├── selection/
├── serialization/
├── tools/
├── ui/
├── utils/
└── workers/
```

---

# api/

Responsible for communication with the host application.

Examples:

* Upload
* Download
* Authentication
* Permission checks
* Asset search

No rendering code belongs here.

---

# canvas/

Responsible for rendering.

Examples:

* Renderer
* Viewport
* Camera
* Grid
* Guides

The canvas never owns document data.

---

# commands/

Contains command objects.

Examples:

* AddNodeCommand
* DeleteNodeCommand
* MoveNodeCommand
* RotateNodeCommand

Commands are used by the History system.

---

# core/

Contains the engine itself.

Examples:

* Editor
* Document
* Project

This folder coordinates the editor.

---

# events/

Contains the event system.

Examples:

* EventBus
* Event definitions

---

# export/

Responsible for exporting.

Examples:

* PNG
* JPG
* SVG
* PDF

---

# history/

Contains Undo and Redo.

History should work through command objects.

---

# import/

Responsible for importing files.

Examples:

* SVG
* Image
* PDF
* MART

---

# nodes/

Contains every node type.

Examples:

```
GraphicObject
RectangleNode
PolygonNode
TextNode
ImageNode
LayerNode
ArtboardNode
```

Nodes store data only.

---

# panels/

Contains user interface panels.

Examples:

* Layers
* Properties
* Assets
* History
* Pages

---

# project/

Project management.

Examples:

* New Project
* Open Project
* Save Project
* Auto Save

---

# selection/

Selection system.

Examples:

* Multi-selection
* Bounding box
* Handles
* Hit testing

---

# serialization/

Responsible for converting objects.

Examples:

```
Document
↓

JSON
↓

MART
```

and

```
MART
↓

JSON
↓

Document
```

---

# tools/

Contains editor tools.

Examples:

* Selection
* Rectangle
* Polygon
* Image
* Text

Each tool should perform one task.

---

# ui/

General user interface components.

Examples:

* Dialogs
* Menus
* Toolbar
* Status Bar

---

# utils/

Shared helper functions.

Examples:

* Math
* Color
* Geometry
* UUID
* Units

Utility functions should not depend on editor state.

---

# workers/

Future background workers.

Examples:

* Export
* Compression
* Thumbnail generation

Heavy tasks should execute here whenever possible.

---

# Folder Rules

Each folder should have one clear responsibility.

Avoid placing unrelated code together.

If a file does not clearly belong in an existing folder, consider creating a new module instead of forcing it into an unrelated one.

Keeping responsibilities separated will make the editor easier to maintain as it grows.
