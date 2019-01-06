exports.up = knex => {
    return knex.schema.table('projects', table => {
        table.integer('main_image_id')
            .unsigned()
            .references('project_images.id')
    })
}

exports.down = knex => {
    return knex.schema.table('projects', table => {
        table.dropColumn('main_image_id')
    })
}