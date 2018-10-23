//cwierkaczApp.js
var	app	=	angular.module('cwierkaczApp',	[]);
app.controller('mainController',	function(){
});

app.controller('mainController',	function($scope){
		$scope.posts	=	[];	//	wszystkie	wpisy
		$scope.newPost	=	{created_by:	'',	text:	'',	created_at:	''};	//	dane	formularza
		$scope.post	=	function(){
				$scope.newPost.created_at	=	Date.now();	//	data	utworzenia
				$scope.posts.push($scope.newPost);	//	dodaj	wpis	do	widoku
				$scope.newPost	=	{created_by:	'',	text:	'',	created_at:	''};	//	czyść	formularz
		};
});