# from extensions import connection
from datetime import datetime
from models import Job
from extensions import connection
from  flask import Blueprint,jsonify,request
from models import init_db
from flask_cors import CORS, cross_origin
import json
from flask_jwt_extended import jwt_required,get_jwt_identity
from auth import CREATE_NEW_COMPANY

CREATE_NEW_JOB=(
    "CREATE TABLE IF NOT EXISTS job (job_id  SERIAL PRIMARY KEY, title TEXT ,image Text, description TEXT,category TEXT[],location TEXT,difficulty TEXT ,duration INT,prerequisites TEXT, rewards INT,participant_limit INT, datetime TIMESTAMP,requirements TEXT[],tasks_overview TEXT[],instruction TEXT[],additional_information TEXT, company_id SERIAL REFERENCES company(id) ON DELETE CASCADE);"
)
INSERT_NEW_JOB=(
    "INSERT INTO job ( title,image, description, category,  location, difficulty, duration,prerequisites, rewards,participant_limit,datetime,requirements ,tasks_overview,instruction,additional_information, company_id) VALUES (%s , %s,%s , %s , %s, %s, %s, %s, %s, %s, %s,%s,%s,%s,%s,%s) RETURNING job_id;"
)
GET_COMPANY_ID=(
    "SELECT id FROM company WHERE email = %s"
)

GET_ALL_JOB=(
    "SELECT row_to_json(job) AS result FROM job"
)
GET_JOBS_BY_COMPANY_ID=(
    "SELECT row_to_json(job) AS result FROM job WHERE company_id=%s"
)

GET_COMPANY_ID_BY_NAME=(
    "SELECT id FROM company WHERE name=%s"
)

GET_JOB_BY_WAGE_RANGE=(
    "SELECT row_to_json(job) AS result  FROM job WHERE rewards BETWEEN %s AND %s"
)

GET_JOB_BY_JOB_ID=(
    "SELECT row_to_json(job) AS result  FROM job WHERE job_id=%s"
)
GET_JOB_BY_LOCATION=(
    "SELECT row_to_json(job) AS result  FROM job WHERE location=%s"
)

GET_JOB_BY_CATEGORY=(
    "SELECT row_to_json(job) AS result  FROM job WHERE category=%s"
)
GET_JOB_BY_FILTER=(
    "SELECT row_to_json(job) AS result  FROM job WHERE location=%s AND category=%s  AND company_id=%s "
)
GET_JOB_BY_FILTERLI=(
    "SELECT row_to_json(job) AS result  FROM job WHERE location=%s  AND company_id=%s "
)
GET_JOB_BY_FILTERLC=(
    "SELECT row_to_json(job) AS result  FROM job WHERE location=%s AND category=%s "
)
GET_JOB_BY_FILTERIC=(
    "SELECT row_to_json(job) AS result  FROM job WHERE  category=%s  AND company_id=%s "
)

UPDATE_JOB_WITH_USER=(
    "UPDATE job SET user_id=%s WHERE job_id=%s"
)
UPDATE_USER_WITH_JOB=(
    "UPDATE users SET job_id=%s WHERE id=%s"
)
GET_USER_WITH_ID=(
    "SELECT id FROM users WHERE email=%s"
)



user_bp=Blueprint('users',__name__)
job_bp=Blueprint('jobs',__name__)


