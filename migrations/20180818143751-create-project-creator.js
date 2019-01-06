exports.up = knex => {
    return knex.schema.createTable('project_creators', table => {
        table.increments('id').primary()
        table.integer('project_id')
            .unsigned()
            .references('projects.id')
        table.integer('user_id')
            .unsigned()
            .references('users.id')
        table.timestamps(true, true)
    })
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('project_creators')
}