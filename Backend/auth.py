from  flask import Blueprint,jsonify,request
from models import User,Company
from datetime import datetime
from extensions import connection
import time
from flask_cors import CORS, cross_origin
from psycopg2.extras import Json
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import jwt_required,get_jwt_identity


authUser_bp=Blueprint('auth/user',__name__)
authComp_bp=Blueprint('auth/company',__name__)

#Company
CREATE_NEW_COMPANY=(
    "CREATE TABLE IF NOT EXISTS company (id SERIAL PRIMARY KEY , name TEXT , email TEXT UNIQUE , password TEXT, datetime TIMESTAMP );"
)
INSERT_NEW_COMPANY=(
    "INSERT INTO company ( name, email, password, datetime) VALUES (%s , %s , %s , %s) RETURNING id;"
)
GET_COMPANY_EMAIL=(
    "SELECT COUNT(*) FROM company WHERE email = %s"
)
GET_COMPANY_PROFILE=(
     "SELECT row_to_json(company) AS result  FROM company WHERE email = %s"
)
GET_HASHED_PASSWORD_COMPANY=(
    "SELECT password FROM company WHERE email = %s"
)
GET_COMPANY_PROFILE_FROM_ID=(
     "SELECT row_to_json(company) AS result  FROM company WHERE id = %s"
)

#User

CREATE_NEW_USER=(
    # "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT , email TEXT UNIQUE ,location TEXT DEFAULT '', bio TEXT DEFAULT '',  password TEXT,specialization TEXT[]  DEFAULT '{}',intrested_work_places JSON  DEFAULT '{}',rewards INT DEFAULT '0',appliedQuest INT REFERENCES job(job_id) ON DELETE CASCADE , datetime TIMESTAMP );"
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT , email TEXT UNIQUE ,location TEXT , bio TEXT ,  password TEXT ,quest_history JSONB , quest_preferences TEXT[]  ,rewards INT ,quest_completed INT , datetime TIMESTAMP );"
)

INSERT_NEW_USER=(
    "INSERT INTO users ( name, email ,password, datetime) VALUES (%s ,%s, %s ,%s) RETURNING id;"
)

GET_USER_EMAIL=(
    "SELECT COUNT(*) FROM users WHERE email = %s"
)
GET_USER_PROFILE=(
     "SELECT row_to_json(users) AS result  FROM users WHERE email = %s"
)
GET_USER_PROFILE_LOGIN=(
     "SELECT users AS result  FROM users WHERE email = %s"
)
GET_HASHED_PASSWORD_USER=(
    "SELECT password FROM users WHERE email = %s"
)
UPDATE_USER_PROFILE=(
    #  "UPDATE users SET name=%s ,location=%s,bio=%s,quest_history=jsonb_set(jsonb_set(activity_data, '{title}', %s::jsonb),'{category}', %s::jsonb),quest_preferences=%s,rewards=%s,quest_completed=%s WHERE email=%s"
     "UPDATE users SET name=%s ,location=%s,bio=%s,quest_preferences=%s,rewards=%s,quest_completed=%s WHERE email=%s"
)
GET_CHANGEABLE_USER=(
     "SELECT name,location,bio,quest_history,quest_preferences,rewards,quest_completed FROM users WHERE email = %s"
)



##########  User Authentication  #############

#Signup
@authUser_bp.post('/register')
def register_user():
    data=request.get_json()
    name=data.get('name')
    email=data.get('email')
    # bio=data.get('bio')
    # specialization=data.get('specialization')
    # intrested_work_places=data.get('intrested_work_places')
    # intrested_work_places=Json(intrested_work_places)
    password=data.get('password')
    hashed_password=generate_password_hash(password=password)
    datetimes=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    with connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(CREATE_NEW_USER)
                cursor.execute(GET_USER_EMAIL,(email,))
                answer=cursor.fetchone()[0]
                if answer:
                    return jsonify({"message":"User already exist"}),200
                else:
                    # cursor.execute(INSERT_NEW_USER,(name,bio,email,hashed_password,specialization,intrested_work_places ,datetimes,))
                    cursor.execute(INSERT_NEW_USER,(name,email,hashed_password,datetimes,))
                    cursor.execute(GET_USER_PROFILE,(email,))
                    user=cursor.fetchall()
                    return  jsonify({"message":"User account created","user":user}),201
            except Exception as e:
                    print(e)

    return  jsonify({"message":"Failed to create user"}),200


#Login
@authUser_bp.post('/login')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def login_user():

    data=request.get_json()
    email=data.get('email')
    password=data.get('password')
    access_token=create_access_token(identity=email)
    refresh_token=create_refresh_token(identity=email)
    try:
        with connection:
            with connection.cursor() as cursor:
                    cursor.execute(CREATE_NEW_USER)
                    cursor.execute(GET_USER_EMAIL,(email,))
                    answer=cursor.fetchone()[0]
                    if answer:
                        try:
                            cursor.execute(GET_HASHED_PASSWORD_USER,(email,))
                            hashed_password=cursor.fetchone()[0]
                            if answer and  check_password_hash(hashed_password,password):
                                cursor.execute(GET_USER_PROFILE,(email,))
                                user=cursor.fetchall()
                                print(user)
                                # return jsonify({"user":user,"token":access_token})
                                return jsonify({"message":"Loggedin successfully","user":user,"token":access_token,"refresh_token":refresh_token}),201
                            else:
                                 return jsonify({"message":"Enter correct credentials"})
                        except Exception as e:
                            print(e)
                    else:
                        return jsonify({"message":"User Doesn't Exists"}),200
    except Exception as e:
         print(e)
    return jsonify({"error":"Invalid email or password"}),200

