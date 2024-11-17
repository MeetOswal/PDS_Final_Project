from flask import Blueprint, jsonify, session, request
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
from itertools import groupby
import base64

CategoryFilter = Blueprint('categoryFilter', __name__)

@CategoryFilter.route('/api/getcategory', methods = ['GET'])
def getCategory():
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
            select mainCategory, subCategory
            from Category
            order by mainCategory, subCategory
            '''
            cursor.execute(query)
            result = cursor.fetchall()

        connection.close()

        category_data = {
            'categories' : []
        }
        for key, group in groupby(result, key = lambda x: x['mainCategory']):
            category_data['categories'].append({
                'category' : key,
                'sub_category': [{idx: i['subCategory']} for idx, i in enumerate(group)]
            })

        return jsonify(category_data), 200

    except datababaseError as e:
        return jsonify({'error' : str(e)}), 500
    
    except KeyError as e:
        return jsonify({'error' : 'User not Found'}),404
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500
    
    

@CategoryFilter.route('/api/category', methods = ['GET'])
def categoryFilter():
    try:
        username = session['username']
        category = request.args['category']
        sub_category = request.args['sub_category']

        category = category.split('&')
        if sub_category:
            sub_category = sub_category.split('&')
        else:
            sub_category = []

        if len(category) < 1:
            return jsonify({'message' : 'no category selected'}), 200

        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        
        with connection.cursor() as cursor:
            query = '''
            select *
            from item
            where (mainCategory = %s
            '''
            for _ in range(1, len(category)):
                query += ''' or mainCategory = %s'''
            query += ')'

            if len(sub_category) > 0:
                query += ' and ( subCategory = %s'
                for _ in range(1, len(sub_category)):
                    query += ''' or subCategory = %s'''
                query += ')'

            cursor.execute(query, tuple(category + sub_category))
            result = cursor.fetchall()
        
        connection.close()

        if not result:
            return jsonify({"message" : "No Item Found"}), 200

        for item in result:
            item['photo'] = base64.b64encode(item['photo']).decode('utf-8') 
        return jsonify(result), 200
    
    except datababaseError as e:
        return jsonify({'error' : str(e)}), 500
    
    except KeyError as e:
        return jsonify({'error' : 'User not Found'}),404
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500

