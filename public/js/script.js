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
  if(items) {
  const newItemList = items.forEach(item => {
    $('.item-list').append(`
      <article class = "item-card" id = ${item.id}>
         <div class = "item-card-head">
         <h3> ${item.name} </h3>
         </div>
        <p>Reason it lingers: ${item.reason} </p>
        <p>Cleanliness: ${item.cleanliness} </p>
      </article>
    `)
  })
  }
}

const getTotals = () => {
  setTimeout (() => {
    if(itemArray.length) {
    $('.item-total').append(itemArray.length)
    cleanTotals()
    }


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

const fetchItem = () => {
  console.log('fetching')
}

const openGarage = () => {
  $('.door-left').css({"transform":"translateX(-100%)"})
  $('.door-right').css({"transform":"translateX(100%)"})
}

$('.submit-btn').on('click', postItem)
$('.sort-btn').on('click', sortItems)
$('.garage-door').on('click', openGarage)



