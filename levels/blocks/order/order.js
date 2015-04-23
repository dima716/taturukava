/* Показываем уменьшенный блок с корзиной по скроллу окна */
$(window).scroll(function() {
  var orderInfoBox = $('.order'),
  scrollTop = $(this).scrollTop();

if ( scrollTop <= 0 ) {  // возвращаем в исходное состояние, если достигли вверха страницы.
  orderInfoBox.removeClass('order_size_sm');
  return;
}

orderInfoBox.addClass('order_size_sm');

}); // меняем отображение корзины при скролле


function renderCartBox (totalSum, totalAmount) {
  var status = $('.order__status');
  if(totalAmount) {
    status.html(totalAmount + ' товаров на ' + totalSum + ' рублей');
  } else {
    status.html('Ваша корзина пуста');
  }
}

module.exports = {
  renderCartBox: renderCartBox
}
