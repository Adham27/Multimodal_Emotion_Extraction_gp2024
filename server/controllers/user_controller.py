from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace ,Resource
from models.base_model import baseModel
from models.users import User
import uuid
# Create a Namespace for user operations
user = Namespace('User', description='User operations', path='/')

# admin 
@user.route('/users')
class GetAllUsers(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = baseModel.get_one(User, get_jwt_identity())
            if current_user['role'] != 'teacher':
                return jsonify({'message': 'You are not authorized to access this resource'}), 403
            users = baseModel.get_all(User)
            return users
        except Exception as e:
            return jsonify({'msg': str(e)}), 500

@user.route('/users/<string:user_id>')
class GetOneUser(Resource):
    @jwt_required()
    def get(self, user_id):
        try:
            try:
                uuid.UUID(user_id)
            except ValueError:
                return jsonify({"message": "Invalid user ID format"}), 400
            user = baseModel.get_one(User, user_id)
            return user
        except Exception as e:
            return jsonify({'msg': str(e)}), 500

@user.route('/users/update/<string:user_id>')
class UpdateUser(Resource):
    @jwt_required()
    def patch(self, user_id):
        try:
            # Validate that the user_id is a valid UUID
            try:
                uuid.UUID(user_id)
            except ValueError:
                return jsonify({"message": "Invalid user ID format"}), 400

            data = request.json
            current_user_id = get_jwt_identity()
            current_user = baseModel.get_one(User, current_user_id)

            if current_user['role'] != 'admin':
                if user_id != current_user_id:
                    return jsonify({"message": "Unauthorized"}), 403
                else:
                    updated_user = baseModel.update(User, current_user_id, data)
            else:
                updated_user = baseModel.update(User, user_id, data)

            return updated_user
        except Exception as e:
            return jsonify({'msg': str(e)}), 500

@user.route('/users/delete/<string:user_id>')
class DeleteUser(Resource):
    @jwt_required()
    def delete(self, user_id):
        try:
            # Validate that the user_id is a valid UUID
            try:
                uuid.UUID(user_id)
            except ValueError:
                return jsonify({"message": "Invalid user ID format"}), 400

            current_user_id = get_jwt_identity()
            current_user = baseModel.get_one(User, current_user_id)

            if current_user['role'] != 'admin':
                if user_id != current_user_id:
                    return jsonify({"message": "Unauthorized"}), 403
                else:
                    deleted_user = baseModel.delete(User, current_user_id)
            else:
                deleted_user = baseModel.delete(User, user_id)

            return deleted_user
        except Exception as e:
            return jsonify({'msg': str(e)}), 500