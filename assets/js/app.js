const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    const btnDownload = document.querySelector(".btn-download");
    const btnUpload = document.querySelector(".btn-upload");

    btnDownload.addEventListener("click", downloadFile);
    btnUpload.addEventListener("click", uploadFile);

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) ipcRenderer.send("start", userData);
});

function downloadFile() {
    const serverFilePath = document.querySelector("#server-path").value;
    const localFilePath = document.querySelector("#local-path").value;

    ipcRenderer.send("download", { serverFilePath, localFilePath });
}

function uploadFile() {
    const serverFilePath = document.querySelector("#server-path").value;
    const localFilePath = document.querySelector("#local-path").value;

    ipcRenderer.send("upload", { serverFilePath, localFilePath });
}