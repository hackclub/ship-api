const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class ProjectCreator extends timestamps(Model) {
    static get tableName() {
        return 'project_creators'
    }

    static get timestamp() {
        return true
    }

    static get relationMappings() {
        const { Project, User } = require('.')
        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: 'project_creators.project_id',
                    to: 'projects.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'project_creators.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = ProjectCreator