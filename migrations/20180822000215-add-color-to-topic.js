module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'topics',
            'color',
            {
                type: Sequelize.STRING
            }
        )
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('topics', 'color')
    }
}