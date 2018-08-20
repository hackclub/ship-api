module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('projects', 'description', Sequelize.TEXT)
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('projects', 'description', Sequelize.STRING)
    }
}