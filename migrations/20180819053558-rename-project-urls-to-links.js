exports.up = knex => {
    return knex.schema.renameTable('project_urls', 'links')
}

exports.down = knex => {
    return knex.schema.renameTable('links', 'project_urls')
}