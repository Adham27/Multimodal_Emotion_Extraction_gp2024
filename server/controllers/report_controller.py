import os
from flask import send_file
from flask import current_app as app
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace ,Resource
from models.base_model import baseModel
from models.reports import Reports
# Create a Namespace for user operations
report = Namespace('Report', description='Report operations', path='/users')

@report.route('/<string:user_id>/report')
class GetAllReport(Resource):
    @jwt_required()
    def get(self,user_id):
        try:
            current_user = get_jwt_identity()
            if user_id == current_user:
                filter_condition = {"created_by": current_user}
                reports = baseModel.get_all(Reports, filter_condition)
                return reports
            else:
                return {"message": "Unauthorized"},401
        except Exception as e:
            return {'msg': e}

@report.route('/<string:user_id>/report/<string:report_id>/download')
class DownloadReport(Resource):
    @jwt_required()
    def get(self, user_id, report_id):
        try:
            current_user = get_jwt_identity()
            if user_id == current_user:
                report = baseModel.get_one(Reports, report_id)
                if report and report.created_by == current_user:
                    report_path = os.path.join(app.config['UPLOAD_FOLDER_PDF'], report.file_name)
                    if os.path.exists(report_path):
                        return send_file(report_path, as_attachment=True, mimetype='application/pdf')
                    else:
                        return {"message": "File not found"}, 404
                else:
                    return {"message": "Report not found or unauthorized"}, 404
            else:
                return {"message": "Unauthorized"}, 401
        except Exception as e:
            return {'msg': str(e)}, 500
@report.route('/<string:user_id>/report/<string:report_id>/delete')
class DeleteReport(Resource):
    @jwt_required()
    def delete(self, user_id, report_id):
        try:
            current_user = get_jwt_identity()
            if user_id == current_user:
                report = baseModel.get_one(Reports, report_id)
                if report and report.created_by == current_user:
                    report_path = os.path.join(app.config['UPLOAD_FOLDER_PDF'], report.file_name)
                    if os.path.exists(report_path):
                        os.remove(report_path)
                    baseModel.delete(Reports, report_id)
                    return {"message": "Report deleted successfully"}, 200
                else:
                    return {"message": "Report not found or unauthorized"}, 404
            else:
                return {"message": "Unauthorized"}, 401
        except Exception as e:
            return {'msg': str(e)}