# MART Editor Node System

## Overview

Everything inside MART Editor is represented as a node.

The document is a tree of nodes, commonly referred to as the **scene graph**.

Every object visible in the editor exists somewhere in this hierarchy.

---

# Scene Graph

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
     │      │      ├── Ellipse
     │      │      ├── Polygon
     │      │      ├── Text
     │      │      ├── Image
     │      │      └── SVG
     │      │
     │      └── Layer
     │
     └── Artboard
```

---

# Why Nodes?

Using a node-based scene graph provides:

* Consistent hierarchy
* Easy serialization
* Unlimited nesting
* Groups
* Layers
* Multiple artboards
* Efficient rendering
* Easier undo/redo

---

# Base Properties

Every node should contain:

```javascript
id
type
name
parent
children
visible
locked
selected
metadata
```

Every node should have a unique ID.

---

# Graphic Objects

Graphic objects extend the base node and add rendering information.

Common properties include:

```javascript
transform
style
opacity
blendMode
```

Graphic objects represent visible elements.

---

# Transform

Every graphic object contains a transform.

```javascript
transform {

    x

    y

    width

    height

    rotation

    scaleX

    scaleY

    flipX

    flipY

}
```

The renderer should only read these values.

---

# Style

Appearance is stored separately.

```javascript
style {

    fill

    stroke

    strokeWidth

    shadow

}
```

Additional style properties may be added without changing the rendering architecture.

---

# Parent / Child Relationship

Each node knows its parent.

Container nodes also manage their children.

```
Artboard

↓

Layer

↓

Rectangle
```

Removing a parent removes all of its descendants.

---

# Node Types

Current node types include:

* Root
* Artboard
* Layer
* Rectangle

Planned node types:

* Ellipse
* Polygon
* Line
* Text
* Image
* SVG
* Group
* Mask
* Frame
* Component

---

# Selection

Selection references node IDs rather than Fabric.js objects.

The document remains the source of truth.

---

# Rendering

The renderer traverses the node tree.

```
Document

↓

Traverse Nodes

↓

Create Fabric Objects

↓

Canvas
```

Fabric.js objects are temporary render representations.

Nodes contain the actual document data.

---

# Serialization

Nodes must be serializable.

Every property required to rebuild the document should exist in the node.

Runtime-only information should not be stored.

---

# Future Extensions

The node system should support future capabilities without redesign.

Examples include:

* Constraints
* Auto layout
* Variables
* Components
* Symbols
* Animation
* Filters
* Smart objects
* Plugin data

New features should extend the node system rather than replace it.
