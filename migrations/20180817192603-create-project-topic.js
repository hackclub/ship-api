exports.up = knex => {
    return knex.schema.createTable('project_topics', table => {
        table.increments('id').primary()
        table.integer('project_id')
            .unsigned()
            .references('projects.id')
            .notNullable()
        table.integer('topic_id')
            .unsigned()
            .references('topics.id')
            .notNullable()
        table.timestamps(true, true)
    })
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('project_topics')
}