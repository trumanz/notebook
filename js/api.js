
function covert_collections_to_json(collections_str)
{
	
	var collections = collections_str.split("lable: ");
	console.log(collections);
	var blog_collection = null;
	for(i in collections){
		if( collections[i].indexOf("blog_collection") == 0){
			blog_collection = collections[i];
			 break;
		}
	}
	console.log(blog_collection);
	if(blog_collection == null) return null;
	
	var blogs = [];
	blog_collection = blog_collection.match(/[^\r\n]+/g);
	for(i in blog_collection){
		console.log(blog_collection[i]);
		var  x = blog_collection[i].match(/file:(.*).md/i)
		if(x){
			var name = x[1].split("/").pop();
			console.log(name);
			var blog = {"name" : name, "href" : x[1]+".md"};
			blogs.push(blog);
		}
	}

	console.log(blogs);
    return blogs;	
} 