@job_bp.post("/createjob")
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
@jwt_required()
def create_job():
    data=request.get_json()
    company_email=get_jwt_identity()
    title=data.get('title')
    description=data.get('description')
    rewards=data.get('rewards')
    image=data.get('image')
    if image==None:
        image='https://raw.githubusercontent.com/soCallmeAdityaKumar/WQRender/blob/master/frontend/src/assets/anime-style-house-architecture.jpg'
    category=data.get('category')
    additional_information=data.get('additional_information'),
    location=data.get('location')
    difficulty=data.get('difficulty')
    duration=data.get('duration')
    prerequisites=data.get('prerequisites')
    participant_limit=data.get('participant_limit')
    requirements=data.get('requirements')
    tasks_overview=data.get('tasks_overview')
    instruction=data.get('instruction')
    datetimes=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    # print(title,image, description, category,  location, difficulty, duration,prerequisites, rewards,participant_limit,datetimes,requirements ,tasks_overview,instruction,additional_information, company_id,)
    with connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(CREATE_NEW_JOB)
                cursor.execute(GET_COMPANY_ID,(company_email,))
                company_id=cursor.fetchone()[0]
                cursor.execute(INSERT_NEW_JOB,(title,image, description, category,  location, difficulty, duration,prerequisites, rewards,participant_limit,datetimes,requirements ,tasks_overview,instruction,additional_information, company_id,))
                job_id=cursor.fetchone()[0]
                return jsonify({"id":job_id,"message":"Job " +title +" created"}),201
            except Exception as e:
                print(e)
    return jsonify({"message":"Cannot create job , Only Admin can create it or try after some time"}),200

@job_bp.get('/all')
def get_all_jobs():
   with connection:
    with connection.cursor() as cursor:
        try:
            cursor.execute(CREATE_NEW_COMPANY)
            cursor.execute(CREATE_NEW_JOB)
            cursor.execute(GET_ALL_JOB)
            jobs=cursor.fetchall()
            jobs= [item for sublist in jobs for item in sublist]
            return jsonify({"message":"Jobs Fetched","jobs":jobs})
        except Exception as e:
            print(e)
    return jsonify({"message":"cannot get jobs"}),200
    
@job_bp.get('/company_name')
def get_all_jobs_by_compnay_name():
    querry=request.args.get("name")
    with connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(CREATE_NEW_JOB)
                cursor.execute(GET_COMPANY_ID_BY_NAME,(querry,))
                company_id=cursor.fetchone()[0]
                if company_id >0:
                    cursor.execute(GET_JOBS_BY_COMPANY_ID,(company_id,))
                    job=cursor.fetchall()
                    job= [item for sublist in job for item in sublist]
                    return jsonify({"message":"Jobs Fetched","jobs":job}),201
            except Exception as e:
                print(e)
    return jsonify({"error":"0 Results"}),200

@job_bp.get('/location')
def get_all_jobs_by_location():
    querry=request.args.get("location")
    print(querry)
    with connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(CREATE_NEW_JOB)
                cursor.execute(GET_JOB_BY_LOCATION,(querry,))
                jobs=cursor.fetchall()
                jobs= [item for sublist in jobs for item in sublist]
                return jsonify({"message":"Jobs Fetched","jobs":jobs}),201
            except Exception as e:
                print(e)
    return jsonify({"error":"0 Results"}),200

@job_bp.get('/category')
def get_all_jobs_by_category():
    category=request.args.get("category")
    with connection:
        with connection.cursor() as cursor:
            try:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(CREATE_NEW_JOB)
                cursor.execute(GET_JOB_BY_CATEGORY,(category,))
                jobs=cursor.fetchall()
                jobs= [item for sublist in jobs for item in sublist]
                return jsonify({"message":"Jobs Fetched","jobs":jobs}),201
            except Exception as e:
                print(e)
    return jsonify({"error":"0 Results"}),200


@job_bp.get("/all/job_by_wage")
def get_job_between_wage():
    max_price=request.args.get('max_price',type=int)
    min_price=request.args.get('min_price',type=int)
    with connection:
         with connection.cursor() as cursor:
            cursor.execute(CREATE_NEW_COMPANY)
            cursor.execute(CREATE_NEW_JOB)
            cursor.execute(GET_JOB_BY_WAGE_RANGE,(min_price,max_price,))
            jobs=cursor.fetchall()
            jobs= [item for sublist in jobs for item in sublist]
            return jsonify(jobs),201
         
