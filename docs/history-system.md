# MART Editor History System

## Overview

The History System records every document modification so users can undo and redo their actions.

History should record **operations**, not snapshots.

---

# Design Goals

* Unlimited undo (configurable limit)
* Fast execution
* Low memory usage
* Support batching multiple operations
* Easy to extend

---

# Command Pattern

Every modification is represented by a command.

Examples:

* AddNodeCommand
* DeleteNodeCommand
* MoveNodeCommand
* ResizeNodeCommand
* RotateNodeCommand
* ChangeStyleCommand

Each command must know how to execute and undo itself.

---

# Command Interface

Every command should implement:

```javascript
execute()

undo()

redo()
```

`redo()` may simply call `execute()` unless additional behavior is required.

---

# History Flow

```text
User Action
      │
      ▼
Create Command
      │
      ▼
History.execute()
      │
      ▼
Document Updated
      │
      ▼
Renderer.render()
```

---

# Undo

Undo removes the latest command from the Undo Stack.

```text
Undo Stack

↓

Pop Command

↓

command.undo()

↓

Push to Redo Stack
```

---

# Redo

Redo removes the latest command from the Redo Stack.

```text
Redo Stack

↓

Pop Command

↓

command.execute()

↓

Push to Undo Stack
```

---

# History Stacks

```text
Undo Stack
──────────────

Add Rectangle

Move Rectangle

Resize Rectangle

──────────────

Redo Stack
──────────────

(empty)
```

---

# Batch Commands

Some operations should be grouped into a single history entry.

Examples:

* Dragging an object
* Typing text
* Multiple alignment operations

Instead of creating hundreds of commands, they become one logical action.

---

# Non-History Operations

These actions should not enter history:

* Zoom
* Pan
* Hover
* Selection changes
* Temporary previews
* Cursor movement

History records document changes only.

---

# Memory Management

History should have a configurable limit.

Example:

```text
Maximum Commands = 100
```

When the limit is exceeded, the oldest commands are discarded.

---

# Future Commands

Planned command types include:

* Add Object
* Delete Object
* Duplicate Object
* Move Object
* Resize Object
* Rotate Object
* Group Objects
* Ungroup Objects
* Change Layer
* Change Style
* Edit Text
* Import Image
* Paste
* Crop
* Apply Filter

---

# Design Rule

The History System should never modify the document directly.

All document changes must happen through commands.

This keeps undo, redo, scripting, automation, and future collaboration systems consistent.

