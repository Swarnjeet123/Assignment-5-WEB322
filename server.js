/*********************************************************************************WEB322 – Assignment 05 I declare that this assignment is my own work in 
 * accordance with Seneca Academic Policy. No part of this* assignment has been copied manually or electronically from any other source (including web sites) or 
* distributed to other students.
* 
* Name:SWARNJEET KAUR ______________________ Student ID: 139963201______________ Date: 23 March 2022
*
* Online (Heroku) Link: 
________________________________________________________
*
********************************************************************************/


const reqie = require("require");
const app1 = reqie();
const express = require("express");
const app = express();
const multer = require("multer")
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const HTTP_PORT = process.env.PORT || 8080;
const exphbs = require('express-handlebars');
cloudinary.config({
 cloud_name: 'Cloud Name',
 api_key: 'API Key',
 api_secret: 'API Secret',
 secure: true
 });
 app.get("/posts/:id", function(req,res) {
        if (isNaN(req.params.id)) {
        
        res.redirect("/posts");    
    } else {
        service.getPostById(req.params.id)
        .then(function(value) {
            res.render('posts', {post: value});
        })
        .catch(function(err) {
            res.render('post', {message: "no results"});
        });
    }
});
app.get("/categories/:id", function(req,res) {
        if (isNaN(req.params.id)) {
        
        res.redirect("/categories");    
    } else {
        service.getCategoryById(req.params.id)
        .then(function(value) {
            res.render('categories', {category: value});
        })
        .catch(function(err) {
            res.render('category', {message: "no results"});
        });
    }
});

app.set('view engine', '.hbs');

 const upload = multer();
 app.post('/posts/add', fileUpload.single("featureImage"), function (req, res) {
 res.redirect('/images');
	} );
	 let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

       streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
         
        navLink: function(url, options) {
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    } 
}));


app.use(function(req,res,next){       
let route = req.path.substring(1);       
app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.)/, "") : route.replace(/\/(.)/, ""));       app.locals.viewingCategory = req.query.category;       next();   });

app.get("/about", function(req,res) {
       res.render('about');
});
app.get("/", function(req,res) {
     
    res.render('addPost');
});


async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
	 return result

}
upload(req).then((uploaded) => {
 req.body.featureImage = uploaded.url
upload(req);
});
 
app.get("/views", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
});
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.send("<h1>Welcome to my simple website</h1><p>Be sure to visit the <a href='/headers'>headers page</a> to see what headers were sent from your browser to the server!</p>");
});

app.get("/headers", (req, res) => {
  const headers = req.headers;
  res.send(headers);
});
app.get('/blog', async (req, res) => {

    let viewData = {};

    try{

        
        let posts = [];

         
        if(req.query.category){
            
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
             
            posts = await blogData.getPublishedPosts();
        }

        
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

         
        let post = posts[0]; 

        
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        
        let categories = await blogData.getCategories();

         
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

     
    res.render("blog", {data: viewData})

});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
app.get("/post/delete/:postid", ensureLogin, (req, res) => {
  console.log("-deletePostById called");  
  dataService.deletePostById(req.params.postid)
    .then((data) => {
      console.log("-deletePostById resolved");  
      res.redirect("/post"); 
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Post / Post Not Found");
      console.log(err);
      console.log("-deletePostByNum rejected");  
    });
});

app.listen(HTTP_PORT, onHttpStart);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get("/posts/add", ensureLogin, (req, res) => {
  console.log("-addPost called"); 
  dataService.getCategories()
    .then((data) => {
      console.log("-addPost resolved"); 
      res.render("addPost", { category: data });
    })
    .catch((err) => {
      res.render("addPost", { category: [] });
      console.log(err);
      console.log("-addPost rejected"); 
    });
});




app.get("/category", ensureLogin, (req, res) => {
  console.log("-getCategories called");  
  dataService.getCategories()
    .then((data) => {
      console.log("-getCategories resolved");  
      res.render("categoryList", { data: data, title: "Categories" });
    })
    .catch((err) => {
      res.render("categoriesList", { data: {}, title: "Categories" });
      console.log(err);
      console.log("-getCategories rejected");  
    });
});

app.get("/post/delete/:categoryid", ensureLogin, (req, res) => {
  console.log("-deleteCategoryById called");  
  dataService.deleteCategoryById(req.params.categoryid)
    .then((data) => {
      console.log("deleteCategoryById resolved");  
      res.redirect("/post"); 
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Category / Category Not Found");
      console.log(err);
      console.log("deleteCategoryByNum rejected");  
    });
});