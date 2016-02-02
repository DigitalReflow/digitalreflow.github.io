$(document).ready(function () {
  $('.collapsable-section').each(function () {
    var elem = $(this),
      header = elem.find('> header'),
      body = elem.find('> .par-body, > p');

    header.click(function () {
      body.slideToggle("slow");
      header.toggleClass("active");
    });
  });
});

//trigger the default twitter embed script
! function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    p = /^http:/.test(d.location) ? 'http' : 'https';
  if (!d.getElementById(id)) {
    js = d.createElement(s);
    js.id = id;
    js.src = p + "://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
}(document, "script", "twitter-wjs");

$(document).ready(function () {
  var className = $("[class^=twitterembed]").attr('class');
  if (typeof className != 'undefined') {
    //console.log("Embedding Twitter profile " +className);
    var arr = className.split("-");
    var twitterHandle = arr[1];
    var widgetId = arr[2];
    var html = '<a class="twitter-timeline" href="https://twitter.com/' + twitterHandle + '" data-widget-id="' + widgetId + '">Tweets by @' + twitterHandle + '</a>';
    $("." + className).html(html);
  }
});
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function deleteCookie( cname ) {
    setCookie(cname, "", 0);
//  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
/*
 * This script is made of two parts:
 * 1. checks if the function panel with classname 'cookie-redirect' exists.
 *    This is usually the homepage
 *    If so, the script will try to read a cookie to find the url to redirect to
 * 2. check if the form to set the cookie exists on the page.
 *    Handle and process ticking the checkbox; save a cookie if the box is checked.
 *    Store the url to redirect to in the redirect cookie.
 */
function enableAndHide() {
  //    console.log("checking box, hiding label");
  var cache = $("input[name='make-homepage']").clone();
  if (!$("input[name='make-homepage']").prop("checked")) {
    //page load: might be unchecked but should be checked according to cookie
    $("input[name='make-homepage']").parent().text("This is my homepage").prepend(cache);
    $("input[name='make-homepage']").prop("checked", "true");
  } else {
    //was checked already: Manual checking has been done
    $("input[name='make-homepage']").parent().text("This is my homepage").prepend(cache);
  }
}

function disableAndShow() {
  //    console.log("showing label");
  var cache = $("input[name='make-homepage']").clone();
  $("input[name='make-homepage']").parent().text("Make this my homepage").prepend(cache);
}

$(document).ready(function () {
  //check for redirect if the 'cookie-redirect' function panel is on the homepage
  if ($(".cookie-redirect").length && !$("body").hasClass("edit")) {
    //check if cookies are disabled. Hide component when they are
    if (!navigator.cookieEnabled) {
      return false;
    }
    //retrieve url from cookie
    var url = getCookie("redirect");
    if (url != "") {
      document.location.href = url;
    }
  }

  //move homepage selection to title area
  //only when not in edit mode
  if ($("input[name='make-homepage']").length && !$("body").hasClass("edit")) {
    //check if cookies are disabled. Hide component when they are
    if (!navigator.cookieEnabled) {
      $("input[name='make-homepage']").hide();
      return false;
    }
    //do the actual placing
    $("body>header h1").after($("input[name='make-homepage']").parents("div.check-box-list"));
  }

  //hide the cookie setting text from the page if this page is already set in the cookie. Keep the checkbox though.
  if ($("input[name='make-homepage']").length && getCookie("redirect") == window.location.pathname && !$("body").hasClass("edit")) {
    enableAndHide();
  }

  //if the checkbox is checked, save the cookie
  $("label.checkbox, label.checkbox-inline").on("click", "input[name='make-homepage']", function () {
    if ($(this).prop('checked')) {
      setCookie("redirect", window.location.pathname, 365);
      enableAndHide();
    } else {
      deleteCookie("redirect");
      disableAndShow();
    }
  });
});
/*
 Plugin binds functionality for Middle Menu component
 Creates floating panel that opens onclick
 Reorders list items alphabetically and reformats copy
 */

(function ($) {
  'use strict';

  $.fn.middle_menu = function (options) {

    // Access default settings
    var settings = $.extend({

    }, options);

    // Cache jQuery objects
    var $root = options.$root;
    var middle_menu = {

      // Initialise plugin
      init: function () {

        var self = this;

        // Inject additional markup into each instance of component
        $root.each(function () {

          var $this = $(this);

          //TODO remove JavaScript reformatting once functionality added to component
          /*
           START: This is basically a hack to reorder and format the list items
           to meet business requirements. This code should be removed once
           the functionality is built into the component at a later date
           */
          if ($this.hasClass('column-control-middle-menu')) {

            var $modal = $this.find('.dynamic-content-overlay'),
              $items = $modal.find('h4'),
              itemsArray = []; // Array to store text nodes from list

            // Populate the array with list item text nodes
            for (var i = 0, l = $items.length; i < l; i++) {

              var textNode = $items.eq(i).text(), // Original text node from list item
                splitTextNode = textNode.split('- '), // Remove characters before hyphen (followed by space)
                textNodeCapitalised = self.capitalizeFirstLetter(splitTextNode[splitTextNode.length - 1]); // Capitalise the string's first character

              // Push text node into array
              itemsArray.push(textNodeCapitalised);
            }

            // Sort the array of text nodes alphabetically
            itemsArray.sort();

            // Inject the sorted text nodes back into the list items
            for (var i = 0, l = $items.length; i < l; i++) {
              $items.eq(i).text(itemsArray[i]);
            }

          }
          // END OF HACK

          // Bind onclick event to this instance
          self.onClickEvent($this);

        });

      },

      // Bind events to DOM
      onClickEvent: function ($this) {

        // Toggles drop-down menu
        $this.click(function () {

          // Close all open menu's

          // Toggle modal
          if (!$this.hasClass('active')) {

            $root.removeClass('active');
            $this.addClass("active");

          } else {
            $this.removeClass("active");
          }

        });

      },

      // Capitalises first letter in string
      capitalizeFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    };

    middle_menu.init();
  }

}(jQuery));

jQuery(document).ready(function () {
  'use strict';

  var $components = jQuery('.column-control-middle-menu, .column-control-dropdown-menu, .link-list-middle-menu');

  if ($components.length >= 1) {
    $components.middle_menu({
      $root: $components
    });
  } else {
    return false;
  }
});

function switchAuthorPhoto(authorName, elemHead) {
    if (authorName) {
        var imagesPath = '/content/dam/region-core/uk/pearson-uk/images/authors/';
        $.get(imagesPath + authorName + '.jpg')
            .done(function () {
                elemHead.prepend('<i class="blog-author-photo"><img src="' +imagesPath +authorName +'.jpg"/></i>');
            }).fail(function () {

                $.get(imagesPath + authorName + '.png')
                    .done(function () {
                        elemHead.prepend('<i class="blog-author-photo"><img src="' +imagesPath +authorName + '.png"/></i>');
                    }).fail(function () {})
            })
    }
}

/*
    This function re-orders the markup for blog posts in the blog-list component
*/
function blogListSortText() {

    var blogList = $('.blog-list-flex-layout ul'),
        blogEntry = blogList.find('>li');

    blogEntry.each(function (i, el) {

        var elem = $(el),
            article = elem.find('>article'),
            mainCont = article.find('>div'),
            mainContText = mainCont.html(),
            authorName = elem.find('.blog-list-info span a').text().replace(/\s/g, ''),
            elemHead = article.find('>header');

        if (!(mainCont.find('>a >picture').length > 0)) {

            var image = mainCont.find('img').eq(0),
                imageUrl = image.attr('src'),
                imageAlt = image.attr('alt'),
                link = elemHead.find('h2 >a').attr('href');


            if (image.length > 0) {
                article.append('<a href="' + link + '"><picture><img src="' + imageUrl + '" alt="' + imageAlt + '"></picture></a>');
            }
            mainCont.find('.blog-list-readmore').appendTo(article);
            mainCont.remove();

        } else {
            mainCont.remove();
            article.append(mainContText);
        }

        switchAuthorPhoto(authorName, elemHead);

    });
};

function blogEntryPage() {
    if ($('.blog-flex').length > 0) {
        $('.blog-flex .blog-list-flex-layout').prepend('<div class="blog-flex-column-title"><h3>Latest posts</h3></div>');

        //social share starts here
        $('.blog-flex .blog-post header').append('<div class="blog-flex-social-share"><span>Share this:</span><ul>' +
            '<li class="blog-flex-share-google"><a href="javascript:;">Google+</a></li>' +
            '<li class="blog-flex-share-fb"><a href="javascript:;">Facebook</a></li>' +
            '<li class="blog-flex-share-linkedin"><a href="javascript:;">LinkedIn</a></li>' +
            '<li class="blog-flex-share-twitter"><a href="javascript:;">Twitter</a></li>' +
            '</ul></div>');

        var settings = {
            description: $('head title').text(),
            emailAddress: undefined,
            emailBody: undefined,
            emailSubject: undefined,
            image: undefined,
            title: $('head title').text(),
            url: window.location.href
        }

        var encodeString = function (string) {
            // Recursively decode string first to ensure we aren't double encoding.
            if (string !== undefined && string !== null) {
                if (string.match(/%[0-9a-f]{2}/i) !== null) {
                    string = decodeURIComponent(string);
                    encodeString(string);
                } else {
                    return encodeURIComponent(string);
                }
            }
        };

        // Return the encoded strings if the settings have been changed.
        for (var key in settings) {
            if (settings.hasOwnProperty(key) && settings[key] !== undefined) {
                settings[key] = encodeString(settings[key]);
            }
        };

        $('.blog-flex-share-google a').attr('href', 'https://plus.google.com/share?url=' + (settings.description !== undefined ? settings.description : '') + '%20' + settings.url);

        $('.blog-flex-share-fb a').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + settings.url);

        $('.blog-flex-share-linkedin a').attr('href', 'http://www.linkedin.com/shareArticle?mini=true&url=' + settings.url + (settings.title !== undefined ? '&title=' + settings.title : '') + (settings.description !== undefined ? '&summary=' + settings.description : ''));

        $('.blog-flex-share-twitter a').attr('href', 'https://twitter.com/intent/tweet?text=' + (settings.description !== undefined ? settings.description : '') + '%20' + settings.url);

        var popupCenter = function (url, title, w, h) {
            // Fixes dual-screen position                         Most browsers      Firefox
            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 3) - (h / 3)) + dualScreenTop;

            var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }
        };

        $(document).on('click', '.blog-flex-social-share a', {}, function popUp(e) {
            var self = $(this);
            popupCenter(self.attr('href'), self.find('.share-title').html(), 580, 470);
            e.preventDefault();
        });

        //get author's image
        var authorName = $('.blog-post-info span a').text().replace(/\s/g, ''),
            elemHead = $('.blog-post-info');

        switchAuthorPhoto(authorName, elemHead);

    }
}

