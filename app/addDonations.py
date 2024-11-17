from flask import Blueprint, jsonify, session, request
from app.utils import get_db_connection
from pymysql import MySQLError as datababaseError
from datetime import datetime
import json

addDonation = Blueprint('add_donation', __name__)

@addDonation.route('/api/check/supervisor', methods = ['GET'])
def SupervisorAuth():
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
            from act
            where username = %s
            and roleID = 'Supervisor'
            '''
            cursor.execute(query, (username))
            result = cursor.fetchone()
        connection.close()
        if result:
            return jsonify({'message' : 'OK'}), 200
        else:
            return jsonify({'error': 'Supervisor not found'}), 401
    except datababaseError as e:
        return jsonify({'error': str(e)}), 500
    except KeyError as e:
        return jsonify({'error': 'User not found'}), 500
    except Exception as e:
        return jsonify({'error' : str(e)}), 500

@addDonation.route('/api/check/donator/<username>', methods = ['GET'])
def donatorAuth(username):
    try:
        supervisorname = session['username']
        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        with connection.cursor() as cursor:
            query = '''
            select *
            from act
            where username = %s
            and roleID = 'Donator'
            '''
            cursor.execute(query, (username))
            result = cursor.fetchone()
        connection.close()
        if result:
            return jsonify({'message' : 'OK'}), 200
        else:
            return jsonify({'error': 'Donator not found'}), 401
        
    except datababaseError as e:
        return jsonify({'error': str(e)}), 500
    
    except KeyError as e:
        return jsonify({'error': 'User not found'}), 500
    
    except Exception as e:
        return jsonify({'error' : str(e)}), 500

@addDonation.route('/api/donate/', methods = ['POST'])
def addDonation_function():
    try:
        supervisorname = session['username']

        donor = request.form.get('donor')

        item = request.form.get('iDescription')
        color = request.form.get('color')
        isNew = bool(int(request.form.get('isNew')))
        hasPieces = bool(int(request.form.get('hasPieces')))
        material = request.form.get('material')
        mainCategory = request.form.get('mainCategory')
        subCatrgory = request.form.get('subCategory')
        
        photo = request.files.get('photo')
        photo_binary = photo.read()

        pieces = request.form.get('pieces')
        pieces = json.loads(pieces)

        donateDate = datetime.strptime(request.form.get('donateDate'), '%Y-%m-%d').date()

        connection = get_db_connection()
        if not connection:
            response = {
                "database error": "Cannot Connect to Database"
            }
            return jsonify(response), 500
        
        with connection.cursor() as cursor:
            query = '''
            insert into Item (iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory) values
            (%s, %s, %s, %s, %s, %s, %s, %s)
            '''
            cursor.execute(query, (item, photo_binary, color, isNew, hasPieces, material, mainCategory, subCatrgory))
            connection.commit()
            
            last_item_id = cursor.lastrowid
            print(last_item_id)
            query2 = '''
            insert into DonatedBy (ItemID, userName, donateDate) values
            (%s, %s, %s)
            '''
            cursor.execute(query2, (last_item_id, donor, donateDate))
            connection.commit()
            
            query3 = '''
            insert into Piece (ItemID, pieceNum, pDescription, length, width, height, roomNum, shelfNum, pNotes) values
            (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            '''
            for piece in pieces:
                cursor.execute(query3, (last_item_id, int(piece['pieceNum']), piece['pDescription'], int(piece['length']), int(piece['width']), int(piece['height']), int(piece['roomNum']), int(piece['shelfNum']), piece['pNotes']))
                connection.commit()

        connection.close()

        return jsonify({'message' : 'item donation created'}) ,200
    
    except datababaseError as e:
        return jsonify({' Database error' : str(e)}), 500
    except KeyError as e:
        return jsonify({'error' : 'User not Found'}), 500
    except Exception as e:
        return jsonify({'Server error' : str(e)}), 500