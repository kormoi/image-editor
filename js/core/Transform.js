export default class Transform {

    constructor(editor) {

        this.editor = editor;

        this.session = null;

    }

    begin(objects) {

        this.session = [];

        objects.forEach(object => {

            if (!object.node) {

                return;

            }

            this.session.push({

                id: object.node.id,

                before: structuredClone(object.node.transform)

            });

        });

    }

    update(objects) {

        objects.forEach(object => {

            if (!object.node) {

                return;

            }

            const node = object.node;

            node.transform.x = object.left;
            node.transform.y = object.top;

            node.transform.width = object.width * object.scaleX;
            node.transform.height = object.height * object.scaleY;

            node.transform.rotation = object.angle;

            node.transform.scaleX = object.scaleX;
            node.transform.scaleY = object.scaleY;

        });

    }

    finish(objects) {

        if (!this.session) {

            return null;

        }

        this.update(objects);

        const step = {

            changes: []

        };

        this.session.forEach(item => {

            const node = this.editor.document.findNode(item.id);

            if (!node) {

                return;

            }

            step.changes.push({

                nodeId: item.id,

                property: "transform",

                before: structuredClone(item.before),

                after: structuredClone(node.transform)

            });

        });

        this.session = null;

        return step;

    }

}