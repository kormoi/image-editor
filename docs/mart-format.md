# MART File Format Specification

## Overview

`.mart` is the native project format used by MART Editor.

A MART project stores the complete state of a document, including pages, layers, graphic objects, assets, and metadata.

The editor can reconstruct an entire project from a single `.mart` file.

---

# Design Goals

* Fast loading
* Fast saving
* Versioned
* Extensible
* Platform independent
* Suitable for cloud storage
* Suitable for local storage

---

# File Extension

```
.mart
```

---

# Internal Format

The initial implementation stores UTF-8 JSON.

Later versions may optionally compress the file before saving.

The internal document structure remains the same regardless of compression.

---

# Root Structure

```json
{
    "version": 1,
    "project": {},
    "assets": {},
    "metadata": {}
}
```

---

# Project

The project section contains document information.

Example fields:

* Project ID
* Project Name
* Created Date
* Modified Date
* Document Size
* Measurement Unit
* DPI

---

# Artboards

Each project contains one or more artboards.

Each artboard contains:

* Name
* Width
* Height
* Background
* Layers

---

# Layers

Layers contain graphic objects.

Layer properties include:

* Name
* Visibility
* Locked
* Opacity
* Blend Mode

---

# Graphic Objects

Each object stores:

* ID
* Type
* Transform
* Style
* Metadata

Examples:

* Rectangle
* Polygon
* Image
* Text
* SVG

---

# Transform

Every graphic object contains:

* Position
* Width
* Height
* Rotation
* Scale
* Flip

---

# Style

The style section contains appearance.

Examples:

* Fill
* Stroke
* Stroke Width
* Opacity
* Shadow
* Blend Mode

---

# Assets

Assets are shared resources referenced by objects.

Examples:

* Images
* Fonts
* SVG Files
* Brushes
* Patterns

Objects reference assets instead of duplicating them.

---

# Metadata

Metadata stores information not directly related to rendering.

Examples:

* Author
* Application Version
* Save Date
* Tags
* Notes

---

# Versioning

Every `.mart` file contains a version number.

Example:

```
version: 1
```

Future versions should remain backward compatible whenever possible.

Migration code should convert older project formats into the current version.

---

# Compression

Version 1 stores readable JSON.

Future versions may optionally use compression while preserving the same internal structure.

The editor should detect compression automatically during loading.

---

# Backend Compatibility

The `.mart` format is independent of any backend.

Projects can be:

* Saved locally
* Stored in cloud storage
* Sent through an API
* Shared between users

without changing the internal format.

---

# Future Extensions

Future versions may include support for:

* Multiple pages
* Linked assets
* Embedded thumbnails
* Document previews
* Collaboration metadata
* Comments
* Version history
* Plugin data
* Custom object types

The format should remain extensible without breaking existing projects.
