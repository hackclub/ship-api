exports.up = knex => {
    return knex.schema.renameTable('links', 'project_links')
}

exports.down = knex => {
    return knex.schema.renameTable('project_links', 'links')
}