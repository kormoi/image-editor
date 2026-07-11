# MART Editor Serialization System

## Overview

Serialization is the process of converting the document into a format that can be saved, transferred, and restored.

Deserialization performs the reverse operation by rebuilding the document from saved data.

---

# Goals

The serialization system should be:

* Fast
* Versioned
* Deterministic
* Extensible
* Platform independent

The same document should always produce the same serialized output.

---

# Serialization Flow

```text
Document

↓

Scene Graph

↓

Serializable Objects

↓

JSON

↓

.mart
```

Loading follows the reverse process.

```text
.mart

↓

JSON

↓

Node Objects

↓

Document

↓

Renderer.render()
```

---

# Serializable Data

Every node should store only persistent information.

Examples:

* ID
* Type
* Name
* Transform
* Style
* Visibility
* Lock State
* Metadata

---

# Runtime Data

Runtime information must never be saved.

Examples:

* Fabric.js objects
* Selection handles
* Mouse position
* Temporary previews
* Cached render data
* Active tool state

These are recreated when the editor starts.

---

# Object Serialization

Each node should provide:

```javascript
serialize()
```

which returns a plain JavaScript object.

Example:

```javascript
{
    id,
    type,
    transform,
    style,
    metadata
}
```

---

# Object Deserialization

Each node type should provide:

```javascript
deserialize(data)
```

or be reconstructed through a factory.

The loader should recreate the correct node type from the saved data.

---

# Node Factory

During loading, objects should not be created manually.

Instead:

```text
Node Data

↓

Node Factory

↓

RectangleNode

↓

GraphicObject

↓

Document
```

This keeps loading logic centralized.

---

# Asset References

Large assets should be referenced rather than duplicated.

Example:

```javascript
{
    assetId: "img_01"
}
```

The asset manager resolves the reference during loading.

---

# Versioning

Every project must include a version number.

Example:

```javascript
{
    version: 1
}
```

Future versions should migrate older formats when possible.

---

# Validation

Before loading, the serializer should validate:

* Required fields
* Supported version
* Object types
* Missing assets

Invalid projects should produce clear errors rather than partially loading.

---

# Future Extensions

The serialization system should support future additions without breaking compatibility.

Possible extensions include:

* Compression
* Encryption
* Embedded thumbnails
* Plugin data
* Collaboration metadata
* Digital signatures
* Incremental saves

---

# Design Rule

The serialization system should never depend on Fabric.js.

It operates only on the document model.

The renderer is responsible for recreating the visual representation after the document has been loaded.
