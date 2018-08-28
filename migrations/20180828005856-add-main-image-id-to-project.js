module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'projects',
            'main_image_id',
            {
                type: Sequelize.INTEGER
            }
        )
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('projects', 'main_image_id')
    }
}