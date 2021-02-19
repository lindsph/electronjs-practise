// everything that happens on the UI...
const { ipcRenderer } = require('electron');
const validUrl = require('valid-url');
const { addNewItem, deleteItem, storage, save, changeSelection, open, openNative } = require('./items');

const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const deleteButton = document.getElementById('delete-item');
const noItems = document.getElementById('no-items');
const items = document.getElementById('items');
const itemUrl = document.getElementById('url');
const search = document.getElementById('search');

items.childNodes.length ? noItems.style.display = 'none' : noItems.style.display = 'block';

const toggleModalButtons = () => {
    if (!addItem.disabled) {
        addItem.disabled = true;
        addItem.innerText = 'Adding...';
    } else {
        addItem.disabled = false;
        addItem.innerText = 'Add Item';
    }
};

showModal.addEventListener('click', () => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

addItem.addEventListener('click', (e) => {
    const url = itemUrl.value;
    
    if (validUrl.isUri(url)) {
        toggleModalButtons();
        // send URL to the main process
        ipcRenderer.send('valid-url', url);
    } else {
        console.log('Not a valid URL!')
        itemUrl.focus();
    }
});

itemUrl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') addItem.click();
});

// investigate better way to do this?
search.addEventListener('keyup', (e) => {
    const items = [...document.getElementsByClassName('read-item')].map(item => {
        const isMatch = item.innerText.toLowerCase().includes(search.value);
        isMatch ? item.style.display = 'flex' : item.style.display = 'none';
    });
});

// navigate item selection with up/down arrows
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') changeSelection(e.key);
});

ipcRenderer.on('created-new-item', (e, newItem) => {
    // console.log(newItem);

    // add new item to "items" node
    addNewItem(newItem, true);

    toggleModalButtons();

    // hide modal and clear input value 
    itemUrl.value = '';
    closeModal.click();
    noItems.style.display = 'none'
});

ipcRenderer.on('menu-show-modal', () => {
    showModal.click();
});

ipcRenderer.on('menu-open-item', () => {
    open();
});

ipcRenderer.on('menu-delete-item', (e) => {
    deleteItem();
});

ipcRenderer.on('menu-open-item-native', () => {
    openNative();
});

ipcRenderer.on('menu-focus-search', () => {
    search.focus();
});