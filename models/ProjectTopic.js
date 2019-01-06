const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class ProjectTopic extends timestamps(Model) {
    static get tableName() {
        return 'project_topics'
    }

    static get timestamp() {
        return true
    }

    static get relationMappings() {
        const { Project, Topic } = require('.')
        return {
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
        }
    }
}

module.exports = ProjectTopic