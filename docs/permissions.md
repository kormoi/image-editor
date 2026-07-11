# MART Editor Permission System

## Overview

The editor itself does not decide what a user is allowed to do.

All permission decisions are delegated to the host application or backend.

This allows the same editor to be used in different products with different permission models.

---

# Design Principles

* The editor never checks subscriptions.
* The editor never checks billing.
* The editor never checks licenses.
* The editor asks the host application.
* The host application returns a decision.

---

# Permission Categories

## Project

Examples:

* Create Project
* Open Project
* Save Project
* Duplicate Project
* Delete Project

---

## Editing

Examples:

* Add Objects
* Delete Objects
* Edit Objects
* Rename Layers
* Group Objects
* Ungroup Objects

---

## Assets

Examples:

* Upload Images
* Upload SVG
* Upload Fonts
* Delete Assets
* Use Premium Assets

---

## Export

The host application decides whether export is allowed.

Checks may include:

* Maximum width
* Maximum height
* Maximum DPI
* Premium objects
* Locked assets
* Watermark requirement

---

## AI

Examples:

* Generate Image
* Remove Background
* Expand Image
* Rewrite Text
* AI Credits Remaining

---

## Collaboration

Examples:

* View Project
* Comment
* Edit
* Share
* Invite Users
* Publish

---

# Permission Request Flow

```text id="v4x7qf"
User Action

↓

Editor

↓

Host API

↓

Permission Check

↓

Allow / Deny

↓

Editor Response
```

---

# Example Response

Successful permission:

```javascript id="2pdzhn"
{
    success: true
}
```

Denied permission:

```javascript id="lrr0ir"
{
    success: false,
    code: "EXPORT_LIMIT",
    message: "Maximum export size exceeded."
}
```

---

# Export Rules

The backend may evaluate:

* User subscription
* Export dimensions
* File format
* Watermark policy
* Premium content usage
* Organization policies

The editor should not implement these rules.

---

# Premium Content

Objects may contain metadata indicating premium usage.

Example:

```javascript id="lgxtmn"
metadata: {

    premium: true

}
```

Before export, the backend can inspect the document and decide whether the export is permitted.

---

# Future Extensions

Possible permission checks include:

* Plugin execution
* API access
* Template publishing
* Marketplace access
* Team administration
* Storage quota
* Rate limiting

---

# Design Rule

The editor is responsible for editing graphics.

The host application is responsible for deciding what the current user is allowed to do.
