/*
const book = {
    title: "",
    author: "",
    pages: 0,
    read: false
}
*/

function bookObj(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        let str = "";
        str += book1.title + " by " + book1.author + ", " + book1.pages + "pages, ";
        if(this.read != true) {
            str += " not read yet"
        } else {
            str += " already read"
        }
        console.log(str);
        return str;
    }
}

let book1 = new bookObj("The End", "C. G. Gomez", 290, true);
book1.info();

book1 = new bookObj("The End", "C. G. Gomez", 290, false);
book1.info();

