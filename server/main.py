from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from config import DevConfig
from models.base_model import db
from flask_jwt_extended import JWTManager
from controllers.auth_controller import auth
from controllers.user_controller import user
from controllers.report_controller import report
from controllers.app_controller import application
from flask import Flask, send_from_directory

app = Flask(__name__)
CORS(app)

jwt = JWTManager(app)
# Initialize SQLAlchemy with the Flask app
app.config.from_object(DevConfig)

@app.route('/uploads/images/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER_IMAGES'], filename)

@app.route('/uploads/pdf/<filename>')
def uploaded_pdf_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER_PDF'], filename)

api = Api(app, debug=True , version='1.0', title='Expressify APIs', description='API documentation' , prefix='/api')

# Initialize the database with the Flask app
db.init_app(app)

# Add the Auth namespace and resources
api.add_namespace(auth)
api.add_namespace(user)
api.add_namespace(report)
api.add_namespace(application)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

