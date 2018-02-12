$(document).ready(() => {
  getItems();
  getTotals()
});

let itemArray = []

const getItems = async () => {
  const itemFetch = await fetch('/api/v1/items');
  const itemObject = await itemFetch.json();
  itemArray = itemObject.stuff
  appendItems(itemObject.stuff)
}

const appendItems = (items) => {
  $('.item-list').html('');
  const newItemList = items.forEach(item => {
    $('.item-list').append(`
      <article class = "item" id = ${item.id}>
        <h3> ${item.name} </h3>
        <button class = "more-btn"> More </button>
        <div class = "more-info" id=${item.id}>
        </div>
      </article>
    `)
  })
}

const getTotals = () => {
  setTimeout (() => {
    $('.item-total').append(itemArray.length)


  }, 800)

}


// $('.more-btn').on('click', getInfo)