/*function blogContributors() {
    if ($('.blog-contributors-list').length > 0) {

        var firstAuthor = $(".blog-contributor").eq(0);

        function updateDetailAuthor(elem) {
            var contributorContent = elem.html();
            $('.blog-contributor-selected').html(contributorContent);

            if ($('.blog-contributor').css('float') == 'left') {
                if ($(window).scrollTop() > 140) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, "slow");
                }
            }
        }

        updateDetailAuthor(firstAuthor);

        $('.blog-contributor').click(function () {
            updateDetailAuthor($(this));
        })
    }
}*/


$(document).ready(function () {
    blogListSortText();
    blogEntryPage();
    //blogContributors();
});


// RSS feed

function output(post) {
  //strip HTML tags from description
  var div = document.createElement("div");
  div.innerHTML = post.contentSnippet;
  var description = div.textContent || div.innerText || "";
  this.$divPost = $("<div class='rss-feed-post'></div>");
  this.$divPost.append("<div class='rss-feed__meta'>" + post.publishedDate + "</div>");
  target = "";
  if (post.link.substring(0, 4) == "http") {
    target = "target=\"_blank\""; //external links
  }
  this.$divPost.append("<h4 class='rss-feed__title'><a class='rss-feed__link' href=\"" + post.link + "\"" + target + ">" + post.title + "</a></h4>");
  $(".rss-feed").append(this.$divPost);
}

