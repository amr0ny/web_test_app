from flask import Blueprint, session, render_template
from uuid import uuid4
from time import time

tests = Blueprint('tests', __name__, url_prefix="/tests")

@tests.route('/1', methods=['GET'])
def test_1():
    session['id'] = uuid4()
    session['start_time'] = time()
    session['question_number'] = 0
    session['correct_answers'] = 0
    return render_template('test_templates/test_template.html')
