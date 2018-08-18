module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'users',
            'github_id',
            {
                type: Sequelize.INTEGER
            }
        )
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('users', 'github_id')
    }
}