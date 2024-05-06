from flask import Blueprint, jsonify, session, request
import random
from time import time

api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')
def compose(sample):
    question = {}
    if session['question_number'] >= 6:
        question['result'] = True
        question['time'] = time() - session['start_time']
        question['total'] = session['question_number']
        question['total_correct'] = session['correct_answers']
        question['msg'] = 'Тест успешно пройден!'
    else:
        question['result'] = False
        question_type = random.choice(['multiple', 'single', 'text'])
        question['type'] = question_type
        letter_types = ['low', 'middle', 'high']
        match question_type:
            case 'multiple':
                question['tip'] = 'Несколько вариантов ответа'
                question['obj'] = random.choice(letter_types)
                question['msg'] = f'Выберите буквы класса {question['obj']}'
                question['options'] = random.sample(list(sample.keys()), random.choice([4, 6]))
            case 'single':
                question['tip'] = 'Один вариант ответа'
                question['obj'] = random.choice(list(sample.keys()))
                question['msg'] = f'{question['obj']}\nК какому классу принадлежит?'
                question['options'] = letter_types
            case 'text':
                question['tip'] = 'Текстовый ответ'
                question['obj'] = random.choice(letter_types)
                question['msg'] = f'Впишите 3 буквы класса {question['obj']} через пробел'
                question['options'] = {}

        session['curr_question'] = question
        question['number'] = session['question_number']+1

    return question

def verify(sample, data):
    response = {
        'options': {
            'correct': [],
            'wrong': []
        },
        'is_correct': False,
        'type': session['curr_question']['type']
    }
    if session['curr_question']['type'] == 'text':
        answer = data['answer']
        letters_list = answer.split(' ')
        if len(set(letters_list)) < 3:
            response['is_correct'] = False
        count = 0
        for letter in letters_list:
            if letter in sample.keys() and sample[letter] == session['curr_question']['obj']:
                count += 1
        if count == 3:
            response['is_correct'] = True
        response['options'] = {}

    elif session['curr_question']['type'] == 'multiple':
        for letter in data.keys():
            if sample[letter] != session['curr_question']['obj'] and data[letter] == 'true':
                response['options']['wrong'].append(letter)
            elif sample[letter] == session['curr_question']['obj']:
                response['options']['correct'].append(letter)
        response['is_correct'] = True
        for letter in response['options']['correct']:
            if data[letter] == 'false':
                response['is_correct'] = False
            if len(response['options']['wrong']) > 0:
                response['is_correct'] = False
    elif session['curr_question']['type'] == 'single':
        for type in data.keys():
            if sample[session['curr_question']['obj']] != type and data[type] == 'true':
                response['options']['wrong'] = type
            elif sample[session['curr_question']['obj']] == type:
                response['options']['correct'] = type
            response['is_correct'] = True
            if len(response['options']['wrong']) > 0:
                response['is_correct'] = False
    if response['is_correct']:
        session['correct_answers'] += 1
    session['question_number'] += 1
    return response


sample = {
    'a': 'middle', 
    'b': 'low', 
    'c': 'high',
    'd': 'middle',
    'e': 'low',
    'f': 'high',
    'g': 'middle',
    'h': 'middle',
    'i': 'low',
    'r': 'high',
    'k': 'middle',
}


@api_v1.route('/question', methods=['GET', 'POST'])
def question_data():
    if request.method == 'GET':
        data = compose(sample)
        return jsonify(**data)
    elif request.method == 'POST':
        data = verify(sample, dict(request.form))
        return jsonify(**data)