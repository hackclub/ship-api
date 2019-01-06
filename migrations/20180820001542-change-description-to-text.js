exports.up = knex => {
    return knex.schema.table('projects', table => {
        table.text('description').alter()
    })
}

exports.down = knex => {
    return knex.schema.table('projects', table => {
        table.string('description').alter()
    })
}