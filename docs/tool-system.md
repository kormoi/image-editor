# MART Editor Tool System

## Overview

A tool represents a user interaction mode.

Only one tool may be active at a time.

Examples:

* Selection
* Rectangle
* Ellipse
* Polygon
* Pen
* Text
* Image
* Crop
* Eyedropper

The Tool Manager is responsible for activating and deactivating tools.

---

# Tool Lifecycle

Every tool follows the same lifecycle.

```text
ToolManager

↓

activate()

↓

Mouse / Keyboard Events

↓

deactivate()
```

---

# Base Methods

Every tool should inherit from the base `Tool` class.

Common methods:

```javascript
activate()

deactivate()

onMouseDown()

onMouseMove()

onMouseUp()

onKeyDown()

onKeyUp()

cancel()
```

Unused methods may remain empty.

---

# Responsibilities

A tool is responsible for:

* Handling user input
* Creating nodes
* Modifying nodes
* Displaying temporary previews
* Requesting a render

A tool is **not** responsible for:

* Rendering permanent objects
* Saving projects
* Managing history directly
* Checking permissions
* Exporting files

---

# Tool Manager

The Tool Manager maintains the active tool.

Example:

```text
Rectangle Tool

↓

Selection Tool

↓

Polygon Tool
```

Only one tool receives input events at a time.

---

# Event Flow

```text
Mouse Event

↓

Tool Manager

↓

Active Tool

↓

Document

↓

Renderer.render()
```

The Tool Manager routes events without knowing how each tool works.

---

# Temporary Objects

Tools may create temporary graphics.

Examples:

* Rectangle preview
* Polygon preview
* Selection rectangle
* Crop overlay
* Snap guides

Temporary objects should never become part of the document.

They should be removed when the operation finishes or is cancelled.

---

# Creating Objects

The recommended workflow:

```text
Mouse Down

↓

Create Preview

↓

Mouse Move

↓

Update Preview

↓

Mouse Up

↓

Create Node

↓

Document.addNode()

↓

Renderer.render()
```

The preview is temporary.

The node is permanent.

---

# Editing Objects

Editing tools should modify nodes.

Example:

```text
Select Rectangle

↓

Move

↓

Update transform

↓

Renderer.render()
```

The Fabric.js object should reflect the node, not replace it.

---

# Keyboard Support

Tools may respond to keyboard shortcuts.

Examples:

* Esc → Cancel current operation
* Shift → Constrain proportions
* Alt → Draw from center
* Ctrl → Duplicate while dragging

Shortcuts should remain consistent across tools whenever possible.

---

# Cursor

Each tool should define its preferred cursor.

Examples:

```text
Selection → default

Rectangle → crosshair

Text → text

Crop → crosshair

Hand → grab
```

The Tool Manager should update the cursor when the active tool changes.

---

# Future Tools

Planned tools include:

* Move
* Rectangle
* Ellipse
* Polygon
* Pen
* Pencil
* Line
* Arrow
* Text
* Image
* Crop
* Eyedropper
* Gradient
* Shape Builder
* Measure

All new tools should follow the same lifecycle and responsibilities defined in this document.
