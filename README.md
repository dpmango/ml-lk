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
