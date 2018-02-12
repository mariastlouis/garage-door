




const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname + '/public')));

app.locals.title = 'Garage door';

app.set('port', process.env.PORT || 3000)

app.get('/', (request, response) => {
  response.send('Welcome to garage door')
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});



app.get('/api/v1/items', (request, response) => {
  database('stuff').select()
  .then((stuff) => {
    response.status(200).json({stuff})
  })
  .catch((error) => {
    response.status(500).json({error})
  })
})

app.get('/api/v1/items/:id', (request, response) => {
  database('stuff').where('id', request.params.id).select()
  .then(stuff=> {
    if(stuff.length) {
      return response.status(200).json({stuff})
    } else {
      response.status(404).json({
        error:`Cound not find item with the id of ${request.params.id}`
      })
    }
  })
  .catch(error => {
    return response.status(500).json({error})
  })
})

app.post('/api/v1/items', (request, response) => {
  const stuff = request.body
  for(let requiredParameter of ['name', 'reason', 'cleanliness']){
    if(!stuff[requiredParameter]){
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      })
    }
  }
  database('stuff').insert(stuff, 'id')
  .then(stuff => {
    return response.status(201).json({id: stuff[0]})
  })
  .catch(error => {
    return response.status(500).json({error})
  })
})



app.patch('/api/v1/items/:id', (request, response) => {
  database('stuff').where('id', request.params.id).update(request.body, '')
  .then(update => {
    if(!update) {
      return response.sendStatus(404).json({
        error: 'Could not update stuff'
      })
    } else {
      response.sendStatus(202)
    }
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

module.exports = app;