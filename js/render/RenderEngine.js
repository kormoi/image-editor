export default class RenderEngine {

    constructor(editor, renderer) {

        this.editor = editor;

        this.renderer = renderer;

    }

    render() {

        const document = this.editor.document;

        if (!document) return;

        this.renderer.clear();

        this.renderNode(document.root);

        this.renderer.requestRender();

    }

    renderNode(node) {

        if (!node.visible) {

            return;

        }

        switch (node.type) {

            case "root":
                break;

            case "artboard":
                this.renderer.drawArtboard(node);
                break;

            case "layer":
                break;

            case "rectangle":
                this.renderer.drawRectangle(node);
                break;

            case "ellipse":
                this.renderer.drawEllipse(node);
                break;

            case "image":
                this.renderer.drawImage(node);
                break;

            case "text":
                this.renderer.drawText(node);
                break;

            case "svg":
                this.renderer.drawSVG(node);
                break;

            case "group":
                break;

        }

        for (const child of node.children) {

            this.renderNode(child);

        }

    }

}