module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'users',
            'slack_id',
            {
                type: Sequelize.STRING
            }
        )
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('users', 'slack_id')
    }
}