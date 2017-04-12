function genereate_blogs(github_repo, div){
	
	fluid_div = '<div class ="container-fluid">';
	fluid_div = fluid_div +  '<div class="row">'
	fluid_div = fluid_div +  '<div class="col-sm-3 col-md-2 sidebar" id="nav-menu">'
	fluid_div = fluid_div +  '<ul class="nav nav-sidebar" ></ul>'
	fluid_div = fluid_div +  '</div>'
	fluid_div = fluid_div +  '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" >'
	fluid_div = fluid_div +  '<div id="blog_content"></div>'
	fluid_div = fluid_div +  '</div>'
	fluid_div = fluid_div +  '</div>'
    fluid_div = fluid_div +  '</div>'
	
	div.append(fluid_div);
	
	var oauth = "client_id=c45417c5d6249959a91d&client_secret=3630a057d4ebbbdbfc84f855376f3f46f58b9710";
	
	//get all md file
	makeCorsRequest("https://api.github.com/search/code?&q=filename:md+repo:" + github_repo + "&" + oauth, function(data){
		md_files = JSON.parse(data);
		//crate the sidebar
		for(i in md_files["items"] )
		{
			var item =  md_files["items"][i];
			console.log(item);
			var name = item["name"];
			name = name.substring(0, name.length - 3);
			if(item["path"] != "README.md"){
				href = item["url"];
				$("#nav-menu ul").append('<li><a href="' +  href + '">' + name + '</a></li>');
			
			makeCorsRequest("https://api.github.com/repos/" + github_repo + "/commits?" + "path=" + item["path"] + "&" + oauth, function(data, name){
  				   commits = JSON.parse(data);
				   console.log(commits);
				   console.log(name);
				   var last_update_date = commits[0].commit.committer.date
				   console.log(last_update_date)
				   $("#blog_content").append('<div class="blog_news"'+ 'last_update="'  + last_update_date +  '">' + name  + " : " + last_update_date + '</div>');
 				   var orderedDivs = $('.blog_news').sort(function(a, b) {
						var x = new Date(a.getAttribute("last_update"));
						var y = new Date(b.getAttribute("last_update"));
						return y-x;
					});
					$("#blog_content").empty().append(orderedDivs);
			}, name);
			
			}

		}
		
		
		
		//when the menu of sidebar clicked
		$("#nav-menu ul li").click(function(event){
			event.preventDefault();
			var href = $(this).find("a").attr("href");
			$("#nav-menu ul li").toggleClass("active", false);
			$(this).toggleClass("active", true);
			//get the file matedata
			makeCorsRequest(href + "&" + oauth, 
				function(data){
					file = JSON.parse(data);
					file_raw_url = file["download_url"];
					//download the raw data
					makeCorsRequest(file_raw_url + "?" + oauth, 
						function(data){
							var converter = new showdown.Converter();
							x = converter.makeHtml(data);
							$("#blog_content").empty();
							$("#blog_content").append(x);
						} );
				});	
		});
				
	});//makeCorsRequest, get all md
  
}//function genereate_blogs

 

