mkdir db
mongod --dbpath db --smallfiles













curl	-X	POST	-H	'Content-Type:	application/json;	\
		charset=UTF-8'	-i	'http://127.0.0.1:3000/api/posts'	\
		--data	'{"created_by":	"Jarek",	"text":	"hello"}'

