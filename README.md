# ml-lk

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Lints and fixes files

```
yarn run lint
```

## API DOCS

TOKEN BqxKJPW-BrOQA3YbNwp54gFaNcpnO9Iv
TOKEN BqxKJPW-BrOQA3YbNwp54gFaNcpnO9I

**1.Общие положения**
Формат ответа по умолчанию – json
Для изменения формата ответа на xml необходимо при запросе отправить заголовок
Accept:application/xml
Аутентификация для всех страниц кроме логина и регистрации через заголовок «Authorization»:
Authorization: Bearer хххххххххххххххххххх
где «хххххххххххххххххххх» - токен, полученный при логине

## 2. Девушки

### Список

GET [ladies](ladies)
Фильтр
id – ID
nick – ник
name – фамилия
status – статус ([&#39;1&#39; =\&gt; Активна, &#39;2&#39; =\&gt; На проверке, &#39;3&#39; =\&gt; Отклонена, &#39;4&#39; =\&gt; Удалена])
free = 1 – не прикреплена к переводчику
translator – ID переводчика

Подгрузка новых данных реализуем так:
Возвращается максимум 21 запись.
Показываем 20 первых и фиксируем ID двадцатой.
Если записей 21 – включаем подгрузку новых данных, если меньше – данных больше нет и подгрузка не нужна.
При запросе передаем ID двадцатой записи через параметр «last_id»

## 3. Переводчики

### Список

GET[translators](translators)
Фильтр
deleted – Не показывать удаленных: 0, Удаленные: 1
blocked – Не показывать заблокированных: 0, Заблокированные: 1
sort_name - столбец сортировки - name/count
sort_type – тип сортировки - asc/ desc

### Переводчик

GET [translators/123456](translators/123456)
где 123456 – ID переводчика

### Создать переводчика

POST [translators](translators)

Принимает
login – логин (обязательно)
fname – имя (обязательно)
lname – фамилия (обязательно)
phone - телефон
passport – номер и серия паспорта
email – емейл (обязательно)
skype - скайп
password – пароль (обязательно)
bank - реквизиты
notes – комментарии
file – имя загруженного файла
price_1… price_7 – фин.показатели
Возвращает
[{&quot;success&quot;:true}]
или
[{&quot;success&quot;:false,&quot;message&quot;:&quot;Emailaddress \&quot;test@test.com\&quot; usedbyanothermember&quot;}]

### Редактирование переводчика

PATCH/PUT [translators/123456](translators/123456)

где 123456 – ID переводчика
type – тип изменения
type = &#39;update&#39; – редактирование
Принимает
login – логин (обязательно)
fname – имя (обязательно)
lname – фамилия (обязательно)
phone - телефон
passport – номер и серия паспорта
email – емейл (обязательно)
skype - скайп
password – пароль (обязательно)
bank - реквизиты
notes – комментарии
file – имя загруженного файла или «delete» для удаления
price_1… price_7 – фин.показатели
type = &#39;block&#39; – блокировка
Принимает
reason – причина блокировки (обязательно)
type = &#39;unblock&#39; – снятие блокировки
type = &#39;restore&#39; – восстановление после удаления
Возвращает
[{&quot;success&quot;:true}]
или
[{&quot;success&quot;:false,&quot;message&quot;:&quot;Emailaddress \&quot;test@test.com\&quot; usedbyanothermember&quot;}]

### Удаление переводчика

DELETE [translators/123456](translators/123456)
где 123456 – ID переводчика
Принимает
reason – причина удаления (обязательно)
Возвращает
[{&quot;success&quot;:true}]
или
[{&quot;success&quot;:false,&quot;message&quot;:&quot;Emailaddress \&quot;test@test.com\&quot; usedbyanothermember&quot;}]

### Загрузка файла

POST [translators/files](translators/files)
Принимает
file – файл (&#39;jpg&#39;, &#39;jpeg&#39;, &#39;gif&#39;, &#39;png&#39;)
Возвращает
{&quot;success&quot;:true, &quot;File&quot;:xxxxxx, &quot;Url&quot;:&quot;yyyyyy&quot;}, где xxxxxx – имя загруженного файла, Url – адрес файла
или
{&quot;success&quot;:false,&quot;message&quot;:&quot;Emailaddress \&quot;test@test.com\&quot; usedbyanothermember&quot;}

### Удалить файл (не отправленный)

DELETE [translators/files](translators/files)
Принимает
file – имя загруженного файла

### Список девушек переводчика

GET [translators/123456/ladies](translators/123456/ladies)
где 123456 – ID переводчика
Подгрузка новых данных аналогично списку девушек.

### Прикрепить девушек к переводчику

POST [translators/123456/ladies](translators/123456/ladies)

где 123456 – ID переводчика
Принимает
ladies – список ID девушек (через запятую)
Возвращает
[{&quot;success&quot;:true}]
или
[{&quot;success&quot;:false,&quot;message&quot;:&quot;Email address \&quot;test@test.com\&quot; used by another member&quot;}]

### Удалить девушку у переводчика

DELETE [translators/123456/ladies](translators/123456/ladies)

где 123456 – ID переводчика
Принимает
ladies – список ID девушек (через запятую)
Возвращает
[{&quot;success&quot;:true}]
или
[{&quot;success&quot;:false,&quot;message&quot;:&quot;Email address \&quot;test@test.com\&quot; used by another member&quot;}]

## 4. Контакт-лист

### + Список

GET https://api-m.marmeladies.com/v1/contacts
Принимает
filter – 1:Активный чат; 2:Неотвеченные; 3:Отмеченные; 4:Мужчина онлайн
ladies – список ID девушек (через запятую)

### Пагинация

GET https://api-m.marmeladies.com/v1/contacts?page=2
Контроль пагинации через заголовки X-Pagination-Total-Count, X-Pagination-Page-Count, X-Pagination-Current-Page, X-Pagination-Per-Page

### + Удалить

DELETE https://api-m.marmeladies.com/v1/contacts/123456
где 123456 – ID контакта
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### + Прочитать

cors
GET https://api-m.marmeladies.com/v1/contacts/123456/read
где 123456 – ID контакта
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### + Отметить

cors
GET https://api-m.marmeladies.com/v1/contacts/123456/mark
где 123456 – ID контакта
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### + Снять отметку

cors
GET https://api-m.marmeladies.com/v1/contacts/123456/unmark
где 123456 – ID контакта
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

## 5. Уведомления

### + Список

- не работает filter=1
- не работает совмещение фильтра, например filter=2,3
  GET https://api-m.marmeladies.com/v1/notifications
  Принимает
  filter – 1: Отмеченные; 2:Новые; 3:Мужчина онлайн
  ladies – список ID девушек (через запятую)

### Пагинация

GET https://api-m.marmeladies.com/v1/notifications?page=2
Контроль пагинации через заголовки X-Pagination-Total-Count, X-Pagination-Page-Count, X-Pagination-Current-Page, X-Pagination-Per-Page

### + Удалить

DELETE https://api-m.marmeladies.com/v1/notifications/123456
где 123456 – ID уведомления
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### + Прочитать

GET https://api-m.marmeladies.com/v1/notifications/123456/read
где 123456 – ID уведомления
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### + Отметить

GET https://api-m.marmeladies.com/v1/notifications/123456/mark
где 123456 – ID уведомления
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### + Снять отметку

GET https://api-m.marmeladies.com/v1/notifications/123456/unmark
где 123456 – ID уведомления
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

## 6. Чаты

### + Информация о паре

GET https://api-m.marmeladies.com/v1/chats/info
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
информацию о мужчине и девушке

- Favorite=true – мужчина в избранном, в попапе «More» показываем ссылку «Удалить из Избранного»
- Favorite=false – мужчина не в избранном, в попапе «More» показываем ссылку «Добавить в Избранное»
- Blocked=true – мужчина в блоклисте, в попапе «More» показываем ссылку «Разблокировать»
- Blocked=false – мужчина не в блоклисте, в попапе «More» показываем ссылку «Заблокировать»
- Chat_enable=true – чат доступен, показываем поле для ввода текста и кнопки(смайлики, картинки, отправить …)
- Chat_enable= false – чат не доступен, не показываем поле для ввода текста и кнопки(смайлики, картинки, отправить …), на их месте выводим текст из Chat_reason.

### + Список сообщений в паре

GET https://api-m.marmeladies.com/v1/chats
Принимает
man – ID мужчины
lady – ID девушки
filter – 1: Отмеченные; 2:Фотографии; 3:За период (дополнительно нужно передать date_1 и date_2 – начало и конец периода, timestamp)
Подгрузка новых данных аналогично списку девушек (21 запись).
При выводе заменять смайлики на картинки

### Обновление комментариев

POST https://api-m.marmeladies.com/v1/chats/comments
Принимает
man – ID мужчины
lady – ID девушки
text – текст
Для комментариев о паре передаем man, lady и text, для комментариев о мужчине передаем только man и text, для комментариев о девушки передаем только lady и text
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### Написать сообщение в чат

POST https://api-m.marmeladies.com/v1/chats
Принимает
man – ID мужчины
lady – ID девушки
text - текст
file – ID фото (необязательное)
Возвращает
{"success":true, "ID":xxxxxx}, где xxxxxx – ID сообщения
или
{"success":false,"message":"Email address \"test@test.com\" used by another member"}

### Загрузка фото

POST https://api-m.marmeladies.com/v1/chats/photos
Принимает
man – ID мужчины
lady – ID девушки
file – файл
Возвращает
{"success":true, "ID":xxxxxx, "Url_1":xxxxxx, "Url_2":xxxxxx}, где xxxxxx – ID загруженного фото, Url_1 – адрес превью, Url_2 – адрес самого фото
или
{"success":false,"message":"Email address \"test@test.com\" used by another member"}

### Список фото

GET https://api-m.marmeladies.com/v1/chats/photos
Принимает
man – ID мужчины
lady – ID девушки
Фильтрация на фронтенде (SendDate/ ReadDate)

### Завершить чат

GET https://api-m.marmeladies.com/v1/chats/finish
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]

### Отправить typing_notification (не чаще чем раз в 10 сек)

GET https://api-m.marmeladies.com/v1/chats/typing
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]

## 7. Избранное

Добавить
POST https://api-m.marmeladies.com/v1/favorites
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### Удалить

DELETE https://api-m.marmeladies.com/v1/favorites
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

## 8. Блоклист

### Добавить

POST https://api-m.marmeladies.com/v1/blocklists
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

### Удалить

DELETE https://api-m.marmeladies.com/v1/blocklists
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

## 9. Подмигивания

### Отправить

POST https://api-m.marmeladies.com/v1/kisses
Принимает
man – ID мужчины
lady – ID девушки
Возвращает
[{"success":true}]
или
[{"success":false,"message":"Email address \"test@test.com\" used by another member"}]

## 10. Мужчины

### Список

GET https://api-m.marmeladies.com/v1/mens
Принимает
filter = 1 (отправить приглашение):
lady – ID девушки
age_1 и age_2 – интервал «Возраст»
height_1 и height_2 – интервал «Рост»
weight_1 и weight_2 – интервал «Вес»
hair – цвет волос (список ID через запятую)
eye – цвет глаз (список ID через запятую)
marital – семейное положение (список ID через запятую)
education – образование (список ID через запятую)
country – страна (список кодов через запятую)
city - город
id – ID мужчины
children – дети – 1:есть;2:нет
photo – фото - 1:есть;2:нет
Подгрузка новых данных аналогично списку девушек (21 запись).

## x. Чат сокет

1. Сервер http://socketo.me/
2. Подключаемся к wss://marmeladies.com/ws/
3. Подписываемся на топик «токен»
4. Парсим полученное сообщение:
   a. from – id отправителя
   b. from_name – имя отправителя
   c. msg – текст
   d. time – время написания сообщения
   e. country – страна отправителя
   f. city – город отправителя
   g. age – возраст отправителя
   h. avatar – фото отправителя
   i. favorite – отправитель в favorites у получателя
   j. id – id сообщения
5. Типы msg
   a. typing_notification – собеседник вводит текст
   b. chat_finish_1_notification – собеседник закрыл чат, выводим сообщение «from_name have left the conversation»
   c. chat_finish_2_notification – автоматическое закрытие чата, выводим сообщение «from_name missed your invite. Please try again. A lot of other ladies are online and available to Chat Now (ссылка на девушек онлайн)»
   d. chat_finish_5_notification – автоматическое закрытие чата, выводим сообщение «You have left the conversation. To resume chat please send another message»,
   e. chat_start_notification – старт чата, показываем кнопки «finish_chat» и «attach»
   f. delete_chat_message – удаляем сообщение id из ленты
   g. chat_page_open_notification – у мужчин не обрабатываем
   h. иначе – текст сообщение, выводим в чат, если открыт экран чата с отправителем или в уведомления