var months = new Array(12);
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";

$(document).ready(function () {
  'use strict';

  if ($(".rss-feed").length) {
    var parameters = $(".rss-feed").attr('class').split(' '),
      rssurl = parameters[1],
      nrOfArticles = parameters[2],
      articleOffset = parameters[3];

    //INTERNAL FEED
    if (rssurl.substring(0, 4) !== "http") {
      $.get(rssurl, function (data) {

        var articles = $(data).find("item"),
          reversedSet = $(articles).get().reverse(),
          counter = 0;

        $(reversedSet).slice(articleOffset).each(function () {
          if (++counter > nrOfArticles) {
            return false;
          }

          var text = "",
            $this = $(this),
            publishedDate = new Date($this.find("pubDate").text()),
            publishedDay = publishedDate.getDate(),
            publishedMonth = publishedDate.getMonth(),
            publishedYear = publishedDate.getFullYear(),
            post = {
              title: $this.find("title").text(),
              link: $this.find("link").text(),
              publishedDate: publishedDay + " " + months[publishedMonth] + ", " + publishedYear,
              author: $this.find("author").text()
            };
          output(post);
        });
      });
    } else {
      //EXTERNAL FEED
      var $parseRSS = function (paramsObj) {
        var base = "https://ajax.googleapis.com/ajax/services/feed/load",
          params = "?v=1.0&num=" + paramsObj.count + "&callback=?&q=" + paramsObj.url,
          url = base + params;
        $.ajax({
          url: url,
          dataType: "json",
          success: function (data) {
            paramsObj.callback(data.responseData.feed.entries);
          }
        });
      };

      $parseRSS({
        url: rssurl,
        count: nrOfArticles,
        callback: function (posts) {
          $.each(posts, function (index, post) {
            var postFormat = post.publishedDate;
            postFormat = postFormat.replace(/[0-9][0-9]:00:00 -.*$/, "");
            post.publishedDate = postFormat;
            output(post);
          });
        }
      });
    }
  }
});
/**
 * Show document-like links in the link list component
 */