@job_bp.get('/filterLI')
def get_job_by_filterLI():
    location=request.args.get('location')
    company_name=request.args.get('name')
    with connection:
         with connection.cursor() as cursor:
            cursor.execute(CREATE_NEW_COMPANY)
            cursor.execute(CREATE_NEW_JOB)
            cursor.execute(GET_COMPANY_ID_BY_NAME,(company_name,))
            company_id=cursor.fetchone()[0]
            if company_id >0:
                    cursor.execute(GET_JOB_BY_FILTERLI,(location,company_id))
                    jobs=cursor.fetchall()
                    jobs= [item for sublist in jobs for item in sublist]
                    return jsonify({"message":"Jobs Fetched","jobs":jobs}),201
@job_bp.get('/filterLC')
def get_job_by_filterLC():
    location=request.args.get('location')
    category=request.args.get('category')
    with connection:
         with connection.cursor() as cursor:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(CREATE_NEW_JOB)
                cursor.execute(GET_JOB_BY_FILTERLC,(location,category))
                jobs=cursor.fetchall()
                jobs= [item for sublist in jobs for item in sublist]
                return jsonify({"message":"Jobs Fetched","jobs":jobs}),201
@job_bp.get('/filterIC')
def get_job_by_filterIC():
    category=request.args.get('category')
    company_name=request.args.get('name')
    with connection:
         with connection.cursor() as cursor:
            cursor.execute(CREATE_NEW_COMPANY)
            cursor.execute(CREATE_NEW_JOB)
            cursor.execute(GET_COMPANY_ID_BY_NAME,(company_name,))
            company_id=cursor.fetchone()[0]
            if company_id >0:
                    cursor.execute(GET_JOB_BY_FILTERIC,(category,company_id))
                    jobs=cursor.fetchall()
                    jobs= [item for sublist in jobs for item in sublist]
                    return jsonify({"message":"Jobs Fetched","jobs":jobs}),201
@job_bp.get('/filter')
def get_job_by_filter():
    location=request.args.get('location')
    category=request.args.get('category')
    company_name=request.args.get('name')
    with connection:
         with connection.cursor() as cursor:
            cursor.execute(CREATE_NEW_COMPANY)
            cursor.execute(CREATE_NEW_JOB)
            cursor.execute(GET_COMPANY_ID_BY_NAME,(company_name,))
            company_id=cursor.fetchone()[0]
            if company_id >0:
                    cursor.execute(GET_JOB_BY_FILTER,(location,category,company_id))
                    jobs=cursor.fetchall()
                    jobs= [item for sublist in jobs for item in sublist]
                    return jsonify({"message":"Jobs Fetched","jobs":jobs}),201

        
@job_bp.get('/get_job')
def get_job():
    job_id=request.args.get('job_id')
    print(job_id)
    try:
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(CREATE_NEW_COMPANY)
                cursor.execute(CREATE_NEW_JOB)
                cursor.execute(GET_JOB_BY_JOB_ID,(job_id,))
                data=cursor.fetchall()
                data= [item for sublist in data for item in sublist]
                return jsonify({"message":"Jobs Fetched","jobs":data}),201
    except Exception as e:
        print(e)
    return jsonify({"message":"Cannot find job!!"}),200

@job_bp.put("/apply")
@jwt_required()
def apply_task():
    user_email=get_jwt_identity()
    job_id=request.args.get('job_id')
    print(user_email)
    print(job_id)
    try:
        with connection:
            with connection.cursor() as cursor:
                # cursor.execute(GET_USER_WITH_JOB_ID,(user_email,))
                user_id=cursor.fetchone()[0]
                print(user_id)
                cursor.execute(UPDATE_JOB_WITH_USER,(user_id,job_id,))
                cursor.execute(UPDATE_USER_WITH_JOB,(job_id,user_id,))
                cursor.execute()
                return jsonify({"result": "user with user id:"+str(user_id)+ "applied to job:"+str(job_id)}),201
            
    except Exception as e:
        print(e)
    return jsonify({"message":"Failed to apply"}),200


if __name__ == '__main__':
    init_db()