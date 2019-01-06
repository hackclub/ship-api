import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project, User } from '.'

const timestamps = timestampPlugin()

class ProjectComment extends timestamps(Model) {
    static tableName = 'project_comments'

    static timestamp = true

    static relationMappings = () => ({
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
    })
}

export default ProjectComment