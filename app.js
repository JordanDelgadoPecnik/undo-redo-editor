// ===== DOM =====
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
const closeModalBtn = document.getElementById("closeModal")


// ===== ESTADO =====
let undoStack = []
let redoStack = []


// ===== UTILIDADES =====
function isEmpty(value) {
    return value.trim() === ""
}


// ===== HISTORIAL (undo / redo) =====
function recordChange() {
    undoStack.push(textInput.value)
    redoStack = []
}

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

function clearInput() {
    textInput.value = ""
    undoStack = []
    redoStack = []
}


// ===== VERSIONES (datos) =====
function getVersions() {
    return JSON.parse(localStorage.getItem("savedVersions")) || []
}

function saveVersions(versions) {
    localStorage.setItem("savedVersions", JSON.stringify(versions))
}

function createVersion(name, text) {
    return {
        name,
        text
    }
}

function addVersion(version) {
    const versions = getVersions()
    versions.push(version)
    saveVersions(versions)
}

function deleteVersion(versionName) {
    saveVersions(getVersions().filter(version => version.name !== versionName))
}

function isNameDuplicated(value) {
    const versions = getVersions()
    return versions.some(v => v.name.toLowerCase() === value.toLowerCase())
}

function loadVersion(version) {
    textInput.value = version.text
    recordChange()
}


// ===== MODAL =====
function openModal() {
    if (isEmpty(textInput.value)) return
    modal.classList.remove("hidden")
}

function closeModal() {
    modal.classList.add("hidden")
    resetModal()
}

function resetModal() {
    saveText.value = ""
    hideErrorMsg()
}

function showErrorMsg() {
    errorMsg.classList.remove("hidden")
}

function hideErrorMsg() {
    errorMsg.classList.add("hidden")
}


// ===== PINTAR LA LISTA =====
function createDeleteBtn() {
    const removeBtn = document.createElement("button")
    removeBtn.textContent = "X"
    removeBtn.classList.add("deleteBtn")
    return removeBtn
}

function createVersionItem(version) {
    const newLi = document.createElement("li")
    newLi.textContent = `version: ${version.name}`
    const removeBtn = createDeleteBtn()
    newLi.appendChild(removeBtn)
    return newLi
}

function displayVersions() {
    versionsList.innerHTML = ""
    getVersions().forEach(version => {
        const newLi = createVersionItem(version)
        const deleteBtn = newLi.querySelector(".deleteBtn")
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation()
            deleteVersion(version.name)
            displayVersions()
        })
        versionsList.appendChild(newLi)
        newLi.addEventListener("click", () => {
            loadVersion(version)
        })
    })
}


// ===== EVENT LISTENERS: EDITOR =====
textInput.addEventListener("input", () => {
    recordChange()
})

undoBtn.addEventListener("click", () => {
    undo()
})

redoBtn.addEventListener("click", () => {
    redo()
})

clearBtn.addEventListener("click", () => {
    clearInput()
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


// ===== EVENT LISTENERS: MODAL =====
saveBtn.addEventListener("click", () => {
    openModal()
})

saveText.addEventListener("input", () => {
    hideErrorMsg()
})

closeModalBtn.addEventListener("click", () => {
    closeModal()
})

confirmBtn.addEventListener("click", () => { 
    const versionName = saveText.value.trim()
    if (isEmpty(versionName)) return
    if (isNameDuplicated(versionName)) return showErrorMsg()
    const version = createVersion(versionName, textInput.value)
    addVersion(version)
    closeModal()
    displayVersions()
})


// ===== INICIO =====
displayVersions()






