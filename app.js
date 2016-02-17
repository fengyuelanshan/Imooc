var express = require('express')
var path = require('path')
var port = process.env.PORT || 1024
var app = express()

var bodyParser = require('body-parser')//express4

var Movie = require('./models/movie.js')
var _ = require('underscore')

var mongoose = require('mongoose');    //引用mongoose模块

mongoose.connect('mongodb://localhost/Imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
//app.use(express.bodyParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))//express4
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)
app.locals.moment = require('moment')

console.log('imooc started on port' + port)

// index page
app.get('/', function(req,res){
	Movie.fetch(function(err,movies) {
		if (err){
			console.log(err)
		}

		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		})
	})
})

// list page
app.get('/admin/list', function(req,res){
	Movie.fetch(function(err,movies) {
		if (err){
			console.log(err)
		}

		res.render('list',{
			title: 'imooc 列表页',
			movies: movies
		})
	})
})

// detail page
app.get('/movie/:id', function(req,res){
	var id = req.params.id

	Movie.findById(id, function(err,movie){
		if (err){
			console.log(err)
		}

		res.render('detail',{
			title: 'imooc ' + movie.title,
			movie: movie
		})
	})
})

// admin page
app.get('/admin/movie', function(req,res){
	res.render('admin',{
		title: 'imooc 后台录入页',
		movie: {
			doctor: '',
			country: '',
			title: '',
			year: '',
			poster: '',
			language: '',
			flash: '',
			summary: ''
		}
	})
})

//admin update movie
app.get('/admin/update/:id', function(req,res){
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}

			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			})
		})
	}
})

//admin post movie
app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if (id != 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if (err){
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			flash: movieObj.flash,
			summary: movieObj.summary
		})

		_movie.save(function(err, movie) {
			if (err){
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})

//list delete movie
app.delete('/admin/list', function(req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err){
				console.log(err)
			}
			else {
				res.json({success: 1})
			}
		})
	}
})