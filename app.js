const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// VARIABLES
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
// MODAL / OVERLAY VARIABLES
let modal = $(".modal")
let x = $(".x")
let editBtn = $(".edit")
let modalDesc = $(".modal-desc")
let modalTitle = $(".modal-title")
let overlay = $(".overlay")
// SELECTOR VARIABLES
let select = $(".select")
let mostRecentOption = $(".most-recent-option")
let alphabeticalOption = $("alphabetical-option")
// SETTINGS
let settingsBtn = $(".settings-btn")
let settings = $(".settings")

window.onload = function () {
  // Load notes from local Storage
  createNotesFromLocalStorage()
  // Load submitCount from local Storage
  if (localStorage.getItem("noteCount")) {
    creationSubmitCount = parseInt(localStorage.getItem("noteCount"))
  }
}

settingsBtn.addEventListener("click", function (e) {
  e.stopPropagation()
  settings.style.display === "flex"
    ? (settings.style.display = "none")
    : (settings.style.display = "flex")
})

$("body").addEventListener("click", function () {
  if (settings.style.display === "flex") {
    settings.style.display = "none"
  }
})

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
      creationTextArea.value
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
  }
})

// BUTTONS
createBtn.addEventListener("click", goToCreation)
creationBackBtn.addEventListener("click", goToNotes)
deleteAllBtn.addEventListener("click", deleteAll)

// FUNCTIONS
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

  // Add content
  noteTitle.innerText = note.title
  note.desc
    ? (noteDesc.innerHTML = note.desc)
    : (noteDesc.innerHTML = "No Description Added")
  noteTime.innerText = "Created at " + new Date().toLocaleTimeString()
  note.timeCreated = new Date().toLocaleTimeString()

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
    currentDesc = this.children[1].innerText
    currentEle = this
    displayModal(this.children[0].innerText, this.children[1].innerText)
  })
}

x.addEventListener("click", function () {
  deleteLastSelectedElement()
  exitModal()
})

editBtn.addEventListener("click", function () {
  goToCreation()
  // Set the inputs equal to what they were before
  creationTitle.value = currentTitle
  if (currentDesc === "No Description Added") {
    creationTextArea.value = ""
  } else {
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
  modalDesc.innerText = desc
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
