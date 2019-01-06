import { Model } from 'objection'
import { timestampPlugin } from 'objection-timestamps'
import { ProjectComment, ProjectCreator, ProjectImage, ProjectLink, ProjectTopic, ProjectUpvote, Topic, User } from '.'

const timestamps = timestampPlugin()

class Project extends timestamps(Model) {
    static tableName = 'projects'

    static timestamp = true

    static relationMappings = () => ({
        comments: {
            relation: Model.HasManyRelation,
            modelClass: ProjectComment,
            join: {
                from: 'projects.id',
                to: 'project_comments.project_id'
            }
        },
        creators: {
            relation: Model.ManyToManyRelation,
            modelClass: User,
            join: {
                from: 'projects.id',
                through: {
                    model: ProjectCreator,
                    from: 'project_creators.project_id',
                    to: 'project_creators.user_id'
                },
                to: 'users.id'
            }
        },
        images: {
            relation: Model.HasManyRelation,
            modelClass: ProjectImage,
            join: {
                from: 'projects.id',
                to: 'project_images.project_id'
            }
        },
        links: {
            relation: Model.HasManyRelation,
            modelClass: ProjectLink,
            join: {
                from: 'projects.id',
                to: 'project_links.project_id'
            }
        },
        topics: {
            relation: Model.ManyToManyRelation,
            modelClass: Topic,
            join: {
                from: 'projects.id',
                through: {
                    model: ProjectTopic,
                    from: 'project_topics.project_id',
                    to: 'project_topics.topic_id'
                },
                to: 'topics.id'
            }
        },
        upvotes: {
            relation: Model.HasManyRelation,
            modelClass: ProjectUpvote,
            join: {
                from: 'projects.id',
                to: 'project_upvotes.project_id'
            }
        },
        main_image: {
            relation: Model.HasOneRelation,
            modelClass: ProjectImage,
            join: {
                from: 'projects.main_image_id',
                to: 'project_images.id'
            }
        }
    })
}

export default Project