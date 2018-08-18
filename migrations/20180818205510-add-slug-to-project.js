module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'projects',
            'slug',
            {
                unique: true,
                type: Sequelize.STRING
            }
        )
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('projects', 'slug')
    }
}