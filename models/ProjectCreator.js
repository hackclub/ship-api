import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project, User } from '.'

const timestamps = timestampPlugin()

class ProjectCreator extends timestamps(Model) {
    static tableName = 'project_creators'

    static timestamp = true

    static relationMappings = () => ({
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
    })
}

export default ProjectCreator