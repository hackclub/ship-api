import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { Project, ProjectTopic } from '.'

const timestamps = timestampPlugin()

class Topic extends timestamps(Model) {
    static tableName = 'topics'

    static timestamp = true

    static relationMappings = () => ({
        projects: {
            relation: Model.ManyToManyRelation,
            modelClass: Project,
            join: {
                from: 'topics.id',
                through: {
                    modelClass: ProjectTopic,
                    from: 'project_topics.topic_id',
                    to: 'project_topics.project_id'
                },
                to: 'projects.id'
            }
        }
    })
}

export default Topic