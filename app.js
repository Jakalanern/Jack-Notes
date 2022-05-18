const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// VARIABLES
let header = $(".header")
let subHeader = $(".sub-header")
let createBtn = $(".create-btn")
let deleteAllBtn = $(".delete-all-btn")
let notesSection = $(".notes-section")
let notesForm = $(".notes-form")
let notesContainer = $(".notes-container")
let creationSection = $(".creation-section")
let creationForm = $(".creation-form")
let creationTitle = $(".creation-form-title-input")
let creationTextArea = $(".creation-form-desc-input")
let creationBtnParent = $(".creation-buttons")
let creationBackBtn = $(".back")
let creationSubmitBtn = $(".submit")
let creationTitleAlert = $(".title-alert")
let quill = new Quill(creationTextArea, {
  theme: "snow",
})

// MODAL / OVERLAY VARIABLES
let modal = $(".modal")
let x = $(".x")
let editBtn = $(".edit")
let modalDesc = $(".modal-desc")
let modalTitle = $(".modal-title")
let overlay = $(".overlay")
let modalBackBtn = $(".modal-back-btn")

// SELECTOR VARIABLES
let select = $(".select")
let mostRecentOption = $(".most-recent-option")
let alphabeticalOption = $("alphabetical-option")

// SETTINGS
let settingsBtn = $(".settings-btn")
let settings = $(".settings")
let changeAccentBtn = $(".change-accent-btn")
let colorChangePage = $(".color-change-page")
let allColorBlocks = $$(".colorblock")
let colorChangeOverlay = $(".color-change-overlay")
let colorPicker = $(".color-picker")

// MOBILE SETTINGS
let mobileSettings = $(".mobile-settings")
let mobileChangeAccentBtn = $(".mobile-change-accent-btn")
let mobileDeleteAllBtn = $(".mobile-delete-all-btn")
let mobileColorPicker = $(".mobile-color-picker")
let currentColor = "#EF8C45"

if (localStorage.getItem("current-color", currentColor)) {
  currentColor = localStorage.getItem("current-color", currentColor)
}

colorPicker.value = currentColor
mobileColorPicker.value = currentColor
changeAccentColor(currentColor)

colorPicker.addEventListener("input", function (e) {
  currentColor = e.target.value
  changeAccentColor(currentColor)
  // Store it!
  localStorage.setItem("current-color", currentColor)
})

mobileColorPicker.addEventListener("input", function (e) {
  currentColor = e.target.value
  changeAccentColor(currentColor)
  localStorage.setItem("current-color", currentColor)
})

let colors = {
  red: "rgb(161, 29, 29)",
  blue: "rgb(72, 72, 205)",
  green: "rgb(53, 123, 53)",
  orange: "rgb(226, 129, 26)",
  purple: "rgb(146, 67, 146)",
  pink: "rgb(255, 144, 162)",
}

// OUR ONLOAD
window.onload = function () {
  // Load notes from local Storage
  createNotesFromLocalStorage()
  // Load submitCount from local Storage
  if (localStorage.getItem("noteCount")) {
    creationSubmitCount = parseInt(localStorage.getItem("noteCount"))
  }

  if (window.innerWidth > 500) {
    mobileSettings.style.display = "none"
    desktopSizing = true
  } else {
    settings.style.display = ""
    desktopSizing = false
  }
}

modalBackBtn.addEventListener("click", function () {
  exitModal()
})

// DESKTOP SETTINGS MENU
window.addEventListener("resize", function () {
  if (window.innerWidth > 500) {
    mobileSettings.style.display = "none"
    settings.style.display = "none"
    desktopSizing = true
  } else {
    mobileSettings.style.display = "flex"
    settings.style.display = "none"
    desktopSizing = false
  }
})

settingsBtn.addEventListener("click", function (e) {
  e.stopPropagation()
  if (desktopSizing) {
    settings.style.display = "flex"
  } else {
    settingsBtn.style.zIndex = "90"
    if (mobileSettings.style.transform !== "translateX(0px)") {
      mobileSettings.style.transform = "translateX(0px)"
    } else {
      mobileSettings.style.transform = "translate(100%)"
    }
  }
})

// MOBILE SETTINGS MENU

// mobileChangeAccentBtn.addEventListener("click", function () {
//   console.log("MOBILE CHANGE ACCENT")
//   alert("WIP")
// })

mobileDeleteAllBtn.addEventListener("click", function () {
  console.log("MOBILE DELETE BTN")
  localStorage.clear()
  window.location.reload()
})

// END OF MOBILE STUFF

// COLOR CHANGE

allColorBlocks.forEach(function (block) {
  block.addEventListener("click", function () {
    changeAccentColor(block.id)
  })
})

// changeAccentBtn.addEventListener("click", function (e) {
//   e.stopPropagation()
//   colorChangePage.style.display = "flex"
//   settings.style.display = "none"
//   colorChangeOverlay.style.display = "initial"
// })

// **************

