const { Model } = require('objection')
const timestamps = require('objection-timestamps').timestampPlugin()

class Topic extends timestamps(Model) {
    static get tableName() {
        return 'topics'
    }

    static get timestamp() {
        return true
    }

    static get relationMappings() {
        const { Project, ProjectTopic } = require('.')
        return {
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
        }
    }
}

module.exports = Topic