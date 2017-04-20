[TOC]

##GitHub Pages
Github Pages is a GitHub feature that supporting genearte a site for one github project.
https://pages.github.com/

##The Goal for publish a blog with git repository.
I want to write my blog with markdown file, and then publish it on my site.
My goal is I could pubish a blog with below steps, then I can see it on my site.
```
vim MY-BLOG.md
git add MY-BLOG.md
git commit MY-BLOG.md -m "COMMITS FOR THIS BLOG"
git push
```

##Comopse your website

###Query all markdown file of a git repostiry
https://developer.github.com/v3/search/#search-code
example, got all *.md file of repository octocat/hello-worId
```
curl -X GET https://api.github.com/search/code?q=filename:md+repo:octocat/hello-worId
```

###Retrieve markdown file raw data
Because there is a rate limiting, 
https://developer.github.com/v3/#rate-limiting
Retrieve the file raw data via raw.githubusercontent.com
```
curl -X GET  https://raw.githubusercontent.com/octocat/hello-worId/master/README.md
```

