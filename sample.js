// parses http://news.ycombinator.com and writes out interesting info
// Usage:  crawlcl http://news.ycombinator.com ".title a" sample.js
if(node.href.substring(0,3) != "/x?"){ // remove the "More" link
    console.log("Title: " + $(node).text());
    console.log("HREF: " + node.href);
    // Ugly but it works
    var score = $(node).parent().parent().next().find('span');
    console.log("Score: " + score.text());
    console.log("Author: " + score.next().text());
}
