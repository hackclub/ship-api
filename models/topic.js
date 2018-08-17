module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define(
        'Topic',
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'topic needs to have a name'
                    }
                }
            },
            description: DataTypes.STRING
        },
        {
            tableName: 'topics',
            underscored: true,
        }
    )
    Topic.associate = function (models) {
        // associations can be defined here
    }

    return Topic
}