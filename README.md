# MART Editor

MART Editor is a modular, browser-based vector graphics editor built with modern JavaScript.

The project is designed around a scene graph architecture where the **Document** is the single source of truth and the **Renderer** is responsible only for displaying the document.

The long-term goal is to build a professional graphics editor that can be embedded into different web applications while remaining independent of authentication, subscriptions, storage providers, and other business logic.

---

## Features

Current features:

* Scene graph document model
* Artboards
* Layers
* Rectangle objects
* Rectangle drawing tool
* Selection tool foundation
* Fabric.js rendering
* Event bus
* Modular tool system

Planned features:

* Undo / Redo
* Polygon editing
* Text tool
* Image tool
* Layer panel
* Properties panel
* Multiple artboards
* `.mart` project format
* PNG, JPG, SVG, and PDF export

---

## Project Structure

```text
docs/          Project documentation
js/            Editor source code
css/           Stylesheets
assets/        Images and icons
vendor/        Third-party libraries
```

Detailed documentation is available in the `docs/` directory.

---

## Design Principles

* Document is the source of truth.
* Renderer never owns document data.
* Every visible object is represented as a node.
* Tools modify the document, not the canvas.
* Business logic belongs to the host application, not the editor.

---

## Technologies

* JavaScript (ES Modules)
* HTML5
* CSS3
* Fabric.js

---

## Development

Clone the repository:

```bash
git clone <repository-url>
```

Open the project in your preferred web server.

For development, use Visual Studio Code with Live Server or another local HTTP server.

---

## Documentation

Project documentation can be found in the `docs/` directory.

Important documents include:

* Architecture
* Roadmap
* MART File Format
* Node System
* API Specification
* Coding Standards

---

## License

This project is currently under active development.
License information will be added before the first public release.
