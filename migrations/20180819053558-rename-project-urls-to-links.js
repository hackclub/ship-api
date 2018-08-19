module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('project_urls', 'links')
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.renameTable('links', 'project_urls')
    }
}