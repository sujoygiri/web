let userInput = document.querySelector("input");
let addButton = document.querySelector(".add_btn");
let itemDeleteButton = document.querySelector(".delete_btn");

let allListItem = [];

class Database {
    dbInstance = null;
    dbName = "";
    objectStoreName = "";

    constructor(dbName, objectStoreName) {
        this.dbName = dbName;
        this.objectStoreName = objectStoreName;
    }

    createOrConnectDb() {
        let dbRequest = indexedDB.open(this.dbName, 2);
        dbRequest.onsuccess = (event) => {
            if (event.type === "success") {
                this.dbInstance = event.target.result;
                console.log("Db connection successful!");
            }
        };

        dbRequest.onerror = (event) => {
            console.log("Db connection error:", event.target.errorCode);
        };

        dbRequest.onupgradeneeded = (event) => {
            event.target.result.createObjectStore(this.objectStoreName, {autoIncrement: true});
        };
    }

    getObjectStore() {
        let dbTransaction = this.dbInstance.transaction(this.objectStoreName, "readwrite");
        return dbTransaction.objectStore(this.objectStoreName);
    }
}

class List extends Database{
    constructor() {
        super("ListDb", "ListItem");
    }

    addListItem(item) {
        let storeInstance = this.getObjectStore();
        storeInstance.add(item);
    }

    updateListItem(updatedValue, dbKey) {
        let storeInstance = this.getObjectStore();
        storeInstance.put(updatedValue, dbKey);
    }

    retriveListItem(){
        let storeRequest = this.getObjectStore().openCursor();
        storeRequest.onsuccess = (evt) => {
            let cursorInstance = evt.target.result;
            document.body.innerHTML += `${cursorInstance.value.replaceAll(/[<>]/g,"")}`
            cursorInstance.continue();
        };
    }
}

let testDb;
let dbRequest = indexedDB.open("testDb", 2);
dbRequest.onsuccess = (event) => {
    if (event.type === "success") {
        testDb = event.currentTarget.result;
        console.log("Db creation successful");
    }
};

dbRequest.onupgradeneeded = (event) => {
    event.currentTarget.result.createObjectStore("names", {autoIncrement: true});
};

function getObjectStore() {
    let dbTransaction = testDb.transaction(["names"], "readwrite");
    return dbTransaction.objectStore("names");
}

addButton.addEventListener("click", () => {
    let req = getObjectStore().openCursor();
    req.onsuccess = (evt) => {
        let cursor = evt.target.result;
        console.log(cursor.value);
        document.body.innerHTML += `${cursor.value.replaceAll(/[<>]/g,"")}`
        cursor.continue();
    };
    // let store = getObjectStore();
    // store.add('<img src="" onerror="alert(1)">')
    // store.put("Sham", 3);
});


