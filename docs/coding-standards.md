# MART Editor Coding Standards

## Purpose

This document defines the coding standards used throughout MART Editor. Following these rules keeps the codebase consistent, readable, and maintainable.

---

# General Principles

* Keep classes focused on a single responsibility.
* Prefer readability over clever code.
* Keep methods short whenever practical.
* Avoid duplicate logic.
* Use meaningful names for variables, methods, and classes.
* Do not mix business logic with rendering logic.

---

# File Structure

Each file should contain one primary class.

Example:

```
RectangleTool.js
SelectionTool.js
Renderer.js
Document.js
```

Avoid multiple unrelated classes in a single file.

---

# Class Naming

Classes use PascalCase.

Examples:

```
RectangleNode
SelectionTool
Renderer
History
```

---

# File Naming

Files use PascalCase to match their exported class.

Examples:

```
RectangleNode.js
PolygonTool.js
Renderer.js
```

---

# Variables

Use camelCase.

Examples:

```
activeLayer
selectedNode
mousePosition
projectWidth
```

Avoid unclear names such as:

```
obj
tmp
data1
value2
```

unless their purpose is obvious from context.

---

# Constants

Use descriptive constant names.

Example:

```
const DEFAULT_STROKE_WIDTH = 1;
```

Avoid magic numbers scattered throughout the code.

---

# Methods

Method names should describe actions.

Examples:

```
addNode()
removeNode()
findNode()
render()
serialize()
```

Avoid vague names such as:

```
process()
handle()
updateStuff()
```

---

# Comments

Write comments that explain **why**, not **what**.

Good:

```javascript
// Prevent selecting the artboard.
```

Avoid:

```javascript
// Set x to x.
```

The code should already explain what it does.

---

# Event Names

Use lowercase with namespaces.

Examples:

```
document:created
node:added
layer:selected
history:undo
renderer:updated
```

---

# Node Rules

Every graphic object should inherit from the common base class.

Each node should contain only data.

Nodes should never perform rendering.

---

# Renderer Rules

The renderer reads the document.

The renderer creates Fabric.js objects.

The renderer never modifies business logic.

---

# Tool Rules

Tools create or modify nodes.

Tools should not permanently draw graphics.

Temporary previews are allowed.

---

# Document Rules

The document is the single source of truth.

Every permanent object must exist inside the document tree.

---

# History Rules

Every user action should become a command.

Examples:

* Add Node
* Delete Node
* Move Node
* Resize Node

Undo and Redo should work through commands rather than directly modifying objects.

---

# Formatting

* Use four spaces for indentation.
* Always use braces for blocks.
* Use semicolons consistently.
* Leave a blank line between logical sections.
* Keep line lengths readable.

---

# Imports

Group imports together at the top of the file.

Order imports consistently throughout the project.

---

# Future Rule

When adding a new feature, first ask:

* Does this belong in the Document?
* Does this belong in the Renderer?
* Does this belong in a Tool?
* Does this belong in the Backend?

Placing code in the correct module is more important than writing the code itself.
