# MART Editor Rendering Pipeline

## Overview

The rendering pipeline is responsible for converting the document into graphics displayed on the canvas.

The renderer never owns the document.

The document always remains the single source of truth.

---

# Rendering Flow

```
User Input
      │
      ▼
Active Tool
      │
      ▼
Create / Modify Node
      │
      ▼
Document
      │
      ▼
Renderer.render()
      │
      ▼
Traverse Scene Graph
      │
      ▼
Create Fabric Objects
      │
      ▼
Canvas
```

---

# Source of Truth

The renderer does **not** store permanent data.

All permanent information lives inside the Document.

Example:

```
RectangleNode

↓

transform.x

↓

Renderer

↓

fabric.Rect.left
```

If the Fabric object disappears, the document still contains the rectangle.

---

# Render Cycle

A typical render cycle:

```
Document Changed

↓

Renderer.render()

↓

Clear Canvas

↓

Draw Artboards

↓

Draw Layers

↓

Draw Objects

↓

Render Complete
```

Rendering should always reflect the current document state.

---

# Responsibilities

## Document

Responsible for:

* Object data
* Layer order
* Visibility
* Lock state
* Object hierarchy

---

## Renderer

Responsible for:

* Drawing
* Redrawing
* Viewport
* Zoom
* Pan
* Temporary previews

---

## Tools

Responsible for:

* Creating nodes
* Modifying nodes
* Requesting a render

Tools should never permanently draw objects.

---

# Render Order

Objects are rendered according to the scene graph.

```
Artboard

↓

Layer

↓

Object 1

↓

Object 2

↓

Object 3
```

Objects later in the layer appear above earlier ones.

---

# Temporary Objects

Temporary graphics exist only while editing.

Examples:

* Rectangle preview
* Polygon preview
* Selection rectangle
* Snap guides
* Hover highlights

These objects should never be added to the Document.

---

# Selection

Selection belongs to the editor state.

A selected object is still rendered from its node.

The renderer only draws selection visuals.

---

# Performance

The renderer should avoid unnecessary work.

Preferred strategy:

```
Document Changed

↓

Mark Dirty

↓

Render Once
```

Multiple updates during the same frame should result in a single render whenever possible.

---

# Future Optimizations

Possible improvements include:

* Dirty rectangle rendering
* Layer caching
* Offscreen canvas
* Web Workers
* GPU acceleration
* Virtual rendering
* Render batching

These optimizations should not change the document model.

---

# Design Rule

The renderer is a translator.

It translates document nodes into visual objects.

It should never become responsible for editing, business logic, permissions, history, or project management.
