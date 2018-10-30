//	Załączanie	modułów
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.route('/posts')
    .get(function (req, res) {
        Post.find({}, function (err, posts) {
            if (err)
                return res.send(err);
            return res.json({'posts': posts});
        });
    })
    .post(function (req, res) {
        post = new Post();
        post.created_by = req.body.created_by;
        post.text = req.body.text;
        post.save(function (err, post) {
            if (err)
                res.send(err);
            res.json(post);
        });
    })
    .delete(function (req, res) {
    })
    .put(function (req, res) {
    });

router.route('/posts/:id')
    .get(function (req, res) {
        Post.findById(req.params.id, function (err, post) {
            if (err)
                return res.send(err);
            return res.json({'posts': post});
        });
    });
/*

    .delete(function (req, res) {
        Post.remove({_id: req.params.id}, function (err) {
            if (err)
                return res.send(err);
            return res.json({'status': 'success'});
        })
    });
*/

module.exports = router;