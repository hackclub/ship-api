import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project, Topic } from '.'

const timestamps = timestampPlugin()

class ProjectTopic extends timestamps(Model) {
    static tableName = 'project_topics'

    static timestamp = true

    static relationMappings = () => ({
        project: {
            relation: Model.BelongsToOneRelation,
            modelClass: Project,
            join: {
                from: 'project_topics.project_id',
                to: 'projects.id'
            }
        },
        topic: {
            relation: Model.BelongsToOneRelation,
            modelClass: Topic,
            join: {
                from: 'project_topics.topic_id',
                to: 'topics.id'
            }
        }
    })
}

export default ProjectTopic