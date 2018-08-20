module.exports = (sequelize, DataTypes) => {
    const Link = sequelize.define(
        'Link',
        {
            project_id: DataTypes.INTEGER,
            url: DataTypes.STRING
        },
        {
            tableName: 'links',
            underscored: true
        }
    )
    Link.associate = models => {
        Link.belongsTo(models.Project)
    }

    return Link
}