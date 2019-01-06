exports.up = knex => {
    return knex.schema.table('projects', table => {
        table.string('slug').unique()
    })
}

exports.down = knex => {
    return knex.schema.table('projects', table => {
        table.dropColumn('slug')
    })
}