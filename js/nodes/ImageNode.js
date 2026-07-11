import Node from "./Node.js";

export default class ImageNode extends Node {

    constructor(options = {}) {

        super("image");

        this.name = options.name || "Image";

        // Transform
        this.transform.x = options.x ?? 0;
        this.transform.y = options.y ?? 0;
        this.transform.width = options.width ?? 300;
        this.transform.height = options.height ?? 300;
        this.transform.rotation = options.rotation ?? 0;

        // Image Source
        this.source = {

            id: options.source?.id ?? null,

            type: options.source?.type ?? "upload",
            // upload
            // asset
            // generated
            // database

            url: options.source?.url ?? "",

            thumbnail: options.source?.thumbnail ?? "",

            originalName: options.source?.originalName ?? ""

        };

        // Premium / Licensing
        this.license = {

            premium: options.license?.premium ?? false,

            downloadable: options.license?.downloadable ?? true,

            purchased: options.license?.purchased ?? false

        };

        // Image Editing
        this.filters = [];

        this.mask = null;

        this.crop = null;

        this.adjustments = {

            brightness: 0,

            contrast: 0,

            saturation: 0,

            exposure: 0,

            temperature: 0,

            tint: 0,

            blur: 0,

            sharpen: 0

        };

        // Future erase implementation
        this.edits = [];

    }

}