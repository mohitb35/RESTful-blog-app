const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });

// Letting Express know that we're serving up ejs templates by default.
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// DB Schema set up
let blogSchema = mongoose.Schema({
	title: String,
	image_url: String,
	body: String,
	created_date: {type: Date, default: Date.now} //default date if not set
});

// DB Model setup
let Blog = mongoose.model("Blog", blogSchema);

/* Blog.create({
	title: "First Blog",
	image_url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
	body: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi, ducimus consequatur incidunt dolore quae ipsam harum fuga nisi voluptatibus odio voluptates magnam dignissimos voluptate aliquid, architecto tenetur quia temporibus exercitationem.",
}) */

app.get("/", (req, res) => {
	res.redirect("/blogs");
})

app.get("/blogs", (req, res) => {
	Blog.find({}, (err, allBlogs) => {
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: allBlogs});
		}		
	})
})

app.get("/blogs/new", (req, res) => {
	res.render("new");
})

app.post("/blogs", (req, res) => {
	// create blog
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err) {
			console.log(err);
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	}); 
	// redirect to index
})

let port = process.env.port || 3001;
app.listen(port, () => {
	console.log("Started the blog app server");
})

