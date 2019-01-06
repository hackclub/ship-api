import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project, ProjectComment, ProjectCreator, ProjectUpvote } from '.'

const timestamps = timestampPlugin()

class User extends timestamps(Model) {
    static tableName = 'users'

    static timestamp = true

    static relationMappings = () => ({
        comments: {
            relation: Model.HasManyRelation,
            modelClass: ProjectComment,
            join: {
                from: 'users.id',
                to: 'project_comments.user_id'
            }
        },
        projects: {
            relation: Model.ManyToManyRelation,
            modelClass: Project,
            join: {
                from: 'users.id',
                through: {
                    modelClass: ProjectCreator,
                    from: 'project_creators.user_id',
                    to: 'project_creators.project_id'
                },
                to: 'projects.id'
            }
        },
        upvotes: {
            relation: Model.HasManyRelation,
            modelClass: ProjectUpvote,
            join: {
                from: 'users.id',
                to: 'project_upvotes.user_id'
            }
        }
    })
}

export default User