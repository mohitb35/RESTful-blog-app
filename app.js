const express = require('express');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSanitizer = require('express-sanitizer');

mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });

// Letting Express know that we're serving up ejs templates by default.
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

// Routes
app.get("/", (req, res) => {
	res.redirect("/blogs");
})

// Index Route
app.get("/blogs", (req, res) => {
	Blog.find({}, (err, allBlogs) => {
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: allBlogs});
		}		
	});
})

// New Route
app.get("/blogs/new", (req, res) => {
	res.render("new");
})

// Create Route
app.post("/blogs", (req, res) => {
	// create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err) {
			console.log(err);
			res.render("new");
		} else {
			// redirect to index
			res.redirect("/blogs");
		}
	}); 
})


// Show Route 
app.get("/blogs/:id", (req, res) => {
	// Fetch blog info by Id
	Blog.findById(req.params.id, (err, fetchedBlog) => {
		if(err || !fetchedBlog) {
			console.log("Error");
			res.redirect("/blogs");
		} else {
			// Render the show page with the fetched blog info
			console.log(fetchedBlog);
			res.render("show", {blog: fetchedBlog});
		}
	});
})

// Edit Route
app.get("/blogs/:id/edit", (req, res) => {
	Blog.findById(req.params.id, (err, fetchedBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			// Render the show page with the fetched blog info
			res.render("edit", {blog: fetchedBlog});
		}
	})
})

// Update Route - need method override
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// create blog
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if(err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			// redirect to index
			res.redirect("/blogs/" + req.params.id);
		}
	});
})

// Destroy Route
app.delete("/blogs/:id", (req, res) => {
	Blog.findByIdAndDelete(req.params.id, (err) => {
		if(err) {
			console.log(err);
			res.redirect("/blogs/" + req.params.id);
		} else {
			res.redirect("/blogs");
		}
	});
})

let port = process.env.port || 3001;
app.listen(port, () => {
	console.log("Started the blog app server");
})

