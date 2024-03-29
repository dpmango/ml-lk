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

## 1 .Общие положения

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

filter = 1 (список для онлайн/офлайн и вкл/выкл рассылки)
filter = 2 (список для рассылка приглашений)
filter = 3 (список для фильтра в блоке «Уведомления»)
filter = 4 (список для фильтра в блоке «Контакт-лист»)

Подгрузка новых данных реализуем так:
Возвращается максимум 21 запись.
Показываем 20 первых и фиксируем ID двадцатой.
Если записей 21 – включаем подгрузку новых данных, если меньше – данных больше нет и подгрузка не нужна.
При запросе передаем ID двадцатой записи через параметр «last_id»

### Вывести девушку в онлайн

POST https://api-m.marmeladies.com/v1/ladies/online
Принимает
ladies – список ID девушек (через запятую)

### Вывести девушку в офлайн

POST https://api-m.marmeladies.com/v1/ladies/offline
Принимает
ladies – список ID девушек (через запятую)

### Включить рассылку

POST https://api-m.marmeladies.com/v1/ladies/oninvitations
Принимает
ladies – список ID девушек (через запятую)

### Выключить рассылку

POST https://api-m.marmeladies.com/v1/ladies/offinvitations
Принимает
ladies – список ID девушек (через запятую)

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

### Удаление переводчика

DELETE [translators/123456](translators/123456)
где 123456 – ID переводчика
Принимает
reason – причина удаления (обязательно)

### Загрузка файла

POST [translators/files](translators/files)
Принимает
file – файл (&#39;jpg&#39;, &#39;jpeg&#39;, &#39;gif&#39;, &#39;png&#39;)
Возвращает
{&quot;success&quot;:true, &quot;File&quot;:xxxxxx, &quot;Url&quot;:&quot;yyyyyy&quot;}, где xxxxxx – имя загруженного файла, Url – адрес файла

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

### Удалить девушку у переводчика

DELETE [translators/123456/ladies](translators/123456/ladies)

где 123456 – ID переводчика
Принимает
ladies – список ID девушек (через запятую)

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

### + Прочитать

GET https://api-m.marmeladies.com/v1/contacts/123456/read
где 123456 – ID контакта

### + Отметить

GET https://api-m.marmeladies.com/v1/contacts/123456/mark
где 123456 – ID контакта

### + Снять отметку

GET https://api-m.marmeladies.com/v1/contacts/123456/unmark
где 123456 – ID контакта

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

### + Прочитать

GET https://api-m.marmeladies.com/v1/notifications/123456/read
где 123456 – ID уведомления

### + Отметить

GET https://api-m.marmeladies.com/v1/notifications/123456/mark
где 123456 – ID уведомления

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

### - Обновление комментариев

cors
POST https://api-m.marmeladies.com/v1/chats/comments
Принимает
man – ID мужчины
lady – ID девушки
text – текст
Для комментариев о паре передаем man, lady и text, для комментариев о мужчине передаем только man и text, для комментариев о девушки передаем только lady и text

### - Написать сообщение в чат

500 error
message":"Undefined index: chat_attachments_1","code":8

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

### - Загрузка фото

ошибька please select lady
POST https://api-m.marmeladies.com/v1/chats/photos
Принимает
man – ID мужчины
lady – ID девушки
file – файл
Возвращает
{"success":true, "ID":xxxxxx, "Url_1":xxxxxx, "Url_2":xxxxxx}, где xxxxxx – ID загруженного фото, Url_1 – адрес превью, Url_2 – адрес самого фото

### + Список фото

GET https://api-m.marmeladies.com/v1/chats/photos
Принимает
man – ID мужчины
lady – ID девушки
Фильтрация на фронтенде (SendDate/ ReadDate)

### + Отметить сообщение

GET https://api-m.marmeladies.com/v1/chats/39260171/mark
где 39260171 – ID Message

### + Снять отметку

GET https://api-m.marmeladies.com/v1/chats/39260171/unmark
где 39260171 – ID Message

### + Завершить чат

GET https://api-m.marmeladies.com/v1/chats/finish
Принимает
man – ID мужчины
lady – ID девушки

### + Отправить typing_notification (не чаще чем раз в 10 сек)

GET https://api-m.marmeladies.com/v1/chats/typing
Принимает
man – ID мужчины
lady – ID девушки

## 7. + Избранное

Добавить
POST https://api-m.marmeladies.com/v1/favorites
Принимает
man – ID мужчины
lady – ID девушки

### + Удалить

DELETE https://api-m.marmeladies.com/v1/favorites
Принимает
man – ID мужчины
lady – ID девушки

## 8. Блоклист

### + Добавить

POST https://api-m.marmeladies.com/v1/blocklists
Принимает
man – ID мужчины
lady – ID девушки

### + Удалить

DELETE https://api-m.marmeladies.com/v1/blocklists
Принимает
man – ID мужчины
lady – ID девушки

## 9. Подмигивания

### + Отправить

POST https://api-m.marmeladies.com/v1/kisses
Принимает
man – ID мужчины
lady – ID девушки

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

### Отправить приглашение

POST https://api-m.marmeladies.com/v1/chats/sendinvitations
Принимает
lady – ID девушки
men – список ID мужчин (через запятую)
text - текст

1. Нажимаем на кнопку "Отправить приглашение" - загружается и отображается список девушек
2. Выбираем девушку - загружается и отображается список мужчин
3. По клику на соответствующую иконку можно открыть фильтр.
4. Выбрали мужчин, написали текст и нажали на отправить - выводим сообщение "Отправлено х приглашений".
5. Загружаем следующую порцию мужчин. Текст в поле остается.
6. Если при отправке пришла ошибка - выводим ее текст, новых мужчин не грузим.

## x. Чат сокет (WAMP)

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

четвертым в массиве приходит текст
это или текст сообщения или тип сервисного сообщения
если это не сервисное сообщение последним в массиве приходит id сообщения
дальше вызываем
Конкретный Chat Messages
GET https://api-m.marmeladies.com/v1/chats/messages/39260171
где 39260171 – ID Message
Вызывать при получении нового сообщения по WebSocket.
типы сервисных сообщений описаны в документе "чат"
апи вернет id в контакт листе
если элемент с таким id есть в списке поднимаем его вверх и обновляем текст и время последнего сообщения
если открыт не этот контакт либо добавляем иконку "одно новое сообщение в чате", либо если такая иконка уже есть увеличиваем количество новых сообщений
если контакта с таким id нет в списке то добавляем его вверх списка

если текст = chat_page_open_notification то это уведомление
вызываем апи
Конкретное уведомление
GET https://api-m.marmeladies.com/v1/notifications/39260171
где 39260171 – ID уведомления
Вызывать при получении нового сообщения по WebSocket.
id придет по вебсокету предпоследним в массиве
если уведомление с таким id есть в списке поднимаем его наверх
и отмечаем как новое если открыта не эта пара
если уведомления с таким id нет в списке то добавляем его вверх
и отмечаем как новое если открыта не эта пара
