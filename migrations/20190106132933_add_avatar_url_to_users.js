exports.up = knex => {
    return knex.schema.table('users', table => {
        table.string('avatar_url').defaultTo(null)
    })
}

exports.down = knex => {
    return knex.schema.table('users', table => {
        table.dropColumn('avatar_url')
    })
}