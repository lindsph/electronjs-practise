const fs = require('fs');

const noItems = document.getElementById('no-items');
const items = document.getElementById('items');
let storage = JSON.parse(localStorage.getItem('readit-items')) || [];
let readerJS;

fs.readFile(`${__dirname}/reader.js`, (error, data) => {
    readerJS = data.toString();
});

// persist storage
const save = () => {
    localStorage.setItem('readit-items', JSON.stringify(storage));
};

const select = (e) => {
    const selectedItems = document.getElementsByClassName('read-item selected');

    selectedItems.length ? selectedItems[0].classList.remove('selected') : null;

    e.currentTarget.classList.add('selected');
};

const changeSelection = (direction) => {
    // which item is currently selected?
    const currentlySelectedItem = document.getElementsByClassName('read-item selected')[0];
    const previousSibling = currentlySelectedItem.previousElementSibling;
    const nextSibling = currentlySelectedItem.nextElementSibling;

    // handle up/down
    if (direction === 'ArrowUp' && previousSibling) {
        currentlySelectedItem.classList.remove('selected');
        previousSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && nextSibling) {
        currentlySelectedItem.classList.remove('selected');
        nextSibling.classList.add('selected');
    }
};

const open = () => {
    // first, check if we have items
    if (!storage.length) return;

    const selectedItem = document.getElementsByClassName('read-item selected')[0];
    const itemUrl = selectedItem.dataset.url;
    
    // open item in proxy BrowserWindow
    const readerWindow = window.open(itemUrl, '', `
        maxWidth=2000, maxHeight=2000,
        width=1200, height=800,
        nodeIntegration=0,
        contextIsolation=1
    `);

    // readerWindow.eval(readerJS);
};

const addNewItem = (item, isNew = false) => {
    const itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'read-item');
    itemNode.setAttribute('data-url', item.url);
    itemNode.innerHTML = (
        `<img src="${item.screenshot}">
        <h2>${item.title}</h2>
        <button type="button" id="delete-item"></button>`
    );

    items.appendChild(itemNode);

    itemNode.addEventListener('click', select);
    itemNode.addEventListener('dblclick', open);
    itemNode.lastChild.addEventListener('click', deleteItem);

    if (isNew) {
        // add item to storage and persist
        storage.push(item);
        save();
    }
};

const deleteItem = (e) => {
    const parentNode = e.target.parentNode;

    let index = 0;
    let element = parentNode;
    while (element = element.previousSibling) { index++; }
    
    // update storage then save
    let storageCopy = [...storage];
    storageCopy.splice(index, 1);
    storage = storageCopy;
    save();

    parentNode.remove();
    !storage.length ? noItems.style.display = 'block' : noItems.style.display = 'none';
};

// add items from storage when app loads
storage.forEach(item => {
    addNewItem(item);
});

module.exports = {
    addNewItem,
    deleteItem,
    storage,
    save,
    changeSelection,
    open
}