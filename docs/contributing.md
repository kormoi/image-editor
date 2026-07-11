# Contributing to MART Editor

## Philosophy

MART Editor is built incrementally.

The goal is to produce a stable, maintainable graphics editor rather than implementing many unfinished features.

Every contribution should improve the project without introducing unnecessary complexity.

---

# Development Rules

1. One feature at a time.
2. Finish the feature before starting another.
3. Test before committing.
4. Commit frequently.
5. Keep the architecture simple.
6. Do not rewrite working code without a clear benefit.

---

# Before Writing Code

Ask:

* Is this required for the current feature?
* Does similar functionality already exist?
* Can the existing architecture support it?
* Is there a simpler solution?

If the answer to the first question is **No**, postpone the idea.

---

# Single Responsibility

Each module should have one responsibility.

Examples:

| Module   | Responsibility                         |
| -------- | -------------------------------------- |
| Document | Stores document data                   |
| Renderer | Draws the document                     |
| Tool     | Handles user interaction               |
| History  | Undo / Redo                            |
| API      | Communicates with the host application |

Avoid mixing responsibilities.

---

# Feature Workflow

```text
Choose Feature

↓

Implement

↓

Test

↓

Commit

↓

Update Roadmap (if completed)

↓

Update Changelog (if user-visible)

↓

Start Next Feature
```

---

# Commit Messages

Write meaningful commit messages.

Good examples:

* Add rectangle drawing tool
* Implement node serialization
* Add move command
* Improve renderer performance

Avoid:

* Update
* Fix
* Changes
* Misc

---

# Pull Requests

If the project accepts external contributions in the future:

* Keep pull requests focused.
* One feature per pull request.
* Explain why the change is needed.
* Include testing notes.

---

# Code Reviews

During review, ask:

* Is the code correct?
* Is it readable?
* Is it maintainable?
* Is it required for the current feature?

Avoid approving unnecessary complexity.

---

# Documentation

Update documentation when:

* A new subsystem is introduced.
* A public API changes.
* The MART format changes.
* A major architectural decision is made.

Do not document every small implementation detail.

---

# Long-Term Goal

The objective is to build a professional graphics editor that is:

* Modular
* Stable
* Extensible
* Easy to maintain
* Independent of any specific backend or business model

Every contribution should move the project closer to that goal.
