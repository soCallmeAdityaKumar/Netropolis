from extensions import db
from uuid import uuid4
from werkzeug.security import generate_password_hash,check_password_hash


class User(db.Model):
    __tablename__='users'
    id=db.Column(db.String(),primary_key=True,default =str(uuid4()))
    username=db.Column(db.String(),nullable=False)
    email=db.Column(db.String(),nullable=False)
    password=db.Column(db.Text())


    def __repr_(self):
        return f"<User {self.username}>"
    

    def set_password(self,password):
        self.password=generate_password_hash(password)

    
    def check_password(self,password):
        return check_password_hash(self.password,password)
    
    @classmethod
    def get_user_by_username(cls,username):
        return cls.query.filter_by(username=username).first()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Company(db.Model):
    __tablename__='company'
    id=db.Column(db.String(),primary_key=True,default =str(uuid4()))
    username=db.Column(db.String(),nullable=False)
    email=db.Column(db.String(),nullable=False)
    password=db.Column(db.Text())


    def __repr_(self):
        return f"<Company {self.username}>"
    

    def set_password(password):
        return generate_password_hash(password)

    
    def check_password(self,password):
        return check_password_hash(self.password,password)
    
    @classmethod
    def get_company_by_username(cls,username):
        return cls.query.filter_by(username=username).first()
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Job(db.Model):
    __tablename__='jobs'
    id=db.Column(db.String(),primary_key=True,default =str(uuid4()))
    jobname=db.Column(db.String(),nullable=False)
    description=db.Column(db.String(),nullable=False)
    wage=db.Column(db.Text())


    def __repr_(self):
        return f"<Job {self.jobname}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


def init_db():
    db.create_all()