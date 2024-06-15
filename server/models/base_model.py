from sqlalchemy import and_
from models.db import db
from flask import jsonify
import uuid

class baseModel:

    @classmethod
    def find_by_field(cls, model, field, value):
        return model.query.filter(getattr(model, field) == value).first()

    @classmethod
    def find_by_id(cls, model, id):
        try:
            uuid_id = uuid.UUID(id)
        except ValueError:
            return None
        return model.query.get(str(uuid_id))

    @classmethod
    def get_all(cls, model, filter_condition=None):
        query = model.query
        if filter_condition:
            filter_expr = and_(*[getattr(model, key) == value for key, value in filter_condition.items()])
            query = query.filter(filter_expr)

        items = query.all()
        item_list = [item.serialize() for item in items]
        return jsonify(item_list)

    @classmethod
    def get_one(cls, model, id, filter_condition=None):
        try:
            uuid_id = uuid.UUID(id)
        except ValueError:
            return jsonify({"message": "Invalid ID format"}), 400

        query = model.query
        if filter_condition:
            query = query.filter(filter_condition)
        item = query.get(str(uuid_id))
        if item:
            return item.serialize()
        else:
            return jsonify({"message": f"{model.__name__} not found"}), 404

    @classmethod
    def update(cls, model, id, new_data):
        try:
            uuid_id = uuid.UUID(id)
        except ValueError:
            return jsonify({"message": "Invalid ID format"}), 400

        item = cls.find_by_id(model, str(uuid_id))
        if item:
            for key, value in new_data.items():
                setattr(item, key, value)
            db.session.commit()
            return jsonify({"message": f"{model.__name__} updated successfully"}), 200
        else:
            return jsonify({"message": f"{model.__name__} not found"}), 404

    @classmethod
    def delete(cls, model, id):
        try:
            uuid_id = uuid.UUID(id)
        except ValueError:
            return jsonify({"message": "Invalid ID format"}), 400

        item = cls.find_by_id(model, str(uuid_id))
        if item:
            db.session.delete(item)
            db.session.commit()
            return jsonify({"message": f"{model.__name__} deleted successfully"}), 200
        else:
            return jsonify({"message": f"{model.__name__} not found"}), 404

    @classmethod
    def search(cls, model, field, value):
        item = cls.find_by_field(model, field, value)
        if item:
            return jsonify(item.serialize())
        else:
            return jsonify({"message": f"{model.__name__} not found"}), 404

    @classmethod
    def insert(cls, model, new_data):
        new_item = model(**new_data)
        db.session.add(new_item)
        db.session.commit()
        return new_item.id
