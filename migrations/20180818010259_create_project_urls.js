exports.up = knex => {
    return knex.schema.createTable('project_urls', table => {
        table.increments('id').primary()
        table.integer('project_id')
            .unsigned()
            .references('projects.id')
            .notNullable()
        table.string('url').notNullable()
        table.timestamps(true, true)
    })
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('project_urls')
}