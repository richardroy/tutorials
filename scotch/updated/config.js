require('dotenv').config();

module.exports = {
    'database': `mongodb://richardgibson_me_projects_app:${process.env.MONGODB_PASSWORD}@ds163835.mlab.com:63835/richardgibson_me_projects`
};