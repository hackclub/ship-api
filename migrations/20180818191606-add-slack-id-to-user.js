exports.up = knex => {
    return knex.schema.table('users', table => {
        table.string('slack_id')
    })
}

exports.down = knex => {
    return knex.schema.table('users', table => {
        table.dropColumn('slack_id')
    })
}