const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class ProjectComment extends timestamps(Model) {
    static get tableName() {
        return 'project_comments'
    }

    static get timestamp() {
        return true
    }

    static get relationMappings() {
        const { Project, ProjectComment, User } = require('.')
        return {
            parent: {
                relation: Model.BelongsToOneRelation,
                modelClass: ProjectComment,
                join: {
                    from: 'project_comments.parent_id',
                    to: 'project_comments.id'
                }
            },
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: Project,
                join: {
                    from: 'project_comments.project_id',
                    to: 'projects.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'project_comments.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = ProjectComment