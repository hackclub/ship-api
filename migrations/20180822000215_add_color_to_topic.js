exports.up = knex => {
    return knex.schema.table('topics', table => {
        table.string('color')
    })
}

exports.down = knex => {
    return knex.schema.table('topics', table => {
        table.dropColumn('color')
    })
}