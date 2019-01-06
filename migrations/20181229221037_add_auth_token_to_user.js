exports.up = knex => {
    return knex.schema.table('users', table => {
        table.string('auth_token')
        table.timestamp('auth_token_created_at').defaultTo(knex.fn.now())
    })
}

exports.down = knex => {
    return knex.schema.table('users', table => {
        table.dropColumn('auth_token')
        table.dropColumn('auth_token_created_at')
    })
}