colorChangePage.addEventListener("click", function (e) {
  e.stopPropagation()
})

settings.addEventListener("click", function (e) {
  e.stopPropagation()
})

mobileSettings.addEventListener("click", function (e) {
  e.stopPropagation()
})

$("body").addEventListener("click", function () {
  if (settings.style.display === "flex") {
    settings.style.display = "none"
  }

  if (mobileSettings.style.transform === "translateX(0px)") {
    mobileSettings.style.transform = "translate(100%)"
  }

  if (colorChangePage.style.display !== "none") {
    colorChangePage.style.display = "none"
  }
  if (colorChangeOverlay.style.display !== "none") {
    colorChangeOverlay.style.display = "none"
  }
})

// *******************************

// YOU CAN PRESS ENTER TO CREATE NOTE IF ON NOTES PAGE
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && notesSection.style.display !== "none") {
    goToCreation()
  }
})

let sortingBools = [(sortingMostRecent = true), (sortingAlphabetically = false)]
let allNotesAlphabetical = []
select.addEventListener("change", function (e) {
  if (e.target.value === "1") {
    sortingMostRecent = true
    sortingAlphabetically = false
  } else if (e.target.value === "2") {
    sortingMostRecent = false
    sortingAlphabetically = true
  }
  sortingHandler()
})

function sortingHandler() {
  // IF WE ARE SORTING BY MOST RECENT THEN DO THIS
  if (sortingMostRecent === true) {
    console.log("SORTING BY MOST RECENT")
    // SORT STORAGE BY ID
    let storageByID = JSON.parse(localStorage.getItem("notes")).sort(
      (a, b) => a.id - b.id
    )
    localStorage.setItem("notes", JSON.stringify(storageByID))
  } else {
    console.log("SORTING ALPHABETICALLY")
    // SORT STORAGE ALPHABETICALLY
    let storageAlphabetical = JSON.parse(localStorage.getItem("notes"))
      .sort((a, b) =>
        a.noteHTML.slice(23, 24).localeCompare(b.noteHTML.slice(23, 24))
      )
      .reverse()
    localStorage.setItem("notes", JSON.stringify(storageAlphabetical))
  }
  window.location.reload()
}

// NOTE FORM
notesForm.addEventListener("submit", function (e) {
  e.preventDefault()
})

// Note Object Constructor
function Note(id, title, details) {
  this.id = id
  this.title = title
  this.desc = details
}

// CREATION FORM
let creationSubmitCount = 0
creationForm.addEventListener("submit", function (e) {
  e.preventDefault()
  if (
    creationTitle.value === "" ||
    creationTitle === undefined ||
    creationTitle === null
  ) {
    creationTitleAlert.style.display = "initial"
  } else {
    creationTitleAlert.style.display = "none"
    // Construct a new object with the forms values
    let note = new Note(
      // ID basically
      creationSubmitCount,
      // The title input's value on the creation page
      creationTitle.value,
      quill.container.firstChild.innerHTML
    )

    Note.prototype.printInfo = function () {
      console.log(this.title, this.id, this.desc)
    }

    // Create the note element

    createNote(note)

    // Clear inputs
    clearCreationForm()

    // AT THE END: Go back to notes
    goToNotes()

    // Increment submit count
    creationSubmitCount++

    // Store the submit count in localStorage
    localStorage.setItem("noteCount", creationSubmitCount)

    // If we are editing, set it to false now
    editing = false
  }
})

// BUTTONS
createBtn.addEventListener("click", function () {
  goToCreation()
  // toggleSubHeader()
})
creationBackBtn.addEventListener("click", function () {
  goToNotes()
  // toggleSubHeader()
})
deleteAllBtn.addEventListener("click", deleteAll)

// FUNCTIONS

function toggleSubHeader() {
  if (subHeader.style.display !== "none") {
    subHeader.style.display = "none"
  } else {
    subHeader.style.display = "flex"
  }
}

function deleteAll() {
  allNotes = []
  localStorage.clear()
  $$(".note").forEach(function (note) {
    note.remove()
  })
}

function goToCreation() {
  notesSection.style.display = "none"
  creationSection.style.display = "flex"
}

function goToNotes() {
  creationSection.style.display = "none"
  notesSection.style.display = "flex"
}

function clearCreationForm() {
  creationTitle.value = ""
  creationTextArea.value = ""
  quill.container.firstChild.innerHTML = ""
}

function newNote(id, HTML, ele) {
  this.id = id
  this.noteHTML = HTML
  this.note = ele
}

