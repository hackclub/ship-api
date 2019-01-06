exports.up = knex => {
    return knex.schema.table('topics', table => {
        table.string('slug').unique()
    })
}

exports.down = knex => {
    return knex.schema.table('topics', table => {
        table.dropColumn('slug')
    })
}