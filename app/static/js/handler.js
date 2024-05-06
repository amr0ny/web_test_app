function handleFormSubmit(event) {
    event.preventDefault();
    data = serilizeForm(form);
    $.ajax({
        type: "POST", 
        url: "/api/v1/question",
        data: data,
        processData: false,
        contentType: false,
        dataType: 'JSON',
        success: (data) => {
            $("#js-indicator").empty().removeClass('catchy-highlight');
            console.log(data);
            $("#js-indicator").addClass(data.is_correct ? 'message-box__catchy-title_correct' : 'message-box__catchy-title_wrong');
            $("#js-progress").children().last()
                .removeClass('info-progress__question_neutral')
                .addClass(data.is_correct ? 'info-progress__question_correct' : 'info-progress__question_wrong');
            $("#js-submit-button").prop('disabled', true);
            updateAnswers(data.type, data.options, data.is_correct);
            setTimeout(()=>{
                $("#js-indicator").empty().removeClass(data.is_correct ? 'message-box__catchy-title_correct' : 'message-box__catchy-title_wrong');
                setTimer(1).then(() => {
                    loadForm()
                })
            }, 1000)
        },
        error: (data) => {
            console.error(`Error: ${data}`);
        }
    });
}

function updateProgress() {
    length = $('#js-progress').children().length
    startPos = 7;
    offset = 14;
    var questionItem = $('<div>').addClass('info-progress__question info-progress__question_neutral')
    .css('left', `${startPos + (length)*offset}px`);
    $('#js-progress').append(questionItem)
}

async function setTimer(duration) {
    var svgElement = $('<svg id="js-progress-bar" class="progress-bar" viewBox="0 0 42 42"><circle class="progress-bar__inner-circle" cx="21" cy="21" r="15.91549430918954" stroke-dasharray="100 0" stroke-dashoffset="100"></circle><circle class="progress-bar__outer-circle" cx="21" cy="21" r="15.91549430918954" stroke-dasharray="0 100" stroke-dashoffset="0"></circle></svg>');
    $('#js-indicator').append(svgElement)
    return startTimer(duration)
}


function updateAnswers(type, options, is_correct) {
    if (type == "text") {
        $('#js-text-input').addClass(is_correct ? 'option-item__text-input_correct' : 'option-item__text-input_wrong').prop('disabled', true);
    }
    else if (type == "single") {
        if (options.correct != []) {
            $(`.option-item[for="${$(`.radio-input[value="${options.correct}"]`).attr('id')}"]`).addClass('options-list__option-item_correct');
        }
        if (options.wrong != []) {
            $(`.option-item[for="${$(`.radio-input[value="${options.wrong}"]`).attr('id')}"]`).addClass('options-list__option-item_wrong');
        }
        $('.radio-input').css({
            'display': 'none'
        }).prop('disabled', true);
    }
    else if (type == "multiple" ) {
        for (let option of options.correct) {
            $(`.option-item[for="${$(`.checkbox-input[value="${option}"]`).attr('id')}"]`).addClass('options-list__option-item_correct');
        }
        for (let option of options.wrong) {
            $(`.option-item[for="${$(`.checkbox-input[value="${option}"]`).attr('id')}"]`).addClass('options-list__option-item_wrong');
        }
        $('.checkbox-input').css({
            'display': 'none'
        }).prop('disabled', true);
    }
}

function serilizeForm(formNode) {
    var { elements } = formNode
    var data = new FormData()
    Array.from(elements)
        .filter((item) => !!item.name)
        .forEach((element) => {
        var { name, type, value, checked } = element;
        var name_ = type === 'checkbox' || type === 'radio' ? value : name;
        var value_ = type === 'checkbox' || type === 'radio' ? checked : value;
        data.append(name_, value_);
        });
    return data;
}

