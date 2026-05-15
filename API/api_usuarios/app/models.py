from app import db
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100)
    )

    password = db.Column(
        db.String(200),
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )
    role = db.Column(
    db.String(20),
    default="user",
    nullable=False
)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(
            self.password,
            password
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active,
            "role": self.role
        }