const notesListEl = document.querySelector(".notes-list");
const saveButtonEl = document.querySelector(".save-note");
const deleteButtonEl = document.querySelector(".delete-note");
const createNewButtonEl = document.querySelector(".create-new");
const titleInputEl = document.querySelector("#title-input");
const contentInputEl = document.querySelector("#content-input");

const LOCAL_STORAGE_KEY = "notesApp-notes";

let notesList = [];

loadFromLocalStorage();

saveButtonEl.addEventListener("click", saveNoteEntry);
deleteButtonEl.addEventListener("click", deleteNoteEntry);
createNewButtonEl.addEventListener("click", clearInput);

function saveNoteEntry() {
  console.log("Save");

  if (!checkOfSelectedNote()) {
    createNewNoteEntry();
  }

  saveToLocalStorage();
}

function createNewNoteEntry() {
  if (titleInputEl.value === "") {
    titleInputEl.value = "?";
  }

  if (contentInputEl.value === "") {
    contentInputEl.value = "?";
  }

  notesEntry = {
    id: getNextID(),
    title: titleInputEl.value,
    content: contentInputEl.value,
    lastUpdated: Date.now(),
  };
  notesList.push(notesEntry);

  clearInput();
  showNotesList();

  console.log("notes Entry lenght", notesList.length);
}

function getNextID() {
  const sortedNotesList = notesList.sort((a, b) => {
    return a.id - b.id;
  });

  console.log("sortetNotesList--", sortedNotesList);

  // let nextId = 0;
  // for (let i of sortedNotesList) {
  //   if (nextId < i.id) break;
  //   nextId = i.id + 1;
  // }
  // return nextId;

  if (sortedNotesList.at(-1) !== undefined) {
    return sortedNotesList.at(-1).id + 1;
  } else {
    return 0;
  }
}

function showNotesList() {
  const sortedNotesList = notesList.sort((a, b) => {
    return b.lastUpdated - a.lastUpdated;
  });
  // console.log("sorted", sortedNotesList, sortedNotesList[0].id);

  let html = "";
  sortedNotesList.forEach((element) => {
    console.log("list element", element);
    html += `
  <div class="note-entry" data-id="${element.id}">
  <div class="note-title">${element.title}</div>
  <div class="note-content-teaser">${element.content}</div>
  <div class="note-date">${element.lastUpdated} / ${new Date(element.lastUpdated).toLocaleString("de-DE")}</div> 
  </div>`;
  });

  notesListEl.innerHTML = html;

  const notesListElListener = document.querySelectorAll(".note-entry");

  notesListElListener.forEach((element) => {
    // element.addEventListener("click", () => selectedNoteEntry(element.getAttribute("data-id")));
    element.addEventListener("click", selectedNoteEntry);

    console.log("-listener-", element);
  });
}

function clearInput() {
  console.log("delete notesEntry");
  titleInputEl.value = "";
  contentInputEl.value = "";
  showNotesList();
}

function selectedNoteEntry(e) {
  console.log("click auf", e, this);

  const x = e.target;
  console.log("x--", x);

  const el = this.getAttribute("data-id");
  console.log("el", el);

  deleteAllSelections();
  this.classList.add("selected");

  console.log(notesList);
  const findNote = notesList.find((note) => note.id === Number(el));
  console.log(findNote, findNote.lastUpdated);

  titleInputEl.value = findNote.title;
  contentInputEl.value = findNote.content;
}

function deleteAllSelections() {
  const elements = document.querySelectorAll(".note-entry.selected");
  console.log("deleteAllSelection---", elements);
  elements.forEach((select) => {
    select.classList.remove("selected");
  });
}

function deleteNoteEntry() {
  console.log("delete Note-Entry");
  const element = document.querySelector(".note-entry.selected");

  if (element === null) return;

  note = getStillSelcetedNote();
  console.log(note);

  const filteredNotesList = notesList.filter((element) => {
    return element !== note;
  });

  console.log("filter", notesList);
  console.log("filter", filteredNotesList);

  notesList = filteredNotesList;
  console.log("NotesList after delete ", notesList);
  clearInput();
  showNotesList();

  saveToLocalStorage();
}

function getStillSelcetedNote() {
  const element = document.querySelector(".note-entry.selected");
  console.log("still selected", element, element.getAttribute("data-id"));
  const stillSelectetElement = element.getAttribute("data-id");

  const findNote = notesList.find((note) => note.id === Number(stillSelectetElement));
  console.log("Find still Note", findNote);
  return findNote;
}

function checkOfSelectedNote() {
  const element = document.querySelector(".note-entry.selected");

  if (element !== null) {
    console.log("still selected", element, element.getAttribute("data-id"));
    const stillSelectetElement = element.getAttribute("data-id");

    const findNote = notesList.find((note) => note.id === Number(stillSelectetElement));
    console.log("Find still Note", findNote);

    findNote.title = titleInputEl.value;
    findNote.content = contentInputEl.value;
    findNote.lastUpdated = Date.now();

    clearInput();
    showNotesList();

    return true;
  }
  return false;
}

function saveToLocalStorage() {
  console.log("saveToLocalStorage");
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notesList));
}

function loadFromLocalStorage() {
  console.log("loadFromLocalStorage");
  const notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

  if (notes !== null) {
    notesList = notes;
  }
  showNotesList();
}

function testTest() {
  console.log("in testTest");
}
