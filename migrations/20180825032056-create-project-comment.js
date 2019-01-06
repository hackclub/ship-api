exports.up = knex => {
    return knex.schema.createTable('project_comments', table => {
        table.increments('id').primary()
        table.integer('project_id')
            .unsigned()
            .references('projects.id')
        table.integer('user_id')
            .unsigned()
            .references('users.id')
        table.integer('parent_id')
            .unsigned()
            .references('project_comments.id')
        table.text('body')
        table.timestamps(true, true)
    })
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('project_comments')
}