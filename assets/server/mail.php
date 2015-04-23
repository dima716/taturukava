<?php


$post = (!empty($_POST)) ? true : false;

if($post)
{

$name =  $_POST['name'];
$phone = $_POST['phone'];
$total = $_POST['total'];
$goods = $_POST['goods'];
$emailClient = $_POST['email'];
$email = 'dima716@yandex.ru';
$tr = '';


foreach ($goods as $item) {
    $tr = $tr . '<tr><td>' . $item['name'] . '</td>' .
    '<td>' . $item['productPrice'] . '</td>' .
    '<td>' . $item['amount'] . '</td>' .
    '<td>' . $item['productSum'] . '</td></tr>';
}

$subject = 'Заявка на рукава';

$message = '
    <html>
        <head>
            <title>Заявка на рукава</title>
            <style>
             td, th{
              border: 1px solid #d4d4d4;
              padding: 5px;
             }
            </style>
        </head>
        <body>
            <h2>Заказ</h2>
            <table>
                <thead>
                    <tr>
                        <th>Название товара</th>
                        <th>Цена (рубли)</th>
                        <th>Количество</th>
                        <th>Сумма по товару</th>
                    </tr>
                </thead>
                <tbody>'
                . $tr .
                '</tbody>
            </table>
            <p>Итого: ' . $total . ' руб.<p>
            <h2>Заказчик</h2>
            <table>
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>' . $name . '</td>
                        <td>' . $phone . '</td>
                        <td>' . $emailClient . '</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>';


$error = '';

if(!$name)
{
$error .= 'Пожалуйста, введите ваше имя.<br />';
}

if(!$phone)
{
$error .= 'Пожалуйста, введите ваш телефон.<br />';
}

if(!$email)
{
$error .= 'Пожалуйста, введите ваш email.<br />';
}


if(!$error)
{
    $mail = mail($email, $subject, $message,
         "From: ".$email." <".$email.">\r\n"
        ."Reply-To: ".$email."\r\n"
        ."Content-type: text/html; charset=utf-8 \r\n"
        ."X-Mailer: PHP/" . phpversion());

if($mail)
{
    echo 'OK';
}

}
else
{
echo '<div class="popup-basket__error-message">'.$error.'</div>';
}

}
?>
