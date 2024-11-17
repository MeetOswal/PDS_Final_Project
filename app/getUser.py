from flask import Blueprint, jsonify, session
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError

user = Blueprint('user', __name__)

@user.route('/api/profile', methods = ['GET'])
def get_profile():
    try:
        username = session['username']
        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
            
        with connection.cursor() as cursor:
            query = '''
            select *
            from person natural join personphone
            where person.userName = %s
            '''
            cursor.execute(query, (username))
            result = cursor.fetchall()

        connection.close()
        if not result:
            return jsonify({"message" : "User not loged in"}), 200
        else:
            response = {
                "username" : result[0]["userName"],
                "fname" : result[0]['fname'],
                "laname" : result[0]['lname'],
                "email" : result[0]['email'],
                "phone" : []
            }
            for idx, i in enumerate(result):
                response['phone'].append({
                    idx : i['phone']
                })
            
        return jsonify(response), 200
    
    except datababaseError as e:
        return jsonify({'error': str(e)}), 500
    
    except KeyError as e:
        return jsonify({'error': 'User not found'}), 500
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500
