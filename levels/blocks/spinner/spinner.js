/* Обновляем спиннеры на витрине, при изменении значений спиннеров в корзине */
function spinnersUpdate (newVal, productAlias) {
  var spinner = $('.products__area').find('.ui-spinner-input[data="'+productAlias+'"]');
  spinner.val(newVal);
}

module.exports = {
  spinnersUpdate: spinnersUpdate
}