/**
 * helper function: method to retrieve the remote file size
 */
function generateSize(element) {
  //console.log("href: " +$(element).attr("href"));
  fileUrl = $(element).attr("href");
  if (fileUrl.substring(0, 4) == "http") {
    return 0;
  } else {
    var request;
    request = $.ajax({
      type: "HEAD",
      url: fileUrl,
      success: function () {
        //console.log(fileUrl +" - " + humanize(request.getResponseHeader("Content-Length")));
        $(".filesize", $(element)).before(" | ");
        $(".filesize", $(element)).html(humanize(request.getResponseHeader("Content-Length")));
      }
    });
  }
}

/**
 * helper function: translate size in bytes into readable form
 */
function humanize(size) {
  var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var ord = Math.floor(Math.log(size) / Math.log(1024));
  ord = Math.min(Math.max(0, ord), units.length - 1);
  var s = Math.round((size / Math.pow(1024, ord)) * 100) / 100;
  return s + ' ' + units[ord];
}

/**
 * the script
 */
$(document).ready(function () {
  //check for redirect if the 'cookie-redirect' function panel is on the page
  if ($(".document-list.link-list").length) {
    //define which extensions belong to which icon
    var iconPath = "/etc/clientlibs/region-core/uk/pearson-uk/images/filetypes/";

    //iterate through all the links in the link list
    $(".document-list.link-list").find("a").each(function () {
      var extension = "";
      var icon = "";
      var filename = "";
      var title = $(this).attr("title"); //link list does not yet support titles
      var url = $(this).attr("href");

      filename = url.match(/.*\/([^/]+)\.([^?]+)/i)[1];
      extension = url.match(/.*\/([^/]+)\.([^?]+)/i)[2].toUpperCase();

      $extension = $("<span class=\"extension\">" + extension + "</span>");
      $fileSize = $("<span class=\"filesize\"></span>");
      $descriptor = $("<span>").append($extension).append($fileSize);
      $descriptor.append(")").prepend(" (");
      //build the new descriptor element tree inside the link
      $(this).append($descriptor);

      //generate the filesize and place inside descriptor
      size = generateSize(this);
    });
  }
});

