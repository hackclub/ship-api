module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('links', 'project_links')
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('project_links', 'links')
    }
}