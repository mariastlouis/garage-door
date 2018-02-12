exports.seed = function(knex, Promise) {
  return knex('stuff').del()
    .then(function () {
      return Promise.all([
        knex('stuff').insert([
          {name: 'toothbrush', reason:'sentimental', cleanliness:'Rancid'},
          {name: 'wedding dress', reason:'hopefullness', cleanliness:'Sparking'},
          {name: 'charred suit', reason:'anger', cleanliness:'Dusty'},
        ])
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    });
};
