var DBLength = 0;

const config = {
    apiKey: "AIzaSyCGPvqx6jbgRaVK1SNPCgE3-ydXpVFCZYg",
    authDomain: "digital-library-e2089.firebaseapp.com",
    databaseURL: "https://digital-library-e2089.firebaseio.com",
    projectId: "digital-library-e2089",
    storageBucket: "digital-library-e2089.appspot.com",
    messagingSenderId: "599213267099",
    appId: "1:599213267099:web:b4f61d5362fd5040474e3e",
    measurementId: "G-9HNPW0M4Y2"
};

firebase.initializeApp(config);

// Pair add button
var addButton = document.getElementById("AddButton");
var modal = document.getElementById("myModal");
var submitBtn = document.getElementById("SubBut");

addButton.addEventListener('click', () => {
    modal.style.display = "block"; 
})

submitBtn.addEventListener('click', () => {
    let titleInput = document.getElementById("BookTitle").value;
    let authorInput = document.getElementById("Author").value; 
    let pagesInput = document.getElementById("Pages").value;
    let readInput = document.getElementById("Read").checked;
    let bookToAdd = new book(titleInput, authorInput, pagesInput, readInput);
    addBookToLibrary(bookToAdd);
    addDB(titleInput, authorInput, pagesInput, readInput);
    retrieveFromDB(Library);
})

var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

// Array containing all the book objects
let Library = [];

// Book object storing information
function book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Book functions aka prototypes
book.prototype.info = function() {
        let str = "";
        str += this.title + " by " + this.author + ", " + this.pages + " pages, ";
        if(this.read != true) {
            str += "not read yet"
        } else {
            str += "already read"
        }
        console.log(str);
        return str;
}

book.prototype.checkRead = function() {
    if (this.read == true) {
        return "Status: Read";
    } else {
        return "Status: Not Read";
    }
}

function addBookToLibrary(book) {
    Library.push(book);
} 
       
function visualLibrary(Library) {
    for (let i = 0; i < Library.length; i++) {
        Library[i].info();
    }
}

function renderArray(Library) {
    
    var parent = document.getElementById("BookArray");
    parent.innerHTML = "";
    for (let i = 0; i < Library.length; i++) {
        let element = document.createElement("div");
        element.setAttribute("id", "Item");

        let image = document.createElement("input");
        image.setAttribute("id", "trashIcon" + i);
        image.setAttribute("class", "trashIcon");
        image.type = "image";
        image.src = "imgs/trash.png";
        element.appendChild(image);

        let title = document.createElement("p");
        title.innerHTML = Library[i].title;
        element.appendChild(title);

        let author= document.createElement("p");
        author.innerHTML = Library[i].author;
        element.appendChild(author);

        let pages= document.createElement("p");
        pages.innerHTML = Library[i].pages;
        element.appendChild(pages);

        let read= document.createElement("p");
        read.innerHTML = Library[i].checkRead();
        element.appendChild(read);

        parent.appendChild(element);
    }
    setUpTrash();
}

function setUpTrash() {
    var trashBtn = document.getElementsByClassName("trashIcon");
    for(let i = 0; i < Library.length; i++) {
        trashBtn[i].addEventListener('click', () => {
            let index = trashBtn[i].id;
            let bookRemoval = index[index.length - 1];
            Library.splice(bookRemoval, 1);
            firebase.database().ref().child("book" + (parseInt(bookRemoval) + 1)).remove();
            console.log("book" + (parseInt(bookRemoval) + 1))
            retrieveFromDB(Library);
        })   
    }
}

function addDB(title, author, pages, read) {
    // A post entry.
    var postData = {
        title: title,
        author: author,
        pages: pages,
        read: read
    };
  
    // Get a key for a new Post.
    var newPostKey = "book" + (DBLength + 1); // book + dblength (book5 book6 book7 ...)
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates[newPostKey] = postData;
  
    return firebase.database().ref().update(updates);
  }

function deleteDB() {

}

function retrieveFromDB() {
    DBLength = 0;
    Library=[];
    var bookList = firebase.database().ref();
    bookList.on('value', function(snapshot) {
        let dbVal = snapshot.val();
        for(const booksObj in dbVal) {
            let values = [];
            for(const valuesObj in dbVal[booksObj]) {
                values.push(dbVal[booksObj][valuesObj]);
            }
            let newBookObj = new book(values[3], values[0], values[1], values[2]);
            addBookToLibrary(newBookObj)
            console.log(values);
            DBLength++;
        }
        renderArray(Library);
    });
}

retrieveFromDB();