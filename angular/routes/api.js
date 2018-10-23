var	express	=	require('express');
var	router	=	express.Router();
router.route('/posts')
	.get( function(req,res) {
	 	return res.json({'posts':[]});
	})
	.post(function(req,res){})
	.delete(function(req,res){})
	.put(function(req,res){});

module.exports = router;