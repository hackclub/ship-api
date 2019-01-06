const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class ProjectUpvote extends timestamps(Model) {
    static get tableName() {
        return 'project_upvotes'
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
                    from: 'project_upvotes.project_id',
                    to: 'projects.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'project_upvotes.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = ProjectUpvote