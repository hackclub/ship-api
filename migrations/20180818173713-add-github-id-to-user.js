exports.up = knex => {
    return knex.schema.table('users', table => {
        table.integer('github_id')
    })
}

exports.down = knex => {
    return knex.schema.table('users', table => {
        table.dropColumn('github_id')
    })
}