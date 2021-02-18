
const items = document.getElementById('items');

// track all items
const storage = JSON.parse(localStorage.getItem('readit-items')) || [];

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
    
};

const addNewItem = (item, isNew = false) => {
    const itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'read-item');
    itemNode.setAttribute('data-url', item.url);
    itemNode.innerHTML = (
        `<img src="${item.screenshot}">
        <h2>${item.title}</h2>`
    );

    items.appendChild(itemNode);

    itemNode.addEventListener('click', select);
    itemNode.addEventListener('dblclick', open);

    if (isNew) {
        // add item to storage and persist
        storage.push(item);
        save();
    }
};

// add items from storage when app loads
storage.forEach(item => {
    addNewItem(item);
});

module.exports = {
    addNewItem,
    storage,
    save,
    changeSelection,
    open
}