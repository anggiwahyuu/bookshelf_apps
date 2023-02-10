const storageKey = "BOOKSHELF_APPS";
const renderEvent = "RENDER_BOOKS";
let bookData = [];

function isStorageExist() {
    return typeof (Storage) !== "undefined";
}

function setBookData(data) {
    if (isStorageExist()) {
        if (localStorage.getItem(storageKey) !== null) {
            bookData = JSON.parse(localStorage.getItem(storageKey));
        }

        bookData.unshift(data);

        localStorage.setItem(storageKey, JSON.stringify(bookData));
    }
}

function getBookData() {
    if (isStorageExist()) {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } else {
        return [];
    }
}

function saveData(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
    document.dispatchEvent(new Event(renderEvent));
}

function findBookIndex(bookID) {
    const booksData = getBookData();
    for (const i in booksData) {
        if (booksData[i].id === bookID) {
            return i;
        }
    }
}

function renderBookData() {
    const booksData = getBookData();
    const bookListFinished = document.querySelector("#book-list-finished");
    const bookListUnfinished = document.querySelector("#book-list-unfinished");

    bookListFinished.innerHTML = "";
    bookListUnfinished.innerHTML = "";

    for (let book of booksData) {
        if (book.isComplete === false) {
            let outline = document.createElement("div");
            outline.className = "book-outline";
            outline.innerHTML = "<p id='judul-buku'>" + book.title + "</p>";
            outline.innerHTML += "<p id='penulis'> Penulis: " + book.author + "</p>";
            outline.innerHTML += "<p id='tahun'> Tahun: " + book.year + "</p>";
            outline.innerHTML += `<div class='btn-collection'> <form id='tag-finished'> <button class='tag-${book.id}' type='submit'>Tandai Sudah Selesai Dibaca</button> </form> <form id='delete-book'> <button class='delete-${book.id}' type='submit'>Hapus Buku</button> </form> </div>`;
            outline.setAttribute("id", "book-" + book.id);

            bookListUnfinished.appendChild(outline);

            document.querySelector(`.tag-${book.id}`).addEventListener("click", function () {
                let text = `Apakah Anda yakin ingin menandai buku ${book.title} menjadi sudah selesai dibaca?`;
                if (confirm(text) === true) {
                    book.isComplete = true;
                    saveData(booksData);
                    alert(`Buku ${book.title} Berhasil Ditandai Sudah Selesai Dibaca`);
                }
            });

            document.querySelector(`.delete-${book.id}`).addEventListener("click", function () {
                let text = `Apakah Anda yakin ingin menghapus buku ${book.title}?`;
                if (confirm(text) === true) {
                    const index = findBookIndex(book.id);
                    booksData.splice(index, 1);
                    saveData(booksData);
                    alert(`Buku ${book.title} Berhasil Dihapus`);
                }
            });
        } else {
            let outline = document.createElement("div");
            outline.className = "book-outline";
            outline.innerHTML = "<p id='judul-buku'>" + book.title + "</p>";
            outline.innerHTML += "<p id='penulis'> Penulis: " + book.author + "</p>";
            outline.innerHTML += "<p id='tahun'> Tahun: " + book.year + "</p>";
            outline.innerHTML += `<div class='btn-collection'> <form id='tag-unfinished'> <button class='tag-${book.id}' type='submit'>Tandai Belum Selesai Dibaca</button> </form> <form id='delete-book'> <button class='delete-${book.id}' type='submit'>Hapus Buku</button> </form> </div>`;
            outline.setAttribute("id", "book-" + book.id);

            bookListFinished.appendChild(outline);

            document.querySelector(`.tag-${book.id}`).addEventListener("click", function () {
                let text = `Apakah Anda yakin ingin menandai buku ${book.title} menjadi belum selesai dibaca?`;
                if (confirm(text) === true) {
                    book.isComplete = false;
                    saveData(booksData);
                    alert(`Buku ${book.title} Berhasil Ditandai Belum Selesai Dibaca`);
                }
            });

            document.querySelector(`.delete-${book.id}`).addEventListener("click", function () {
                let text = `Apakah Anda yakin ingin menghapus buku ${book.title}?`;
                if (confirm(text) === true) {
                    const index = findBookIndex(book.id);
                    booksData.splice(index, 1);
                    saveData(booksData);
                    alert(`Buku ${book.title} Berhasil Dihapus`);
                } 
            });
        }
    }
}

document.getElementById("data-submit").addEventListener("click", function () {
    const inputJudul = document.getElementById("form-judul").value;
    const inputPenulis = document.getElementById("form-penulis").value;
    const inputTahun = document.getElementById("form-tahun").value;
    const isComplete = document.getElementById("check-selesai-dibaca").checked;

    if (inputJudul.length !== 0 && inputPenulis.length !== 0 && inputTahun.length !== 0) {
        const newBookData = {
            id: +new Date(),
            title: inputJudul,
            author: inputPenulis,
            year: inputTahun,
            isComplete: isComplete 
        };

        setBookData(newBookData);
        alert("Data Berhasil Ditambahkan");
    }

    renderBookData();
});

document.getElementById("delete-all-books").addEventListener("click", function () {
    let text = `Apakah Anda yakin ingin menghapus semua buku yang tersimpan?`;
    if (confirm(text)) {
        localStorage.clear();
        alert("Semua Data Berhasil Dihapus");
    }
});

document.getElementById("searchBook").addEventListener("keyup", function () {
    let searchInput = document.getElementById("searchBook");
    let filter = searchInput.value.toUpperCase();
    let outline = document.querySelectorAll(".book-outline");

    for (let i = 0; i < outline.length; i++) {
        let title = outline[i].getElementsByTagName("p")[0];
        if (title) {
            let value = title.textContent || title.innerText;
            if (value.toUpperCase().indexOf(filter) > -1) {
                outline[i].style.display = "";
            } else {
                outline[i].style.display = "none";
            }
        }
    }
});

window.addEventListener("load", function () {
    if (isStorageExist) {
        if (this.localStorage.getItem(storageKey) !== null) {
            renderBookData();
        }
    } else {
        this.alert("Browser Tidak Mendukung Local Storage");
    }
});