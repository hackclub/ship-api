exports.up = knex => {
    return knex.schema.createTable('topics', table => {
        table.increments('id').primary()
        table.string('name')
        table.string('description')
        table.timestamps(true, true)
    })  
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('topics')
}