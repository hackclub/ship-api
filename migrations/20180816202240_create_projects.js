exports.up = knex => {
    return knex.schema.createTable('projects', table => {
        table.increments('id').primary()
        table.string('name')
        table.string('tagline')
        table.string('description')
        table.timestamps(true, true)
    })
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('projects')
}