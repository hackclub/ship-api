import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project } from '.'

const timestamps = timestampPlugin()

class ProjectImage extends timestamps(Model) {
    static tableName = 'project_images'

    static timestamp = true

    static relationMappings = () => ({
        project: {
            relation: Model.BelongsToOneRelation,
            modelClass: Project,
            join: {
                from: 'project_images.project_id',
                to: 'projects.id'
            }
        }
    })
}

export default ProjectImage