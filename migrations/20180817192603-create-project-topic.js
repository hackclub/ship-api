module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('project_topics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            project_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'projects',
                    key: 'id'
                }
            },
            topic_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'topics',
                    key: 'id'
                }
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('project_topics')
    }
}