const undoBtn = document.getElementById("undoBtn")
const redoBtn = document.getElementById("redoBtn")
const textInput = document.getElementById("textInput")
const saveBtn = document.getElementById("saveBtn")
const modal = document.getElementById("modal")
const saveText = document.getElementById("saveText")
const confirmBtn = document.getElementById("confirmBtn")
const versionsList = document.getElementById("versionsList")
const errorMsg = document.getElementById("errorMsg")
const clearBtn = document.getElementById("clearBtn")
const closeModal = document.getElementById("closeModal")

let undoStack = []
let redoStack = []

textInput.addEventListener("input", () => {
    undoStack.push(textInput.value)
    redoStack = []
})

undoBtn.addEventListener("click", () => {
    undo()
})

redoBtn.addEventListener("click", () => {
    redo()
})

clearBtn.addEventListener("click", () => {
    textInput.value = ""
    undoStack = []
    redoStack = []
})

saveBtn.addEventListener("click", () => {
    if (textInput.value.trim() === "") return
    modal.classList.remove("hidden")
})

saveText.addEventListener("input", () => {
    errorMsg.classList.add("hidden")
})

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden")
})

confirmBtn.addEventListener("click", () => {
    if (saveText.value.trim() === "") return
    const versionName = saveText.value
    const version = {
        name: versionName,
        text: textInput.value
    }
    let versions = JSON.parse(localStorage.getItem("savedVersions")) || []
    const duplicated = versions.some(v => v.name === versionName)
    if (duplicated) return errorMsg.classList.remove("hidden")
    versions.push(version)
    localStorage.setItem("savedVersions", JSON.stringify(versions))
    modal.classList.add("hidden")
    saveText.value = ""
    displayVersions()

})

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "z") {
        event.preventDefault()
        undo()
    }
    if (event.ctrlKey && event.key === "y") {
        event.preventDefault()
        redo()
    }
})

function undo() {
    if (undoStack.length === 0) return
    const lastState = undoStack.pop()
    redoStack.push(lastState)
    textInput.value = undoStack[undoStack.length - 1] || ""
}

function redo() {
    if (redoStack.length === 0) return
    const lastState = redoStack.pop()
    undoStack.push(lastState)
    textInput.value = lastState || ""
}

function displayVersions() {
    versionsList.innerHTML = ""
    const versions = JSON.parse(localStorage.getItem("savedVersions")) || []
    versions.forEach(element => {
        const newLi = document.createElement("li")
        newLi.innerHTML = `version: ${element.name} <button class="deleteBtn">X</button>`
        const deleteBtn = newLi.querySelector(".deleteBtn")
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation()
            let versions = JSON.parse(localStorage.getItem("savedVersions")) || []
            const deletedVersions = versions.filter(deleted => deleted.name !== element.name)
            localStorage.setItem("savedVersions", JSON.stringify(deletedVersions))
            displayVersions()
        })
        versionsList.appendChild(newLi)
        newLi.addEventListener("click", () => {
            textInput.value = element.text
        })
    });
}

displayVersions()