$(document).ready(function () {
  'use strict';
  // open all external links in a new window/tab
  $("a[href^='http']").attr("target", "_blank");

  // add unique class to remember homepage checkbox
  $("input[name='make-homepage']").closest('fieldset').addClass("remember-my-selection");
});

$(function () {
  'use strict';

  // Modal plugin
  $.fn.extend({
    funkyModal: function () {

      var $closeButtonHTML = '<a href="#" class="modal-close">&#x2715;</a>',
        $overlayHTML = '<div class="modal-overlay"></div>',
        $openClass = 'modal-open',
        $overlaySelector = '.modal-overlay',
        $closeButtonSelector = '.modal-close';

      // Append modal overlay
      $("body").append($overlayHTML);

      // Function to close modal
      function closeModal(modal_id) {
        $($overlaySelector).fadeOut(200);
        $(modal_id).removeClass($openClass);
      }

      // Open modal
      return this.each(function () {
        $(this).click(function (e) {
          var modal_id = $(this).attr('href');

          $($overlaySelector).fadeIn(200);
          $(modal_id).append($closeButtonHTML);
          $(modal_id).addClass($openClass);
          e.preventDefault();

          $('body').on('click', '' + $overlaySelector + ', ' + $closeButtonSelector + '', function () {
            closeModal(modal_id);
          });
        });
      });
    }
  });
});


$(document).ready(function () {
  'use strict';

  var $modal_link = $('a[href*=modal-]');

  if ($modal_link.length) {
    $($modal_link).funkyModal();
  }
});
$(document).ready(function () {
  var className = $("[class^=facebookEmbed]").attr('class');
  if (typeof className != 'undefined') {
    $("body").prepend("<div id='fb-root'></div>");

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    var arr = className.split("-");
    var fbHandle = arr[1];
    var html = '<div class="fb-page" data-href="https://www.facebook.com/' + fbHandle + '/" data-width="500" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true" data-show-posts="true"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/' + fbHandle + '/"><a href="https://www.facebook.com/' + fbHandle + '/">Facebook</a></blockquote></div></div>';
    $("." + className).html(html);
  }
});

$(document).on('click', '.child-page-list h4 a', function(e) {
  e.preventDefault();
  $(this).parents('.child-page-list').toggleClass('open');
});

// Hack to add custom dropdown feature until PMC platform is updated to hover event
$(document).on('click', '.mega-nav-full-width > a', function(e) {
  e.preventDefault();
  $(this).parent().toggleClass('open');
});

$(window).scroll(function () {
  'use strict';
  if ($(document).scrollTop() > 10) {
    $('.navbar').addClass('shrink');
    $('.mega-nav-full-width').removeClass('open');
  } else {
    $('.navbar').removeClass('shrink');
  }
});
$(document).ready(function () {
  'use strict';

  (function () {
    var cx = '004353913257001268016:dekyzkowxjw';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
      '//cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();
});

$(document).on('click', '.gsc-search-button', function () {
  $('td.gsc-input').toggleClass('open');
  $('input.gsc-input').focus();
});