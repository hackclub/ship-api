module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn(
                    'users',
                    'auth_token',
                    {
                        type: Sequelize.STRING
                    },
                    { transaction: t }
                ),
                queryInterface.addColumn(
                    'users',
                    'auth_token_created_at',
                    {
                        type: Sequelize.DATE,
                    },
                    { transaction: t }
                )
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('users', 'auth_token', { transaction: t }),
                queryInterface.removeColumn('users', 'auth_token_created_at', { transaction: t })
            ])
        })
    }
}