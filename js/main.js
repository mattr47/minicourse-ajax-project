
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NYTimes AJAX Request
    var nytAPIkey = 'api-key=a8ac3803dae94f0aa25a83468d6ae4cd';
    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=' + cityStr + '&sort=newest&fl=web_url,headline,snippet&' + nytAPIkey;
    $.getJSON(nytUrl, function (data) {
      $nytHeaderElem.text('New York Times Articles About ' + cityStr);
      var articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
      };
    }).error(function(e) {
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Wikipedia AJAX Request
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.text("Failed to get wikipedia resources.");
    }, 4000);

    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp',
      success: function (response) {
        var articleList = response[1];

        for (var i = 0; i < articleList.length; i++) {
          var articleStr = articleList[i];
          var url = response[3][i];
          /* Alternate method for URL
          / var url =  'https://en.wikipedia.org/wiki/' + articleStr;
          */
          $wikiElem.append('<li><a href="' + url + '" target="_blank">' + articleStr + '</a></li>');
        };
        clearTimeout(wikiRequestTimeout);
      }
    });

    return false;
};

$('#form-container').submit(loadData);
