var numberOfProductsFun = require('../products/products').numberOfProductsFun;
    renderOrder = require('../products/products').renderOrder;

/* Инициализирует хэлперы в шаблонизаторе */
Handlebars.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  }
});

$('.order__button').on('click', showPopUp);
$('.popup').on('click', '.popup__close', hidePopUp);
$('.popup__form').on('submit', submitForm);
$('.popup__form').on('keydown', 'input', removeError);

/* Показываем окно заказа */
function showPopUp (e) {
  e.preventDefault();
  if (numberOfProductsFun()) { //если корзина не пуста, выводим форму

    $('.alert').hide();
    renderOrder();

    $.magnificPopup.open({
      items: {
        src: '.popup',
        type: 'inline',
        midClick: true,
        removalDelay: 300,
        mainClass: 'mfp-fade'
      }
    });

  // возвращаем все в исходное состояние
  $('.popup__success-message').remove();
  $('.popup__order-info').show();
  $('.popup__client-info').show();
  $('.popup').find('button[type="submit"]').show();

  } else { // иначе выводим сообщение
    $('.alert').show();
  }
}

/* Прячем окно заказа */
function hidePopUp (e) {
  e.preventDefault();
  $.magnificPopup.close();
}

/* Сабмит формы */
function submitForm (e) {
  e.preventDefault();
  var form = $(this),
  submitButton = form.find('button[type="submit"]'),
  name = form.find('#form-name').val(),
  phone = form.find('#form-phone').val(),
  email = form.find('#form-mail').val(),
  totalSum = form.find('#total-sum').val(),
  goodsToSend = [],
  data = {};

  /* Удаляем сообщение об ошибке, если пользователь повторно нажал сабмит
   * при уже имеющихся сообщениях об ошибках
   */
  var errorMessages = form.find('.popup__error-message');
  if(errorMessages) {
      errorMessages.remove();
  }

  if( validateForm(form) === false) {return false;}
  submitButton.attr('disabled', 'disabled');

  /* Формируем массив товаров, находящихся в коризне */
  $.each(window.order.goods, function(index, value){
      if( value.amount !== 0) {
          goodsToSend.push(value);
      }
  });

  /* Формируем объект данных, посылаемый серверу через ajax */
  data = {
      'goods': goodsToSend,
      'total': totalSum,
      'name': name,
      'phone': phone,
      'email': email
  };

  $.ajax({
      url: 'server/mail.php',
      type: 'POST',
      data: data
  })
  .done(function(msg) {
      if(msg === 'OK') {
          var result = '<div class="popup__success-message">' +
          'Большое спасибо! <br>'+
          'С вами свяжутся в ближайшее время!</div>';

          $('.popup__order-info').hide();
          $('.popup__client-info').hide();
          submitButton.hide();
          form.prepend(result);
      }
      else {
          $('.popup__client-info').after(msg);
      }
  })
  .always(function() {
      submitButton.removeAttr('disabled');
  });
}

/* Валидация формы */
function validateForm (form) {
    var inputs = form.find('input'),
        valid = true;

    /* Проверка, если пользователь ничего не ввел */
    $.each(inputs, function(index, val) {
        var input = $(val),
        value = input.val();

        if(value.length === 0) {
           input.addClass('popup__error');
           var errMessage = '<div class="popup__error-message">'+
           'Введите ' + input.attr('placeholder').toLowerCase() + '</div>';
           input.after(errMessage);
           valid = false;
       }
   });

    /* Проверка на валидность телефонного номера с помощью RegExp */
    var phone = form.find('#form-phone'),
        value = phone.val();

    if(!/^[0-9]*$/.test(value)) {
        var errorMessage = '<div class="popup__error-message">'+
        'Введен некорректный номер! Повторите ввод</div>';
        phone.addClass('popup__error');
        phone.after(errorMessage);
        valid = false;
    }

    return valid;
}

/* Удаление ошибок, возникающих при неправильном вводе */
function removeError () {
  var form = $(this).parents('.popup__client-info'),
  inputs = form.find('input'),
  errorMessages = form.find('.popup__error-message');

  inputs.removeClass('popup__error');

  if(errorMessages) {
      errorMessages.remove();
  }
}
