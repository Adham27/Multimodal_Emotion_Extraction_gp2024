from datetime import datetime
from models.db import db
import uuid
class Reports(db.Model):
    id = db.Column(db.String(36), primary_key=True,  default=lambda: str(uuid.uuid4()))
    reportname = db.Column(db.String(50), unique=True, nullable=False)
    created_by = db.Column(db.String(36), db.ForeignKey('user.id'))  # ForeignKey to user.id
    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)
    pdf = db.Column(db.String(200)) 


    # Define relationship with User model
    user = db.relationship('User', backref='reports', foreign_keys=[created_by])

    def serialize(self):
        return {
            "id": self.id,
            "reportname": self.reportname,
            "created_by": self.created_by,
            "created_at": self.created_at,
            "pdf":self.pdf
        }