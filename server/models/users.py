from models.db import db
import uuid
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True,  default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    zipcode = db.Column(db.String(10), nullable=False)
    image = db.Column(db.String(200)) 
    role = db.Column(db.String(10), default='teacher', nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "password":self.password,
            "phone_number": self.phone_number,
            "zipcode": self.zipcode,
            "image": self.image,
            "role": self.role
        }