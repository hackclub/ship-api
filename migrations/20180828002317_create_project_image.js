exports.up = knex => {
    return knex.schema.createTable('project_images', table => {
        table.increments('id').primary()
        table.integer('project_id')
            .unsigned()
            .references('projects.id')
        table.string('url')
        table.timestamps(true, true)
    })
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('project_images')
}