export default class GraphicObject {

    constructor(type) {

        this.id = crypto.randomUUID();

        this.type = type;

        this.name = "";

        this.visible = true;

        this.locked = false;

        this.selected = false;

        this.opacity = 1;

        this.blendMode = "normal";

        this.transform = {

            x: 0,

            y: 0,

            width: 0,

            height: 0,

            rotation: 0,

            scaleX: 1,

            scaleY: 1,

            flipX: false,

            flipY: false

        };

        this.style = {

            fill: "#000000",

            stroke: "#000000",

            strokeWidth: 1,

            shadow: null

        };

        this.metadata = {};

    }

    serialize() {

        return JSON.parse(JSON.stringify(this));

    }

}