let allNotes = []
let localData = JSON.parse(localStorage.getItem("notes"))
function createNote(note) {
  // Create a note
  let noteEle = document.createElement("div")
  let noteTitle = document.createElement("h4")
  let noteDesc = document.createElement("span")
  let noteTime = document.createElement("p")

  // Hide the description
  noteDesc.style.display = "none"

  // Add classes
  noteEle.classList.add("note")
  noteEle.id = note.id
  noteTitle.classList.add("note-title")
  noteDesc.classList.add("note-description")
  noteTime.classList.add("note-timestamp")

  // Define current time
  currentTime = new Date().toLocaleTimeString()

  // Add content
  noteTitle.innerText = note.title
  note.desc
    ? (noteDesc.innerHTML = note.desc)
    : (noteDesc.innerHTML = "No Description Added")
  if (editing) {
    note.lastEditTime = currentTime
    noteTime.innerText = "Edited at " + currentTime
  } else {
    note.timeCreated = currentTime
    noteTime.innerText = "Created at " + currentTime
  }

  //Append the note to the container, and the children to note
  notesContainer.prepend(noteEle)
  noteEle.append(noteTitle)
  noteEle.append(noteDesc)
  noteEle.append(noteTime)

  // Add an event listener to each new note
  noteListenerHandler(noteEle)

  // Construct newNote Object
  let newNoteObj = new newNote(note.id, noteEle.innerHTML, noteEle)

  // Push the object containing the new notes ID, HTML, and DOM element into an array
  allNotes.push(newNoteObj)

  // Save the array of objects and stringify
  localStorage.setItem("notes", JSON.stringify(allNotes))
}

function createNotesFromLocalStorage() {
  if (JSON.parse(localStorage.getItem("notes"))) {
    console.log("***** STORED NOTES FUNCTION RAN *****")
    // Now loop through the localData arr of objects
    for (i = 0; i < localData.length; i++) {
      // Create a note
      let noteEle = document.createElement("div")

      // Add classes
      noteEle.classList.add("note")
      noteEle.id = localData[i].id
      // Add content to the element from storage
      noteEle.innerHTML = localData[i].noteHTML

      //Append the note to the container, and the children to note
      notesContainer.prepend(noteEle)

      // Add an event listener to each new note
      noteListenerHandler(noteEle)

      let newNoteObj = new newNote(
        localData[i].id,
        localData[i].noteHTML,
        localData[i].note
      )

      // Push an object containing the new notes ID, HTML, and DOM element into an array
      allNotes.push(newNoteObj)
      // Save the array of objects and stringify
      localStorage.setItem("notes", JSON.stringify(allNotes))
    }
  } else {
    console.log("***** NO LOCAL DATA AVAILABLE *****")
  }
}
console.log("ALL NOTES", allNotes)
console.log("STORAGE NOTES", JSON.parse(localStorage.getItem("notes")))
function noteListenerHandler(note) {
  note.addEventListener("click", function () {
    console.log(this)
    currentID = parseInt(this.id)
    currentTitle = this.children[0].innerText
    currentDesc = this.children[1].children[0].innerText
    lastEleCurrentTime = this.children[2].innerText
    currentEle = this
    displayModal(this.children[0].innerText, this.children[1].innerHTML)
  })
}

x.addEventListener("click", function () {
  deleteLastSelectedElement()
  exitModal()
})

let editing = false
editBtn.addEventListener("click", function () {
  goToCreation()
  editing = true
  // Set the inputs equal to what they were before
  creationTitle.value = currentTitle
  if (currentDesc === "No Description Added") {
    quill.container.firstChild.innerHTML = ""
    creationTextArea.value = ""
  } else {
    quill.container.firstChild.innerHTML = currentDesc
    creationTextArea.value = currentDesc
  }
  // Then lets delete the element behind the scenes
  deleteLastSelectedElement()
  exitModal()
})

// When you click the overlay, it hides the modal
overlay.addEventListener("click", function () {
  exitModal()
})

function displayModal(title, desc) {
  overlay.style.display = "initial"
  modal.style.display = "flex"
  modalTitle.innerText = title
  modalDesc.innerHTML = desc
  if (modalDesc.innerText === "No Description Added") {
    modalDesc.style.color = "lightgrey"
    modalDesc.style.fontStyle = "italic"
  } else {
    modalDesc.style.color = "black"
    modalDesc.style.fontStyle = "normal"
  }
}

function exitModal() {
  overlay.style.display = "none"
  modal.style.display = "none"
}

function deleteLastSelectedElement() {
  // We are going to loop through both arrays (allNotes and localStorage)
  // We are going to DELETE the element that has the ID of what we just clicked
  if (allNotes.length === 1) {
    localStorage.clear()
  }
  for (i = 0; i < allNotes.length; i++) {
    if (currentID === allNotes[i].id) {
      allNotes.splice(i, 1)
      localStorage.setItem("notes", JSON.stringify(allNotes))
    }
    currentEle.remove()
  }
}

function changeAccentColor(color) {
  modalTitle.style.borderBottom = `2px solid ${color}`
  header.style.background = color
  mobileSettings.style.background = color
  modalBackBtn.style.background = color
  settings.style.border = `2px solid ${color}`

  mobileDeleteAllBtn.style.background = red

  $$("button").forEach(function (button) {
    if (
      button.innerText !== "DELETE ALL NOTES" &&
      button.innerText !== "CHANGE ACCENT COLOR"
    ) {
      button.style.background = color
    }
  })
}