#profile user
@authUser_bp.get('/profile')
@jwt_required()
def get_user():
    user_email=get_jwt_identity()
    try:
        with connection:
            with connection.cursor() as cursor:
                    cursor.execute(CREATE_NEW_USER)
                    cursor.execute(GET_USER_PROFILE,(user_email,))
                    data=cursor.fetchone() 
                    return jsonify(data),201
    except Exception as e:
                print(e)
    return jsonify({"result":"User Doesn't exists"}),200

@authUser_bp.put('/change_profile')
@jwt_required()
def update_user():
     data=request.get_json()
     email=get_jwt_identity()
     name=data.get('name')
     location=data.get('location')
     bio=data.get('bio')
    #  quest_history=data.get('quest_history')
     quest_preferences=data.get('quest_preferences')
     rewards=data.get('rewards')
     quest_completed=data.get('quest_completed')
     print(name,location,bio,quest_preferences,rewards,quest_completed)
     try:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(GET_CHANGEABLE_USER,(email,))
                value=cursor.fetchone()
                print(value[0],value[1],value[2],value[3],value[4],value[5],value[6])
                oname=value[0]
                olocation=value[1]
                obio=value[2]
                # oquest_history=value[3]
                oquest_preferences=value[4]
                orewards=value[5]
                oquest_completed=value[6]
                if name==None:
                        name=oname
                if location==None:
                        location=olocation
                if bio==None:
                        bio=obio
                # if quest_history==None:
                #         quest_history=oquest_history
                if quest_preferences==None:
                        quest_preferences=oquest_preferences
                if rewards==None:
                        rewards=orewards
                if quest_completed==None:
                        quest_completed=oquest_completed
                # cursor.execute(UPDATE_USER_PROFILE,(name,location,bio,quest_history,quest_preferences,rewards,quest_completed,email,))
                cursor.execute(UPDATE_USER_PROFILE,(name,location,bio,quest_preferences,rewards,quest_completed,email,))
                cursor.execute(GET_USER_PROFILE,(email,))
                user=cursor.fetchone()
                return jsonify({"message":"Updated Successfully","user":user}),201
     except Exception as e:
          return jsonify({"message":"Failed to update"}),200

        
    #  try:
    #       with connection:
    #            with connection.cursor() as cursor:
    #                 cursor.execute(UPDATE_USER_PROFILE,)
     
     


##########  Comapany Authentication  #############

#Signup
@authComp_bp.post('/register')
def register_company():
    data=request.get_json()
    name=data.get('name')
    email=data.get('email')
    password=data.get('password')
    datetimes=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    hashedPassword=generate_password_hash(password)
    
    with connection:
            with connection.cursor() as cursor:
                try:
                    cursor.execute(CREATE_NEW_COMPANY)
                    cursor.execute(GET_COMPANY_EMAIL,(email,))
                    answer=cursor.fetchone()[0]
                except Exception as e:
                    print(e)
            with connection.cursor() as cursor:
                try:
                    if answer:
                        return jsonify({"message":"Company already exist"}),200
                    else:
                        cursor.execute(INSERT_NEW_COMPANY,(name, email, hashedPassword, datetimes))
                        cursor.execute(GET_COMPANY_PROFILE,(email,))
                        user=cursor.fetchall()
                        return  jsonify({"message":"Company account created","user":user}),201
                except Exception as e:
                        print(e)

    return  jsonify({"message":"Failed to create"}),200




#Login
@authComp_bp.post('/login')
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def login_company():
    data=request.get_json()
    email=data.get('email')
    password=data.get('password')
    access_token=create_access_token(identity=email)
    refresh_token=create_refresh_token(identity=email)
    with connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(GET_COMPANY_EMAIL,(email,))
                answer=cursor.fetchone()
                if answer[0]!=0:
                    try:
                        cursor.execute(GET_HASHED_PASSWORD_COMPANY,(email,))
                        hashed_password=cursor.fetchone()[0]
                        if answer and  check_password_hash(hashed_password,password):
                            cursor.execute(GET_COMPANY_PROFILE,(email,))
                            user=cursor.fetchall()
                            return jsonify({"message":"Loggedin successfully","user":user,"token":access_token,"refresh_token":refresh_token}),201
                        else:
                             return jsonify({"message":"Enter correct credentials"})
                    except Exception as e:
                         print(e)
                else:
                     return jsonify({"message":"User doesn't exists"})
            except Exception as e:
                    print(e)

    return jsonify({"error":"Invalid name or password"}),200


@authComp_bp.get('/company_for_quest')
def get_company_details():
    id=request.args.get('id')
    try:
        with connection:
            with connection.cursor() as cursor:
                    cursor.execute(GET_COMPANY_PROFILE_FROM_ID,(id,))
                    data=cursor.fetchone() 
                    return jsonify(data),201
    except Exception as e:
                print(e)
    return jsonify({"result":"User Doesn't exists"}),200