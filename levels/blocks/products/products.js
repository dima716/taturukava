var products,
    order,
    renderCartBox = require('order').renderCartBox,
    updateSpinners = require('products__spinner').updateSpinners;

$.ajax({
  url: 'data.json',
  contentType: 'application/json'
}).done(function(data){

products = data; // кэшируем продукты
order = fillOrderObject(); // подготоваливаем объект заказа

var html = fillTemplate('#products-template', products); // заполняем шаблон данными

$('.products__area').append(html); // вставляем данные в DOM

$('.products__spinner').spinner({
  min:0,
  max: 10,
  step: 1,
  start: 0
});

$('.products__spinner').on('spin', changeOrderSpin); // изменяем количество заказанного товара при клилке на спиннер на витрине
$('.products__image, .products__name').on('click', changeOrderImg); // изменяем количество заказанного товара при клилке на изображение товара или его название

}).fail(function(qXHR,textStatus,errorThrown){
  console.log(textStatus);
  console.log(errorThrown);
});

function fillTemplate (sourceId, data) {
  var source = $(sourceId).html(),
  template = Handlebars.compile(source);
  return(template(data));
}

/* Подготавливаем объект заказа */
function fillOrderObject () {
  var goods = [];
  $.each(products.blocks, function(index, value) {
    goods.push({
      'amount': 0,
      'productAlias': value.alias,
      'name': value.name,
      'productPrice': value.price,
      'productSum': 0
    });
  });
  return { 'goods':goods};
}

/* Считаем общее количество товаров в заказе */
function numberOfProductsFun () {
  var amount = 0;

  $.each(order.goods, function(index, value){
    amount += value.amount;
  });

  return amount;
}

/* Считаем итоговую стоимость заказа */
function totalPriceFun () {
  var price = 0;

  $.each(order.goods, function(index, value){
      price += value.productSum;
  });

  return price;
}

/* Наполняем объект заказа order */
function preOrder (amount, productAlias) {
  $.each(order.goods, function(index, value){
    if( value.productAlias === productAlias) {
      value.amount = amount;
      value.productSum = amount*value.productPrice;
    }
  });

  // Пересчитываем общее количество товаров в заказе и итоговую стоимость заказа
  var totalSum = totalPriceFun(),
  totalAmount = numberOfProductsFun();

  // Обновляем состоние корзины, отображаемое на главной странице
  renderCartBox(totalSum, totalAmount);
}

/* Добавление товара в корзину, при изменении значения спиннера */
function changeOrderSpin (event, ui) {
  $('.alert').hide();
  var thisInput = event.currentTarget,
  newVal = ui.value,
  input = $(thisInput),
  productAlias = input.attr('data');

  preOrder(newVal, productAlias);
}

/* Добавление товара в корзину, при клике на изображении или названии товара */
function changeOrderImg (event) {
  $('.alert').hide();

  var element = event.currentTarget,
  input = $(element).parents('.products__item').find('.products__spinner'),
  maxSpinnerValue = input.spinner( "option", "max" ),
  currentVal = input.val(),
  newVal = parseInt(currentVal) + 1,
  productAlias = input.attr('data');

  /* Ограничиваем количество добавляемых товаром максимальным значением спиннера */
  if (newVal > maxSpinnerValue ) { return false;}

  input.val(newVal);
  preOrder(newVal, productAlias);
}

