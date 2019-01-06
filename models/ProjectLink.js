import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project } from '.'

const timestamps = timestampPlugin()

class ProjectLink extends timestamps(Model) {
    static tableName = 'project_links'

    static timestamp = true

    static relationMappings = () => ({
        project: {
            relation: Model.BelongsToOneRelation,
            modelClass: Project,
            join: {
                from: 'project_links.project_id',
                to: 'projects.id'
            }
        }
    })
}

export default ProjectLink