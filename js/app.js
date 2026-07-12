import Editor from "./core/Editor.js";

window.addEventListener("DOMContentLoaded", async () => {

    const editor = new Editor();

    window.Editor = editor;

    await editor.initialize();

});
