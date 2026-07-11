import Editor from "./core/editor.js";

window.addEventListener("DOMContentLoaded", async () => {

    const editor = new Editor();

    window.Editor = editor;

    await editor.initialize();

});
