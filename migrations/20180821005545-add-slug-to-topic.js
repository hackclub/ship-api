module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'topics',
            'slug',
            {
                unique: true,
                type: Sequelize.STRING
            }
        )
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('topics', 'slug')
    }
}