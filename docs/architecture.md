# MART Editor Architecture

## Vision

MART Editor is a professional graphics editor designed around a clean, modular architecture. The editor itself is responsible only for graphics, editing, rendering, and document management. Business logic such as authentication, subscriptions, permissions, billing, AI credits, and asset ownership is handled by the host application or backend.

---

# Core Principles

* The editor is a graphics engine.
* The website controls business logic.
* The Document is the single source of truth.
* The Renderer never stores document data.
* Tools never draw permanent graphics.
* Everything is represented as Nodes.
* Projects are saved using the `.mart` format.

---

# High Level Architecture

```
Editor
│
├── Document
│
├── Renderer
│
├── Tool Manager
│
├── History
│
├── Event Bus
│
├── Panels
│
└── API Layer
```

---

# Document Structure

A document is represented as a scene graph.

```
Document
│
└── Root
     │
     ├── Artboard
     │      │
     │      ├── Layer
     │      │      │
     │      │      ├── Rectangle
     │      │      ├── Polygon
     │      │      ├── Image
     │      │      ├── Text
     │      │      └── SVG
     │      │
     │      └── Layer
     │
     └── Artboard
```

Everything that appears inside the editor exists inside this hierarchy.

---

# Rendering Pipeline

```
Tool

↓

Create Node

↓

Document.addNode()

↓

Renderer.render()

↓

Fabric.js Objects

↓

HTML Canvas
```

The Renderer reads the document and converts nodes into Fabric.js objects.

The Renderer never owns the data.

---

# Tools

Tools create and modify document nodes.

Examples:

* Selection Tool
* Rectangle Tool
* Polygon Tool
* Image Tool
* Text Tool

A tool should never permanently draw graphics directly on the canvas.

Instead, a tool updates the Document.

---

# Renderer

Responsibilities:

* Draw artboards.
* Draw objects.
* Redraw after changes.
* Handle viewport rendering.

The renderer does not decide business rules.

---

# Document

Responsibilities:

* Store every node.
* Manage layers.
* Manage artboards.
* Add nodes.
* Remove nodes.
* Find nodes.
* Traverse the scene graph.

The Document is always considered the source of truth.

---

# History

Every user action should become a command.

Examples:

* AddNodeCommand
* DeleteNodeCommand
* MoveNodeCommand
* ResizeNodeCommand
* RotateNodeCommand

History provides Undo and Redo.

---

# Backend Integration

The editor never decides whether a user is allowed to perform an action.

Instead, it asks the host application.

Examples:

* Can export?
* Can use premium assets?
* Can use AI?
* Can download?
* Can upload?

The backend returns the decision.

---

# Project Format

Projects are stored using the `.mart` file format.

The file contains:

* Document settings
* Artboards
* Layers
* Graphic objects
* Assets
* Metadata

---

# Long-Term Goals

* Multiple artboards
* Unlimited layers
* Polygon editing
* Smart guides
* Snapping
* SVG support
* Image editing
* Text editing
* Undo/Redo
* Asset library
* Plugin system
* Backend API integration
* Professional export pipeline

---

# Development Philosophy

The architecture should remain modular.

Each component should have a single responsibility.

Features should be added without redesigning the core architecture.

The editor should remain independent from the website so it can be embedded into different applications with minimal changes.