function updateQuestion(type, options) {
    if (type == 'single') {
        var elements = [];
        for (let i = 0; i < options.length; i++) {
            id = `radio-${i}`
            var element = $("<label>").addClass("field-box option-item options-list__option-item").attr({
                "for": id
            });
            var left = $("<div>").addClass("field-box__left option-item__left");
            var left_text = $("<div>").addClass("field-box__text text text_xs");
            left_text.text(i+1);
            left.append(left_text);
            var center = $("<div>").addClass("field-box__center option-item__center");
            var center_text = $("<div>").addClass("field-box__text text text_m");
            center_text.text(options[i]);
            center.append(center_text);
            var right = $("<div>").addClass("field-box__right option-item__right");
            var radioInput = $("<input>").addClass("option-item__radio-input radio-input").attr({
                "type": "radio",
                "id": id,
                "name": "option",
                "value": options[i]
            });
            right.append(radioInput);
            element.append([left, center, right]);
            elements.push(element);
        }
        $("#js-container").append(elements)
        $("#js-container").attr("data-count", elements.length)
    }
    else if (type == 'multiple') {
        var elements = [];
        for(let i = 0; i < options.length; i++) {
            id = `checkbox-${i}`
            var element = $("<label>").addClass("field-box option-item options-list__option-item").attr({
                "for": id
            });
            var left = $("<div>").addClass("field-box__left option-item__left");
            var left_text = $("<div>").addClass("field-box__text text text_xs");
            left_text.text(i+1);
            left.append(left_text);
            var center = $("<div>").addClass("field-box__center option-item__center");
            var center_text = $("<div>").addClass("field-box__text text text_m");
            center_text.text(options[i]);
            center.append(center_text);
            var right = $("<div>").addClass("field-box__right option-item__right");
            var checkboxInput = $("<input>").addClass("option-item__checkbox-input checkbox-input").attr({
                "type": "checkbox",
                "id": id,
                "name": "option",
                "value": options[i]
            });
            right.append(checkboxInput);
            element.append([left, center, right]);
            elements.push(element);
        }
        $("#js-container").append(elements)
        $("#js-container").attr("data-count", elements.length)
    }

    else if (type == 'text') {
        var element = $("<div>").addClass("field-box option-item options-list__option-item");
        var innerWrapper = $("<div>").addClass("field-box__inner-wrapper");
        var inputText = $("<input>").addClass("text-input option-item__text-input text text_m").attr({
            "type": "text",
            "name": "answer",
            "id": "js-text-input"
        });
        innerWrapper.append(inputText);
        element.append(innerWrapper);
        $("#js-container").append(element);
        $("#js-container").attr("data-count", 1);
    }
}

function clear() {
    $('#js-container').empty()
    $('#js-submit-button').prop('disabled', false)
}

function loadForm(event) {
    $.ajax({
        url: "/api/v1/question",
        type: "GET",
        dataType: "JSON",
        success: (data) => {
            clear()
            if (data.result) {
                $("#js-indicator").empty()
                $("#js-submit-button").prop('disabled', true)
                $("#js-number").text('Результат');
                $("#js-question-container").addClass("content-box__question-box_result")
                $("#js-message").text(data.msg);
                $("#js-tip").text(`Время, потраченное на тест: ${Math.round(data.time/60)}мин. ${Math.round(data.time%60)}сек.`);
                updateResultChart(data.total, data.total_correct);
                
            }
            else {
                $("#js-message").text(data.msg);
                $("#js-tip").text(data.tip);
                $("#js-indicator").text(data.number);
                $("#js-number").text(`Вопрос ${data.number}`);
                $("#js-indicator").addClass("catchy-highlight");
                updateQuestion(data.type, data.options);
                updateProgress();
            }
        },
        error: (data) => {
            console.error(data)
        }
    });
}

function updateResultChart(total, correct) {
    console.log(correct, total);
    chart = $('<div>').addClass('chart message-box__chart')
    .attr('id', 'js-result-chart')
    .css('--value', `${Math.round((correct/total)*100)}`);
    console.log(chart)
    $("#js-indicator").append(chart)
}

function checkValidity() {
    console.log('Hi')
    var fields = $("input[type='checkbox'], input[type='radio'], input[type='text']").serializeArray();
    var isNull = false
    fields.forEach((field) => {
        if (field.value == '') {
            isNull = true
        }
    });
    console.log(isNull)
    if (fields.length > 0 && !isNull) {
        return true
    }
    else {
        showValidityModal()
    }
}

async function startTimer(duration) {
    return new Promise((resolve, reject) => {
        $("#js-progress-bar  .progress-bar__text").text(duration)
        $("#js-progress-bar  .progress-bar__text")
        var timeout = setTimeout(function () {
            var time = duration;
            var i = 1;
            var k = ((i / duration) * 100);
            var l = 100 - k;
            i++;
            $("#js-progress-bar .progress-bar__inner-circle").css({
                strokeDasharray: l + "," + k,
                strokeDashoffset: l
            });
            $("#js-progress-bar .progress-bar__outer-circle").css({
                strokeDasharray: k + "," + l
            });
            $("#counterText").text(duration);
            var interval = setInterval(function () {
                if (i > time) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    resolve();
                    return;
                }
                k = ((i / duration) * 100);
                l = 100 - k;
                $("#js-progress-bar .progress-bar__inner-circle").css({
                    strokeDasharray: l + "," + k,
                    strokeDashoffset: l
                });
                $("#js-progress-bar .progress-bar__outer-circle").css({
                    strokeDasharray: k + "," + l
                });
                $("#js-progress-bar  .progress-bar__text").text((duration + 1) - i);
                i++;
            }, 1000);
        }, 0);
    });
}

function showValidityModal() {
    $("#js-validity-modal-box").addClass("modal-box__active");
    setTimeout(() => {
        $("#js-validity-modal-box").removeClass("modal-box__active");
    }, 650);
}

$(document).ready(() => {
    $('#form').submit((event) => {
        event.preventDefault()
        if(checkValidity()) {
            handleFormSubmit(event);
        }
    });
    loadForm();
});
