# MART Editor API Specification

## Overview

The editor is backend-agnostic.

It does not contain authentication, billing, subscription logic, or database access.

Instead, the host application provides an API implementation that the editor calls when required.

This allows MART Editor to be embedded into different websites and applications without modifying the editor itself.

---

# Design Principles

* The editor never talks directly to a database.
* The editor never checks subscriptions.
* The editor never stores user accounts.
* The editor only requests information from the host application.
* Every API call should be asynchronous.

---

# API Categories

## User

Returns information about the current user.

Example:

```javascript
getCurrentUser()
```

Returns:

* User ID
* Display Name
* Avatar
* Subscription
* Preferences

---

## Permissions

Checks whether the current user is allowed to perform an action.

Examples:

```javascript
canExport()

canDownload()

canUpload()

canUseAI()

canUsePremiumAssets()
```

Returns:

```javascript
true
```

or

```javascript
false
```

The editor should never assume permissions.

---

## Projects

Project management.

Examples:

```javascript
createProject()

saveProject()

loadProject()

deleteProject()

duplicateProject()

renameProject()
```

---

## Assets

Asset management.

Examples:

```javascript
uploadAsset()

deleteAsset()

listAssets()

searchAssets()
```

Assets may include:

* Images
* SVG
* Fonts
* Templates
* Brushes

---

## Export

Before exporting, the editor asks the host application.

Example:

```javascript
checkExport(project)
```

The host application can inspect:

* Export size
* Premium objects
* Locked assets
* Subscription level
* Watermark requirements

The backend decides whether export is allowed.

---

## AI

Future AI features.

Examples:

```javascript
generateImage()

removeBackground()

expandCanvas()

rewriteText()
```

The editor simply forwards requests.

---

## Templates

Examples:

```javascript
listTemplates()

loadTemplate()

saveTemplate()
```

---

## Fonts

Examples:

```javascript
listFonts()

downloadFont()

uploadFont()
```

---

## Storage

Examples:

```javascript
saveToCloud()

loadFromCloud()

listProjects()
```

The storage provider is not part of the editor.

---

# Error Handling

Every API request should return a predictable response.

Example:

```javascript
{
    success: true,
    data: {}
}
```

or

```javascript
{
    success: false,
    error: {
        code: "EXPORT_LIMIT",
        message: "Export exceeds your allowed size."
    }
}
```

The editor should display the error but should not implement business rules.

---

# Extensibility

The API should allow new features without changing the editor architecture.

Future categories may include:

* Collaboration
* Comments
* Notifications
* Marketplace
* Plugins
* Analytics

---

# Responsibility Separation

| Editor         | Host Application  |
| -------------- | ----------------- |
| Rendering      | Authentication    |
| Editing        | Billing           |
| Document Model | Subscription      |
| History        | Database          |
| Selection      | Asset Ownership   |
| Serialization  | Permission Checks |

The editor is responsible for editing graphics.

The host application is responsible for everything related to users, accounts, storage, and business logic.
