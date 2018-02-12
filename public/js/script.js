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
  cleanTotals()
  }, 800)

}

const cleanTotals = () => {
  let cleanObject = itemArray.reduce((total, itemObj) => {
    if(!total[itemObj.cleanliness]) {
      total[itemObj.cleanliness] = 0;
    }
    total[itemObj.cleanliness] ++
  return total
  }, {})
  appendCleanTotal(cleanObject)
}

const appendCleanTotal =(cleanObject) => {
  $('.clean-totals').html('');
  const cleanKeys = Object.keys(cleanObject)
  cleanKeys.forEach(item => {
    $('.clean-totals').append(`
      <li>${[item]}: ${cleanObject[item]}</li> 
    `)
  })
}

const selectClean = (event) => {

}

const postItem = async () => {
  const newProjectName = $('.item-input').val()
  const lingerInput = $('.linger-input').val()
  const cleanlinessInput =$('.clean-select').val()
  
  const postObject = {
    name: newProjectName,
    reason: lingerInput,
    cleanliness: cleanlinessInput
  }

  const saveItem = await fetch('api/v1/items', {
    method: 'POST',
    headers: {
      'CONTENT-TYPE': 'application/json'
    },
    body: JSON.stringify(postObject)
  })

  itemArray.push(postObject)

  getItems()
  getTotals()

  $('.item-input').val('')
  $('.linger-input').val('')
  $('.clean-select').val('Sparkling')
  
}

const toggleGarage = () => {
  console.log('toggling')
}

const sortItems = () => {
  let sortStuff = itemArray.sort(function(a,b) {
    if (a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  })
  itemArray = sortStuff;
  appendItems(itemArray)
}

$('.submit-btn').on('click', postItem)
$('.garage-open').on('click', toggleGarage)
$('.sort-btn').on('click', sortItems)

