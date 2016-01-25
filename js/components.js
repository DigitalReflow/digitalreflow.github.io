/*
* Project: Pearson DMCP
* Copyright(c): 2014
*/

+function ($) {
  'use strict';

  var DMCP = DMCP || {};
  DMCP.youtubeVideo = DMCP.youtubeVideo || {};

  DMCP.youtubeVideo.closeModal = function (targetModal) {
    targetModal.attr('aria-hidden', 'true');
    targetModal.dialog( "close" );
    //Stopping video when user closes modal
    targetModal.find('.youtube-video-iframe').remove();
    $(".youtube-video-cross-icon").off('click');
    $(".ui-widget-overlay").off('click');
  }

  DMCP.youtubeVideo.openModal = function (targetElement) {
    var $this = targetElement;
    var $modal = $($this.attr('data-target'));
    var $video = $($this.attr('data-video'));
    var $videoClone = $video.clone();
    $videoClone.attr('tabindex', 2);
    $videoClone.removeClass("visible-xs-block");
    $videoClone.attr('src', $videoClone.attr('src') + '?autoplay=1');

    $modal.dialog({
      autoOpen: false,
      modal: true,
      dialogClass: 'youtube-video-modal-container',
      close: function () {
        DMCP.youtubeVideo.closeModal($modal);
      }
    });
    $modal.dialog( "open" );
    $modal.attr('aria-hidden', 'false');
    //Removing jquery UI added containers
    $modal.parent().find('.ui-dialog-titlebar').remove();
    $modal.parent().find('.ui-resizable-handle').remove();
    //Setting focus on modal by default
    $modal.parent().focus();

    if($modal.find('.youtube-video-iframe')) {
      $modal.find('.youtube-video-iframe').remove();
    }
    $modal.find('.youtube-video-container').append($videoClone);

    $modal.find( ".youtube-video-cross-icon" ).on('click', function(){
      DMCP.youtubeVideo.closeModal($modal);
    });
    $( ".ui-widget-overlay" ).on('click',function(){
      DMCP.youtubeVideo.closeModal($modal);
    });
  }

  $(document).on('click', "[data-open='youtube-video']", function () {
    DMCP.youtubeVideo.openModal($(this));
  });

}(jQuery);
/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    User registration.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.userRegistration = DMCP.userRegistration || {};
  //Function to check pattern.
  DMCP.userRegistration.isValidPattern = function($input) {
	var currentVal = $input.val();
      if(currentVal.length && $input.attr('pattern') && !(currentVal.match($input.attr('pattern')))) {
      	return false;
      }
	  return true;
  }
  //Function to check number.
  DMCP.userRegistration.isValidNumber = function($input) {
	var currentVal = $input.val();
	if($input.attr('type') === "number") {
	  //Checking using regex
	  var number = /^[0-9]+$/;
	  if(currentVal.length) {
		if(!currentVal.match(number)){
		  return false;
		}
      } else {
      	//Setting input to blank if entered value is not a number
      	$input.val('');
      }
	}
	return true;
  }
  //Function for validating text input, email input, number input, textarea and select.
  DMCP.userRegistration.InvalidInputHelper = function (input, options) {
	this.changeOrInput = function () {
      if (input.validity.badInput || input.validity.patternMismatch || input.validity.typeMismatch) {
	    input.setCustomValidity(options.invalidText);
	  }
	  else if (input.value == "") {
	    input.setCustomValidity(options.emptyText);
	  } else {
	    input.setCustomValidity("");
	  }
    }
    if(input.value == "") {
      input.setCustomValidity(options.emptyText);
    } else {
      input.setCustomValidity("");
    }
    input.addEventListener("change", this.changeOrInput);
    input.addEventListener("input", this.changeOrInput);
  }
  //Function for checking if value exists
  DMCP.userRegistration.hasValue = function(value) {
	if(typeof value !== 'undefined' && value.length > 0) {
	  return true;
	} else {
	  return false;
	}
  }
  //Function for adding error message and corresponding aria attributes
  DMCP.userRegistration.addErrorMessage = function($this, isMandatory) {
	var errorMessage;
	if(isMandatory) {
	  errorMessage = $this.closest('form').attr('data-required-msg');
	} else {
	  errorMessage = $this.parent().attr('data-constraint-msg');
	}
	$this.parent().addClass('has-error');
	$this.attr('aria-invalid', 'true');
	$this.siblings('.error-message').text(errorMessage);
  }
  //Function for reseting error message and corresponding aria attributes
  DMCP.userRegistration.resetErrorMessage = function($this) {
	$this.parent().removeClass('has-error');
    $this.attr('aria-invalid', 'false');
    $this.siblings('.error-message').text('');
  }
  //Function for adding success message and corresponding aria attributes
  DMCP.userRegistration.addSuccessMessage = function($this) {
    $this.attr('aria-invalid', 'false');
    $this.siblings('.error-message').text('');
  }
  $(document).ready(function () {
    $('input','.user-registration-password').change(function(){
      $('input','.user-registration-confirm-password').val('');
    });
    $('input','.user-registration-confirm-password').change(function(){
      var $this = $(this);
      if($this.val() !== $('input','.user-registration-password').val()) {
    	DMCP.userRegistration.addErrorMessage($this, false);
      }	
    });
    $('.user-registration-phone').each(function(){
	  var code, number;
	  $(this).find('select').change(function(){
		code = $(this).val();
		$(this).siblings('.complete-phone-number').val(code+"#"+number);
	  });
	  $(this).find('.phone-number').change(function(){
		number = $(this).val();
		$(this).siblings('.complete-phone-number').val(code+"#"+number);
	  });
	  var phoneString = $(this).find('.complete-phone-number').val();
	  if(phoneString.length > 0) {
		var phoneArray = phoneString.split('#');
		code = phoneArray[0];
		$(this).find('select').val(phoneArray[0]);
		number = phoneArray[1];
		$(this).find('.phone-number').val(phoneArray[1]);
	  }
    });
	//Customizing out of the box validation messages for text, email, number inputs and select.
	var inputElements = $('input[type="text"], input[type="email"], input[type="number"], input[type="password"], select','.user-registration');
	inputElements.each(function() {
	  if(typeof this.validity !== 'undefined') {
		DMCP.userRegistration.InvalidInputHelper(this, {
		  emptyText: $(this).closest('form').attr('data-required-msg'),
		  invalidText: $(this).parent().attr('data-constraint-msg')?$(this).parent().attr('data-constraint-msg'):''
	    });
	  }
	});
	//Triggering custom error messages on FocusOut
	$('.user-registration input, .user-registration select').blur(function() {
      var $this = $(this);
      if (!this.checkValidity()) {
	    if ($this.val() === null || $this.val().trim().length === 0) {
	      DMCP.userRegistration.addErrorMessage($this, true);
		} else if(!DMCP.userRegistration.isValidPattern($this) || !DMCP.userRegistration.isValidNumber($this)){
		  DMCP.userRegistration.addErrorMessage($this, false);
		}
	  } else {
		if(this.type ==="number" && !DMCP.userRegistration.isValidPattern($this)) {
		  DMCP.userRegistration.addErrorMessage($this, false);
		} else {
		  $this.attr('aria-invalid', 'false');
		}
      }
	});
	$('.user-registration input, .user-registration select').focus(function() {
      var $this = $(this);
      if(!($this.parents('fieldset.has-error').length)) {
    	DMCP.userRegistration.resetErrorMessage($this);
      } else {
		var allSiblings = $(this).siblings('input,select');
        var siblingError = false;
        allSiblings.each(function() {
          var invalid = $(this).attr('aria-invalid');
          if(invalid === "true") {
        	siblingError = true;
            return;
          }
        });
        if(!siblingError){
          DMCP.userRegistration.resetErrorMessage($this);
        }
      }
	});
	//Form submit handler
	$('.user-registration form').submit(function(event) {
	  var formId = "#"+$(this).attr('id');
	  var isValid = true;
      $(formId + " input[type='text']," +  
        formId + " input[type='number'],"+ 
        formId + " input[type='email'],"+ 
        formId + " input[type='password']," +
        formId + " select").each(function(e) {
      	var $this = $(this);
		  if ($this.val() === null || $this.val().trim().length === 0) {
            isValid = false;
            //Setting input to blank if entered value for Numeric text box is not a number
            $this.val('');
            DMCP.userRegistration.addErrorMessage($this, true);
          } else if(!DMCP.userRegistration.isValidPattern($this) || !DMCP.userRegistration.isValidNumber($this)){
          	isValid = false;
          	DMCP.userRegistration.addErrorMessage($this, false);
          } else {
        	DMCP.userRegistration.resetErrorMessage($this);
		  }
		});
        if($('input','.user-registration-confirm-password').val() !== $('input','.user-registration-password').val()) {
          isValid = false;
          DMCP.userRegistration.addErrorMessage($('input','.user-registration-password'), false);
        }
		if (isValid == false) {
			event.preventDefault();
		}
	});
  });
}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Tab panel component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.tabPanel = DMCP.tabPanel || {};
  DMCP.tabPanel.tabClickHandler = function() {
	  $(this).siblings().attr('aria-selected','false');
      $(this).attr('aria-selected','true');
      var selectedTab = $(this).attr('aria-controls');
      $('#'+selectedTab).attr('aria-hidden','false').siblings().attr('aria-hidden','true');
  }
  DMCP.tabPanel.onload = function($tabPanel) {
	$tabPanel.find('.nav-tabs').tab();
	if($tabPanel.length) {
	  $tabPanel.each(function(){
		$(' .nav-tabs', this).find('li:not(.active)').attr('aria-selected','false');
		$(this).find('.tab-pane.active').attr('aria-hidden','false');
	  });
	}
  }
  $(document).ready( function () {
    var $tabPanel = $('.tab-panel');
    DMCP.tabPanel.onload($tabPanel);
    $tabPanel.find('li').click(DMCP.tabPanel.tabClickHandler);
  });
}(jQuery);
/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    RTE component.
------------------------------------------------------------------------ */

+function ($) {
  'use strict';
  $(document).ready(function () {
	$('a.new-window').attr("target","_blank");
  });
}(jQuery);
/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    Request password reset.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.resetPassword = DMCP.resetPassword || {};
  DMCP.resetPassword.manageMessage = function($formId) {
	var isError = $formId.attr('data-iserror'),
		$messageContainer = $formId.find('div');
	if(typeof isError !== 'undefined') {
	  $messageContainer.addClass('has-message');
	} else {
	  $messageContainer.removeClass('has-message');
	}
  };
  
  $(window).on('load', function () {
	DMCP.resetPassword.manageMessage($('.reset-password-form'));
  });
}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/*
 * CHANGE HISTORY:
 * Customized carousel component to make it work for news feed
 * Added pause and play icons.
 * Added swipe effects.
 * Pausing news feed on hover only for desktops.
 */
+function ($) {
  'use strict';
  // NEWS FEED CLASS DEFINITION
  // =========================
  var Newsfeed = function (element, options) {
    this.$element    = $(element).on('keydown.bs.newsfeed', $.proxy(this.keydown, this))
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null
    //Getting width of the screen
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    //Adding hover event only for Desktop.
    this.options.pause == 'hover' && (width >= this.options.minHoverWidth) && this.$element.find('.news-feed-headlines')
      .on('mouseenter.bs.newsfeed', $.proxy(this.pause, this))
      .on('mouseleave.bs.newsfeed', $.proxy(this.cycle, this))
  }

  Newsfeed.VERSION  = '3.2.0'

  Newsfeed.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    maxCharLength: 100,
    //Min width for desktop as per bootstrap.
    minHoverWidth: 992
  }

  Newsfeed.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Newsfeed.prototype.cycle = function (e) {
	var $playPauseButton = this.$element.find("#pause-play-icon");
	$playPauseButton.addClass('fa-pause').removeClass('fa-play');
	$playPauseButton.attr('aria-label', $playPauseButton.attr('data-label-pause'));
      
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Newsfeed.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Newsfeed.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.newsfeed', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Newsfeed.prototype.pause = function (e) {
	var $playPauseButton = this.$element.find("#pause-play-icon");
	$playPauseButton.removeClass('fa-pause').addClass('fa-play');
	$playPauseButton.attr('aria-label',$playPauseButton.attr('data-label-play'));
      
    e || (this.paused = true)
    
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Newsfeed.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Newsfeed.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }
  
  Newsfeed.prototype.ellipsis = function () {
	var maxCharLength = this.options.maxCharLength
	this.$element.find(".news-feed-headlines").each(function(index, headline){
	  var headlineText = $(headline).text();
	  if(headlineText.length > maxCharLength){
		  headlineText = headlineText.substring(0,maxCharLength) + '...';
	    $(headline).text(headlineText);
	  }
	})
  }

  Newsfeed.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.newsfeed', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    var slidEvent = $.Event('slid.bs.newsfeed', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // NEWS FEED PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.newsfeed')
      var options = $.extend({}, Newsfeed.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.newsfeed', (data = new Newsfeed(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.newsfeed

  $.fn.newsfeed             = Plugin
  $.fn.newsfeed.Constructor = Newsfeed


  // NEWS FEED NO CONFLICT
  // ====================

  $.fn.newsfeed.noConflict = function () {
    $.fn.newsfeed = old
    return this
  }


  // NEWS FEED DATA-API
  // =================

  $(document).on('click.bs.newsfeed.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('news-feed-container')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.newsfeed').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="newsfeed"]').each(function () {
      var $newsfeed = $(this)
      $newsfeed.newsfeed('ellipsis');
        
      $newsfeed.find("#pause-play-icon").click(function() {
    	var $this = $(this);
    	if($this.hasClass('fa-pause')) {
    	  $newsfeed.newsfeed('pause');  
    	} else {
    	  $newsfeed.newsfeed('cycle');
    	}        
      });
      //Added swipe events for News Feed
      $newsfeed.on('swipeleft',function(){
        $newsfeed.newsfeed('next');
      });
      $newsfeed.on('swiperight',function(){
        $newsfeed.newsfeed('prev');
      });
      $newsfeed.on('taphold',function(){
        $newsfeed.newsfeed('pause');
      });
        
      Plugin.call($newsfeed, $newsfeed.data())
    })
  })

}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Mega Navigation component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function($) {
  'use strict';
  DMCP.MegaNav = DMCP.MegaNav || {};
  DMCP.MegaNav.onload = function() {
    $(".mega-nav .dropdown").click(function() {
      $(".dropdown-toggle").attr("aria-expanded", "false");
      $(this).find("a").attr("aria-expanded", "true");
    });
    $(document).on('click', '.mega-nav .dropdown-menu', function(e) {
      e.stopPropagation()
    })
  }
  $(document).ready(function() {
    DMCP.MegaNav.onload();
  });
}(jQuery);

/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    Login status component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.loginStatus = DMCP.loginStatus || {};
  DMCP.loginStatus.manageLoginStatus = function() {
	var $loginStatus = $('.login-status'),
		$statusLinks = $loginStatus.find('.login-status-links'),
		$statusDetails = $loginStatus.find('.login-status-details'),
		$usernameField = $loginStatus.find('.login-status-user-name'),
		userToken,
		username,
		statusKey = $statusDetails.attr('data-status-key'),
		userKey = $statusDetails.attr('data-user-key');
	if(statusKey && statusKey.length > 0) {
	  userToken = $.cookie(statusKey);
	}
	if(userKey && userKey.length > 0) {
	  username = $.cookie(userKey);
	}
	
	if(userToken && username) {
	  $statusDetails.removeClass('hide');	
	  $usernameField.text(username);
    }
    else {
	  $statusLinks.removeClass('hide');
	  $usernameField.text('');
    }
  }
  DMCP.loginStatus.logoutHandler = function() {
    var resourcePath = $(this).attr('data-resource-path');
    $.ajax({
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      context: this,
      type: 'POST',
      dataType: 'json',
      url: resourcePath+'.logout.html'
    }).done(function(success){
      if(localStorage.getItem(success.cartIdentifierName) !== null){
        localStorage.removeItem(success.cartIdentifierName);
      }
      window.location = success.logoutPagePath;
    }).fail(function(error){
    });
  }

  $(document).ready(function() {
    $('.login-status-logout-button').click(DMCP.loginStatus.logoutHandler);
  });
  $(window).on('load', function () {
    DMCP.loginStatus.manageLoginStatus();
  });
}(jQuery);
/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    Login component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.login = DMCP.login || {};
  DMCP.login.manageLogin = function() {
    var $loginForm = $('.login-form'),
    	isError = $loginForm.attr('data-haserror');
    if(typeof isError !== 'undefined') {
      $loginForm.find('div').addClass('has-error');
    } else {
      $loginForm.find('div').removeClass('has-error');
    }
  }
  $(window).on('load', function () {
    DMCP.login.manageLogin();
  });
}(jQuery);
/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    Locale selection component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.localeSelection = DMCP.localeSelection || {};
  DMCP.localeSelection.changeHandler = function() {
	window.location = $(this).val();
  }
  $(document).on('change', '.locale-selection select', DMCP.localeSelection.changeHandler);
}(jQuery);
/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
// ensure DMCP.livefyre namespace
if (!window.DMCP) {
	window.DMCP = {};
}
if (!window.DMCP.livefyre) {
	window.DMCP.livefyre = {};
}
/**
 * The <code>DMCP.livefyre.Comments</code> class provides Comments menthod for
 * livefyre comments integration.
 * 
 * @class DMCP.livefyre.Comments
 */
DMCP.livefyre.Comments = function() {
	return {
		displayComments : function(elementId, networkId, siteId, articleId) {
			fyre.conv.load({}, [ {
				el : elementId,
				network : networkId,
				siteId : siteId,
				articleId : articleId,
				signed : false,
				collectionMeta : {
					articleId : articleId,
					url : fyre.conv.load.makeCollectionUrl(),
				}
			} ], function() {
			});
		}
	};
}();

/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    Form.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};

+function ($) {
  'use strict';
  
  DMCP.form = DMCP.form || {};
  
  DMCP.form.populateDrilldowns = function ($drilldown1) {
    var $drilldown2 = $drilldown1.siblings('.drilldown2');
    if ($drilldown1.val() == '') {
    	$drilldown2.find("option:not([value=''])").remove();
    }
    else {
      $.ajax({
        url: "/bin/dmcp/tags.json",
        type: "GET",
        data: {tagId : $drilldown1.val()},
        success: function(tags) {
          $drilldown2.find("option:not([value=''])").remove();
          for (var i=0; i<tags.length; i++) {
            $drilldown2.append($("<option/>").val(tags[i].value).text(tags[i].text));
          }
        }
      });
    }
  }

  $(document).ready(function () {
    $('.drilldown1').each(function () {
      DMCP.form.populateDrilldowns($(this));
    });
    $('.drilldown1').change(function () {
      DMCP.form.populateDrilldowns($(this));
    });
    
    DMCP.FormValidator.customizeErrorMessage($('.form'));
    DMCP.FormValidator.attachFocusEventHandlers($('.form'));
    $('.form').submit(function(event) {
    	DMCP.FormValidator.validateOnSubmit($(this), event);
    });
  });
}(jQuery);
/* ---------------------------------------------------------------------
    PEARSON MARKETING CLOUD
  _______________________
  
    Forgotten password component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.forgottenPassword = DMCP.forgottenPassword || {};
 
  DMCP.forgottenPassword.checkPasswordMatch = function($formId, isSubmit) {
    var $newPassword = $formId.find('.forgotten-password-new'),
        $confirmPassword = $formId.find('.forgotten-password-confirm'),
        $messageSpan = $formId.find('.message'),
		$messageContainer = $formId.find('div');
    if($newPassword.val().length > 0 && $confirmPassword.val().length > 0) {
      if(isSubmit) {
    	if(!$newPassword.val().match($newPassword.attr('pattern')) || !$confirmPassword.val().match($confirmPassword.attr('pattern'))) {
    	  $messageContainer.addClass('has-message');
    	  $messageSpan.addClass('error').text($messageSpan.attr('data-password-regex-error-msg'));
    	  return false;	
    	}	
      }
      if($newPassword.val() !== $confirmPassword.val()) {
    	$messageContainer.addClass('has-message');
    	$messageSpan.addClass('error').text($messageSpan.attr('data-password-mismatch-error-msg'));
    	return false
      }
      $messageContainer.removeClass('has-message');
      $messageSpan.removeClass('error').text('');
      return true;
    }    
  };
  
  //Function for validating pattern.
  DMCP.forgottenPassword.InvalidInputHelper = function (input, options) {
    this.changeOrInput = function () {
      if (input.validity.badInput || input.validity.patternMismatch || input.validity.typeMismatch) {
    	  input.setCustomValidity(options.invalidText);
    	} else {
            input.setCustomValidity("");
        }
    }
    input.addEventListener("change", this.changeOrInput);
    input.addEventListener("input", this.changeOrInput);
  }
  
  $(window).on('load', function () {
	//Customizing out of the box validation messages for text, email, number inputs, textarea and select.
	var inputElements = $('.forgotten-password-confirm, .forgotten-password-new');
	inputElements.each(function() {
	  if(typeof this.validity !== 'undefined') {
		DMCP.forgottenPassword.InvalidInputHelper(this, {
		  invalidText: $('.forgotten-password-form .message').attr('data-password-regex-error-msg')
	    });
	  }
	});
	
	$('.forgotten-password-form').submit(function(event) {
      if (!DMCP.forgottenPassword.checkPasswordMatch($(this), true)) {
        event.preventDefault();
      }
    });
  });
}(jQuery);
/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
var DMCP = DMCP || {};
DMCP.eventsSummary = DMCP.eventsSummary || {};
  
+function ($) {
  'use strict';
  
  //function to create the DOM structure of one event summary
  DMCP.eventsSummary.createSummaryDOM = function (title, summary, hrefUrl) {
	if (typeof summary == 'undefined') {
	  return "<li class='item'>" +
		     	"<article>" +
		     		"<h6><a href='"+hrefUrl+".html'>"+title+"</a></h6>"+
				   	"<a href='"+hrefUrl+".html'>"+$('.events-summary ul').attr("data-read-more-text")+"</a>"+
			    "</article>" +
             "</li>";
	}
	else {
      return "<li class='item'>" +
	     	 	"<article>" +
	   				"<h6><a href='"+hrefUrl+".html'>"+title+"</a></h6>"+
	   				"<p>"+summary+"</p>" +
	   				"<a href='"+hrefUrl+".html'>"+$('.events-summary ul').attr("data-read-more-text")+"</a>"+
	   			"</article>" +
	         "</li>";
	}
  }
  
  //function to get one event summary DOM and append it to the summary div
  DMCP.eventsSummary.populateSummary = function (key, eventObject) {
	  if (typeof eventObject[key] == 'undefined') {
	      $('.events-summary .events-summary-container').addClass('hidden');
	      $('.events-summary-message').removeClass('hidden');
	    }
	    else {
	      $('.events-summary .events-summary-container').removeClass('hidden');
	      $('.events-summary-message').addClass('hidden');
	      $('.events-summary ul').empty();
	      $('.events-summary ol').empty();
	      for (var i=0; i<eventObject[key].events.length; i++) {
	    	$('.events-summary ul').append(DMCP.eventsSummary.createSummaryDOM(eventObject[key].events[i].eventName, eventObject[key].events[i].eventSummary, eventObject[key].events[i].eventLink));
	    	$('.events-summary-indicators').append("<li data-slide-to='"+i+"'></li>");
	    	$('.events-summary ul li:first, .events-summary-indicators li:first').addClass('active');
	      }
	    }
	    if ($('.events-summary-container ul li').length == 1) {
	      $('.events-summary-control-container').addClass('hidden');
	    }
	    else {
	      $('.events-summary-control-container').removeClass('hidden');
	    }
  }
  
  //function to fetch the events summary for a particular day (if any)
  DMCP.eventsSummary.fetchSummary = function (selectedDate, eventObject) {
	var key, day, month, year, name;
    year = selectedDate.data('year');
    month = selectedDate.data('month');
    if (month<10) {
      month="0"+month;
    }
    day = selectedDate.data('day');
    if (day<10) {
      day="0"+day;
    }
    key = year+"-"+month+"-"+day;
    var eventDate = $('span[data-head-month]').text()+" "+day+", "+year;
    $(".events-summary time").attr("datetime",key).text(eventDate);
    DMCP.eventsSummary.populateSummary(key, eventObject);
  } 
  
  //function to show the next event on clicking the control elements in events summary
  DMCP.eventsSummary.changeEvent = function (changeTo) {
    var next=1;
	var count = parseInt($('.events-summary-container ul li').length);
	var current = parseInt($('.events-summary-container ul .active').index());
	if (changeTo=='prev') {
	  next=-1;
	}
	current = current + next;
	if (current<0 || current==count) {
	  current = current - count*next;
	}
	$('.events-summary-container .active').removeClass('active');
	$('.events-summary-container li').eq(current).addClass('active');
	$('.events-summary-indicators li').eq(current).addClass('active');
  }
  
  $(document).ready(function () {
	
	//call function to show the next event on clicking next/previous buttons
    $('.events-summary-control').click(function () {
      DMCP.eventsSummary.changeEvent($(this).attr('data-slide'));
    });
    //call function to show the next event on clicking the indicators
    $('.events-summary-indicators').on('click', 'li', function () {
      $('.events-summary-container .active').removeClass('active');
      $('.events-summary-container li').eq($(this).attr('data-slide-to')).addClass('active');
      $('.events-summary-indicators li').eq($(this).attr('data-slide-to')).addClass('active');
    });
    
    var $summaryContainer = $('.events-summary-container');
    //Added swipe events for events summary.
    $summaryContainer.on('swipeleft',function(){
      DMCP.eventsSummary.changeEvent('next');
    });
    $summaryContainer.on('swiperight',function(){
      DMCP.eventsSummary.changeEvent('prev');
    });
  });

}(jQuery);
/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */

/*
 * This is the code for creating a generic calendar
 * This has been extended in the events-calendar component to fetch and populate events dynamically
 * 
 */
var DMCP = DMCP || {};

  (function($) {
    "use strict";
    var opts;
    
    // CALENDAR CLASS DEFINITION
    // =========================
    
    DMCP.Calendar = function(element, options) {
      var currentDate;
      this.$element = element;
      this.options = options;
      this.currentDate = new Date();
      this.currentYear = this.currentDate.getFullYear();
      this.currentMonth = this.currentDate.getMonth();
      if (this.options.currentDate) {
        currentDate = this.getDateString(this.options.currentDate);
        this.currentYear = currentDate.year;
        this.currentMonth = currentDate.month;
      }
      this.calendarInit();
      return null;
    };
    
    //Calendar methods definition
    DMCP.Calendar.prototype = {
      //function to add a leading zero for single digit number
      addZero: function(num) {
        if (num < 10) {
          return "0" + num;
        } else {
          return "" + num;
        }
      },
      //function to convert javascript date to date object with year, month and day as data inside it
      getDateString: function(datePassed) {
        var day, month, dateObject, year;
        dateObject = datePassed.split('-');
        year = parseInt(dateObject[0]);
        month = parseInt(dateObject[1] - 1);
        day = parseInt(dateObject[2]);
        return dateObject = {
          year: year,
          month: month,
          day: day
        };
      },
      //call the function to load the days of the month in calendar
      calendarInit: function() {
        return this.loadMonth(this.currentYear, this.currentMonth);
      },
      //function to edit calendar for adding more events
      editCalendar: function(events) {
        var datePassed, day, dayEvents, dateObject, results;
        results = [];
        for (datePassed in events) {
          dayEvents = events[datePassed];
          this.options.events[datePassed] = events[datePassed];
          dateObject = this.getDateString(datePassed);
          day = this.$element.find('[data-year="' + dateObject.year + '"][data-month="' + (dateObject.month + 1) + '"][data-day="' + dateObject.day + '"]').parent('.events-calendar-day');
          day.removeClass('active');
          day.find('.events-calendar-indicator').remove();
          day.find('a').removeAttr('href');
          if (this.currentMonth === dateObject.month) {
            this.activate(day, dayEvents);
            results.push(day);
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      //function to remove events from a particular day 
      clearEvents: function(days) {
        var datePassed, day, dateObject, i, len, results;
        results = [];
        for (i = 0, _len = days.length; i < len; i++) {
          datePassed = days[i];
          delete this.options.events[datePassed];
          dateObject = this.getDateString(datePassed);
          day = this.$element.find('[data-year="' + dateObject.year + '"][data-month="' + (dateObject.month + 1) + '"][data-day="' + dateObject.day + '"]').parent('.events-calendar-day');
          day.removeClass('active');
          day.find('.events-calendar-indicator').remove();
          results.push(day.find('a').removeAttr('href'));
        }
        return results;
      },
      //function to remove all events from all days
      clearAllEvents: function() {
        var day, days, i, j, len, results;
        this.options.events = {};
        days = this.$element.find('[data-group="days"] .events-calendar-day');
        results = [];
        for (i = j = 0, len = days.length; j < len; i = ++j) {
          day = days[i];
          $(day).removeClass('active');
          $(day).find('.events-calendar-indicator').remove();
          results.push($(day).find('a').removeAttr('href'));
        }
        return results;
      },
      //function to select the month on the calendar
      setMonth: function(datePassed) {
        var dateObject;
        dateObject = this.getDateString(datePassed);
        return this.currentMonth = this.loadMonth(dateObject.year, dateObject.month);
      },
      //function to go to previous month
      prev: function() {
        if (this.currentMonth - 1 < 0) {
          this.currentYear = this.currentYear - 1;
          this.currentMonth = 11;
        } else {
          this.currentMonth = this.currentMonth - 1;
        }
        this.loadMonth(this.currentYear, this.currentMonth);
        if (this.options.onMonthChange) {
          this.options.onMonthChange.call(this);
        }
        return null;
      },
    //function to go to next month
      next: function() {
        if (this.currentMonth + 1 > 11) {
          this.currentYear = this.currentYear + 1;
          this.currentMonth = 0;
        } else {
          this.currentMonth = this.currentMonth + 1;
        }
        this.loadMonth(this.currentYear, this.currentMonth);
        if (this.options.onMonthChange) {
          this.options.onMonthChange.call(this);
        }
        return null;
      },
      //function to add indicator (optional) if needed
      addIndicators: function(day, dayEvents) {
        var indicator;
        if (typeof dayEvents === "object") {
          if (dayEvents.numberOfEvents != null) {
            indicator = $("<span></span>").text(dayEvents.numberOfEvents).addClass("events-calendar-indicator");
            if (dayEvents.indicatorClass != null) {
              indicator.addClass(dayEvents.indicatorClass);
            }
            day.append(indicator);
          }
          if (dayEvents.url) {
            day.find("a").attr("href", dayEvents.url);
          }
        }
        return day;
      },
      //function to make the day active when it has event(s)
      activate: function(day, dayEvents) {
        var classes, eventClass, i, j, len;
        if (dayEvents) {
          if (dayEvents['class']) {
            classes = dayEvents['class'].split(' ');
            for (i = j = 0, len = classes.length; j < len; i = ++j) {
              eventClass = classes[i];
              day.addClass(eventClass);
            }
          } else {
            day.addClass('active');
          }
          day = this.addIndicators(day, dayEvents);
        }
        return day;
      },
      //function to get number of days in a given month
      getDaysInMonth: function(year, month) {
        return new Date(year, month + 1, 0).getDate();
      },
      //function to load the days of the month in calendar 
      loadDay: function(lastDayOfMonth, yearNum, monthNum, dayNum, i) {
        var calcDate, currentDate, datePassed, day, dayDate, dayClass;
        day = $("<div></div>").addClass("events-calendar-day");
        currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        dayDate = new Date(yearNum, monthNum - 1, dayNum);
        if (dayDate.getTime() < currentDate.getTime()) {
          dayClass = "past";
        } else if (dayDate.getTime() === currentDate.getTime()) {
          dayClass = "today";
        } else {
          dayClass = "future";
        }
        day.addClass(dayClass);
        datePassed = yearNum + "-" + this.addZero(monthNum) + "-" + this.addZero(dayNum);
        if (dayNum <= 0 || dayNum > lastDayOfMonth) {
          calcDate = new Date(yearNum, monthNum - 1, dayNum);
          dayNum = calcDate.getDate();
          monthNum = calcDate.getMonth() + 1;
          yearNum = calcDate.getFullYear();
          day.addClass("not-current").addClass(dayClass);
        }
        day.append($("<a>" + dayNum + "</a>").attr("data-day", dayNum).attr("data-month", monthNum).attr("data-year", yearNum));
        //call function to make day active if it has event(s)
        day = this.activate(day, this.options.events[datePassed]);
        return this.$element.find('[data-group="days"]').append(day);
      },
      //function to fetch details of current month and events in order to load the days
      loadMonth: function(year, month) {
        var currentMonth, day, days, init, firstDay, i, lastDay, loopBase, monthNum, multiplier, thisRef, dateObject, timeout, yearNum, _i, _len;
        thisRef = this;
        dateObject = new Date(year, month);
        currentMonth = dateObject.getMonth();
        monthNum = dateObject.getMonth() + 1;
        yearNum = dateObject.getFullYear();
        dateObject.setDate(1);
        firstDay = dateObject.getDay() + 1;
        lastDay = this.getDaysInMonth(year, month);
        timeout = 0;
        multiplier = Math.ceil((firstDay - 1 + lastDay) / 7);
        loopBase = multiplier * 7;
        
        this.$element.find("[data-head-year]").text(dateObject.getFullYear());
        //customized to provide locale language support
        var $monthElement = this.$element.find("[data-head-month]"),
        	$months = $monthElement.attr('data-months')+'',
        	$monthArray = $months.split(",");
        $monthElement.text($monthArray[dateObject.getMonth()]);
        //function to load the given day
        init = function() {
          var dayNum, setEvents;
          thisRef.$element.find('[data-group="days"]').empty();
          dayNum = 2 - firstDay;
          i = 0;
          while (dayNum < loopBase - firstDay + 2) {
            thisRef.loadDay(lastDay, yearNum, monthNum, dayNum, i);
            dayNum = dayNum + 1;
            i = i + 1;
          }
          //function to set calendar interface interactions
          setEvents = function() {
            days = thisRef.$element.find('[data-group="days"] .events-calendar-day');
            //set event handler on click of a day
            if (thisRef.options.onDayClick) {
              thisRef.$element.find('[data-group="days"] .events-calendar-day a').click(function() {
                return thisRef.options.onDayClick.call(this, thisRef.options.events);
              });
            }
          };
          return setTimeout(setEvents, 0);
        };
        setTimeout(init, timeout);
        return currentMonth;
      }
    };
    
    //function to provide default values of all options and override them with options provided by user (if any) and initialize calendar
    $.fn.calendar = function(option, params) {
      var init, options, publicFunc;
      options = $.extend({}, $.fn.calendar.defaults, typeof option === 'object' && option);
      publicFunc = {
        next: 'next',
        prev: 'prev',
        editCalendar: 'editCalendar',
        clear: 'clearEvents',
        clearAllEvents: 'clearAllEvents',
        getYearMonth: 'getYearMonth',
      };
      init = function($this) {
        var data;
        options = $.metadata ? $.extend({}, options, $this.metadata()) : options;
        $this.data('calendar', (data = new DMCP.Calendar($this, options)));
        if (options.onInit) {
          options.onInit.call(data);
        }
        return $this.find("[data-go]").click(function() {
          if ($(this).data("go") === "prev") {
            data.prev();
          }
          if ($(this).data("go") === "next") {
            return data.next();
          }
        });
      };
      return this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data('calendar');
        if (!data) {
          init($this);
        } else if (typeof option === 'string') {
          if (publicFunc[option] != null) {
            data[publicFunc[option]](params);
          } else {
            data.setMonth(option);
          }
        }
        return null;
      });
    };
    //default values of all the options
    $.fn.calendar.defaults = {
      events: {},
      currentDate: void 0,
      onInit: void 0,
      onDayClick: void 0,
      onMonthChange: void 0
    };
  })(jQuery);
/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
var DMCP = DMCP || {};
DMCP.eventsCalendar = DMCP.eventsCalendar || {};
  
+function ($) {
  'use strict';
  
  //function to convert javascript date to yyyy-mm-dd format
  DMCP.eventsCalendar.convertDate = function (dateString) {
    var year, month, day;
    year = dateString.getFullYear();
    month = dateString.getMonth()+1;
    day = dateString.getDate();
    if (month<10) {
      month="0"+month;
    }
    if (day<10) {
      day="0"+day;
    }
    year = year.toString();
    month = month.toString();
    day = day.toString();
    return (year+"-"+month+"-"+day).toString();
  }
  
  //function to make AJAX call to fetch events in given month of the year
  DMCP.eventsCalendar.fetchEvents = function (currentYear, currentMonth) {
	return $.ajax({
      type: "GET",
	  url: $(".events-calendar-container").attr("data-events-calendar-path"),
	  data: { 
  	    startDate: DMCP.eventsCalendar.convertDate(new Date(currentYear, currentMonth, 1)), 
	    endDate: DMCP.eventsCalendar.convertDate(new Date(currentYear, currentMonth + 1, 0)), 
	    tags: $('.events-calendar-container').attr('data-tags') 
	  }
    });
  }
  
  //function to populate the events received on the calendar
  DMCP.eventsCalendar.populateEvents = function (eventDetails, passedDate) {
    var eventObject = {};  //create events object to pass to the calendar
    //loop through each event
    for(var i=0; i<eventDetails.length; i++) {
  	  //loop through each day from start to end dates of an event to create final event object
  	  for (var d = new Date(eventDetails[i].eventStartDate); d <= new Date(eventDetails[i].eventEndDate); d.setDate(d.getDate() + 1)) {
  		var eventDate = DMCP.eventsCalendar.convertDate(d);
        if (typeof eventObject[eventDate] == 'undefined') {
          eventObject[eventDate] = {
            "numberOfEvents":1,
            "events": [{
              "eventName": eventDetails[i].eventName,
              "eventStartDate": new Date(eventDetails[i].eventStartDate),
              "eventEndDate": new Date(eventDetails[i].eventEndDate),
              "eventSummary": eventDetails[i].eventSummary,
              "eventLink": eventDetails[i].eventLink
            }]
          };
        }
        else {
          eventObject[eventDate].numberOfEvents++;
          eventObject[eventDate].events.push({
            "eventName": eventDetails[i].eventName,
            "eventStartDate": new Date(eventDetails[i].eventStartDate),
            "eventEndDate": new Date(eventDetails[i].eventEndDate),
            "eventSummary": eventDetails[i].eventSummary,
            "eventLink": eventDetails[i].eventLink
          });
        }
      }
    }
    //if there is a passedDate argument, populate that date's summary in events summary
    if (typeof passedDate != 'undefined') {
  	  var eventDate;
  	  passedDate = DMCP.eventsCalendar.convertDate(passedDate);
  	  eventDate = $('span[data-head-month]').text()+" "+passedDate.split('-')[2]+", "+passedDate.split('-')[0];
  	  $(".events-summary time").attr("datetime",passedDate).text(eventDate);
  	  DMCP.eventsSummary.populateSummary(passedDate, eventObject);
  	}
  	//pass events object to the calendar
    $('.events-calendar-container').calendar('editCalendar', eventObject);
  }
  
  $(document).ready(function () {
    var $calendarContainer = $(".events-calendar-container");
	//initialize calendar and provide default options
    $calendarContainer.calendar({
      //on change of month, call function to fetch events for that particular month and populate on the calendar
      onMonthChange: function () {
    	$calendarContainer.calendar('clearAllEvents');
        var selfCurrentYear=this.currentYear,
            selfCurrentMonth=this.currentMonth;
        DMCP.eventsCalendar.fetchEvents(selfCurrentYear, selfCurrentMonth).done(function (eventDetails) {
          DMCP.eventsCalendar.populateEvents(eventDetails, new Date(selfCurrentYear, selfCurrentMonth, 1));
  		selfCurrentMonth++;
          $("a[data-day='1'][data-month='" + selfCurrentMonth + "']").parent().addClass("selected");
        });
      },
      //make the day clicked on as selected and fetch its events to show in summary (if any)
      onDayClick: function (events) {
    	if(!$(this).parent().hasClass('not-current')) {
    	  $('.selected').removeClass('selected');
      	  $(this).parent().addClass('selected');
      	  if (typeof DMCP.eventsSummary != 'undefined') {
      	    DMCP.eventsSummary.fetchSummary($(this),events);
      	  }
        }
      }
    });
    //Added swipe events for events calendar.
    $calendarContainer.on('swipeleft',function(){
      $calendarContainer.calendar('next');
    });
    $calendarContainer.on('swiperight',function(){
      $calendarContainer.calendar('prev');
    });
    //fetch events for current month on page load 
    if ($(".events-calendar").length) {
      DMCP.eventsCalendar.fetchEvents(new Date().getFullYear(), new Date().getMonth()).done(function (eventDetails) {
        //populate fetched events on the calendar
        DMCP.eventsCalendar.populateEvents(eventDetails, new Date());
      });
    }

  });

}(jQuery);
/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Content Search Result List component.
------------------------------------------------------------------------ */

if (typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
} 
+function($) {
  'use strict';
  DMCP.Search = DMCP.Search || {};
  DMCP.Search.Model= DMCP.Search.Model || {};
  DMCP.Search.Model.ContentSearchResultList = DMCP.Search.Model.ContentSearchResultList || {};

  DMCP.Search.Model.ContentSearchResultList = Backbone.Model.extend({
    defaults: {
      "parentPageTitle": "",
      "excerpt": "",
      "title": "",
      "url": "",
      "datePublished": "",
      "imagePath": "",
      "imageAltText": "",
      "description": ""
    },
      
    fetchSearchRecords: function(searchParameters, searchTerm, currentPage, viewContext) {
      viewContext.showLoader();
      viewContext.collection.fetch({
        url:viewContext.searchUrl + '.search.result.json',  
        data: searchParameters,
        success: function(collection) {
          viewContext.resetLayout();
          viewContext.showSearchErrorMessage(false);
          collection.each(function(model) {
            viewContext.buildRowData(model.attributes, searchTerm);
          });
          viewContext.buildPagination(currentPage, collection.totalPages);
          viewContext.hideLoader();
        },

        error:function(response,status){
          viewContext.resetLayout();
		  viewContext.showSearchErrorMessage(true);  
          viewContext.hideLoader();
        }  
      });
    }
  });
}(jQuery);

/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Content Search Result List component.
------------------------------------------------------------------------ */

if (typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
} 
+function($) {
  'use strict';
  DMCP.Search = DMCP.Search || {};
  DMCP.Search.Collection = DMCP.Search.Collection || {};
  DMCP.Search.Collection.ContentSearchResultList = DMCP.Search.Collection.ContentSearchResultList || {};

  DMCP.Search.Collection.ContentSearchResultList = Backbone.Collection.extend({
   //URL is construted dynamically, so it is defined in the model
    model: DMCP.Search.Model.ContentSearchResultList,
    parse: function(response) {
      this.totalPages = response.totalPages;
      this.currentPage = response.currentPage;
      return response.result;
    }
  });
}(jQuery);


/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Content Search Result List component.
------------------------------------------------------------------------ */

if (typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
} 
+function($) {
  'use strict';
  DMCP.Search = DMCP.Search || {};
  DMCP.Search.View = DMCP.Search.View || {};
  DMCP.Search.View.ContentSearchResultListItem = DMCP.Search.View.ContentSearchResultListItem || {};

  DMCP.Search.View.ContentSearchResultListItem = Backbone.View.extend({

    render: function(searchTerm) {
      this.template = DMCP.tpl['search-list-view'];
      var searchResult = JSON.parse(JSON.stringify(this.model));
      searchResult.titleAriaLabel =searchResult.title;
      searchResult.title = this.highlightHandler(searchTerm, searchResult.title);
      searchResult.imgTag = (searchResult.imagePath)? "img":"span";
      this.$el.html(this.template(searchResult));
    },
      
    highlightHandler: function(searchTerm, response) {
      var caseInsensitiveRegex = new RegExp(searchTerm, "gi");;
      var result = response.replace(caseInsensitiveRegex, function(str) {
        return '<span class="content-search-results-list-highlight">' + str + '</span>'
      });
      return result;
    }

  });

}(jQuery);

/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Content Search Result List component.
------------------------------------------------------------------------ */
if (typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
} 
+function($) {
  'use strict';
  DMCP.Search = DMCP.Search || {};
  DMCP.Search.View = DMCP.Search.View || {};
  DMCP.Search.View.ContentSearchResultListLayout = DMCP.Search.View.ContentSearchResultListLayout || {};

  DMCP.Search.View.ContentSearchResultListLayout = Backbone.View.extend({
    el: 'body', // el attaches to existing element
    events: {
      'keyup .search-box-enable-auto-search': 'searchHandler',
      'search .search-box-enable-auto-search': 'searchHandler',
      'click .pageNumber': 'pageRequestHandler',
    },

    initialize: function() {
      this.$searchResultDom = $(".content-search-results-list-results");
      this.$searchBoxInput = $(".search-box-enable-auto-search");
      this.searchUrl = this.$searchResultDom.attr("searchUrl");
      this.noResultsText = this.$searchResultDom.attr("noResultsText");
      this.previousLinkLabel = this.$searchResultDom.attr("previousLinkLabel");
      this.nextLinkLabel = this.$searchResultDom.attr("nextLinkLabel");
    },

    render: function(searchTerm, pageNumber) {
      var self = this;
      var searchTerm = searchTerm || "";
      var currentPage = pageNumber || 1;
      var searchParameters = {
        q: searchTerm,
        startPage: currentPage
      }

      this.model.fetchSearchRecords(searchParameters, searchTerm, currentPage, self);
    },

    buildRowData: function(model, searchTerm) {
      var rowView = new DMCP.Search.View.ContentSearchResultListItem({
        model: model
      });
      rowView.render(searchTerm);
      this.$searchResultDom.append($(rowView.el).html());
    },
    searchHandler: function(e) {
      var searchText = e.target.value.trim();
      this.resetLayout();
      $(".paginationSection").html("");
      $(".paginationSection").removeClass("hide");
      if (searchText.length > 1 && this.searchUrl) {
        this.render(searchText);
      }
    },

    pageRequestHandler: function(e) {
      var pageNumber = $(e.target).attr("data-pageNumber");
      var searchText = this.$searchBoxInput.val();
      this.resetLayout();
      this.render(searchText, pageNumber);
    },

    buildPagination: function(currentPage, totalPage) {
      var pageHtml, pageNumber, startPage, endPage, paginationLayoutView, paginationItemView, diff, pageParameters = {};
      $(".paginationSection").html("");
      if (totalPage <= 1) {
        return false;
      }
      paginationLayoutView = DMCP.tpl['search-list-pagination-layout-view'];
      paginationItemView = DMCP.tpl['search-list-pagination-item-view'];
      startPage = (currentPage < 5) ? 1 : currentPage - 4;
      endPage = 8 + startPage;
      endPage = (totalPage < endPage) ? totalPage : endPage;
      diff = startPage - endPage + 8;
      startPage -= (startPage - diff > 0) ? diff : 0;
      pageParameters.showPreviousLink = (startPage > 1) ? "show" : "hide";
      pageParameters.showNextLink = (endPage < totalPage) ? "show" : "hide";
      pageParameters.totalPage = totalPage;
      pageParameters.previousLinkLabel = $("<div/>").text(this.previousLinkLabel).html();
      pageParameters.nextLinkLabel = $("<div/>").text(this.nextLinkLabel).html();
      $(".paginationSection").html(paginationLayoutView(pageParameters));
      for (var i = endPage; i >= startPage; i--) {
        pageParameters.active = (currentPage * 1 === i) ? "active" : "";
        pageParameters.ariaSelected = (currentPage * 1 === i) ? "true" : "false";
        pageParameters.pageNumber = i;
        $(".pagination li:eq(0)").after(paginationItemView(pageParameters));
      }
    },

    showLoader: function() {
      var loaderTemplate = DMCP.tpl['search-list-loader'];
      $(".content-search-results-list-overlay").remove();
      $(loaderTemplate()).appendTo('.content-search-results-list');
      $('.content-search-results-list').addClass("content-search-results-list-showLoader");
    },

    hideLoader: function() {
      $(".content-search-results-list-overlay").remove();
      $('.content-search-results-list').addClass("content-search-results-list-hideLoader");
    },

    resetLayout: function() {
      this.$searchResultDom.html("");
      this.showSearchErrorMessage(false);
    },

    showSearchErrorMessage: function(showMessage) {
      if(showMessage){	
        $(".content-search-results-noResultsText").removeClass("hide");
      } else{
    	$(".content-search-results-noResultsText").addClass("hide");  
      }
    }
  });
}(jQuery);

/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Content Search Result List component.
------------------------------------------------------------------------ */

if (typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function($) {
  'use strict';
  DMCP.Search = DMCP.Search || {};
  DMCP.Search.Router = DMCP.Search.Router || {};
  DMCP.Search.Router.ContentSearchResult = DMCP.Search.Router.ContentSearchResult || {};

  DMCP.Search.Router.ContentSearchResult = Backbone.Router.extend({
    routes: {
      'search': 'searchResult'
    },
    searchResult: function() {
      var listView = new DMCP.Search.View.ContentSearchResultListLayout({
        model: new DMCP.Search.Model.ContentSearchResultList,
        collection : new DMCP.Search.Collection.ContentSearchResultList()
      })
    }
  });

  $(document).ready(function() {
    var SearchTabRouter,$SearchComponent = $('.content-search-results-list');
    if ($SearchComponent.length) {
      SearchTabRouter = new DMCP.Search.Router.ContentSearchResult();
      if(!Backbone.History.started){
    	  Backbone.history.start();
      } 
      window.location.hash = "search";
    }
  });
}(jQuery);

/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
$(document).ready(function() {
  //Setting classes on load
  var $dropdownElements = $('.column-nav-dropdown');
  //Conditionally opening elements on page load.
  $.each($dropdownElements, function(index){
	var $toggleBtn = $(this).find('.column-nav-toggle');
    if($(this).hasClass('open')) {
      $toggleBtn.removeClass('fa-plus').addClass('fa-minus');
      $toggleBtn.attr('aria-expanded', 'true');
      $toggleBtn.attr('aria-label', $toggleBtn.attr('data-collapse-label'));
    } else {
      $toggleBtn.removeClass('fa-minus').addClass('fa-plus');
      $toggleBtn.attr('aria-expanded', 'false');
      $toggleBtn.attr('aria-label', $toggleBtn.attr('data-expand-label'));
    }
  });
  //Highlighting opened elements
  var $openDropdownElements = $('.column-nav-dropdown.open');
  var $lastDropDownElement = $($openDropdownElements[$openDropdownElements.length - 1]);
  $lastDropDownElement.find('li').find('a').addClass('column-nav-highlight');
});

//Function to expand or collapse elements in column navigation
function openColumnNavNextLevel(element, event) {
  var $element = $(element);	
  var $dropdown = $element.closest('.column-nav-dropdown');
  $dropdown.toggleClass('open');
  $element.toggleClass('fa-minus fa-plus');
  if($dropdown.hasClass('open')) {
    $element.attr('aria-expanded', 'true');
    $element.attr('aria-label', $element.attr('data-collapse-label'));	
  } else {		  
    $element.attr('aria-expanded', 'false');
    $element.attr('aria-label', $element.attr('data-expand-label'));
  }  
  //Highlighting opened elements
  var $openDropdownElements = $('.column-nav-dropdown.open');
  $.each($openDropdownElements, function(index){
    if(index === $openDropdownElements.length - 1) {
      //Highlighting select elements
      $(this).find('li').find('a').addClass('column-nav-highlight');
    } else {
      //Removing hightling for other elements
      $(this).find('li').find('a').removeClass('column-nav-highlight');
    }
  });
  event.preventDefault();
}
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Child page list component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.childPageList = DMCP.childPageList || {};
  DMCP.childPageList.onload = function() {
    $(".child-page-list-expand-collapse-button").on("click",function(){
        if($(this).next().is("ol")){
			$(this).next().toggleClass("hide");
            $(this).toggleClass("fa-minus fa-plus");
            if($(this).next().hasClass("hide")){
				$(this).next().attr("aria-hidden",true);
				$(this).attr("aria-expanded",false);
            } else{
				$(this).next().attr("aria-hidden",false);
				$(this).attr("aria-expanded",true);
            }
        }
          event.preventDefault();
    });
  }
  $(document).ready( function () {
    DMCP.childPageList.onload();
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/*
 * CHANGE HISTORY:
 * Modified to add swipe effects.
 * Hide arrows in mobile view.
 */
+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.2.0'

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    //Minimum width for Tablet as per bootstrap.
    minTabletWidth: 768
  }

  Carousel.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    //Customized bootstrap to hide arrows on mouse exit of carousel
    this.$element.find('.carousel-control').removeClass('show');
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    //Customized bootstrap to show arrows on mouse over of carousel  
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	//Customized bootstrap to not show arrows on mouse over of carousel in mobile view
    if(width >= this.options.minTabletWidth) {
      this.$element.find('.carousel-control').addClass('show');
    }
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }
  
  Carousel.prototype.swipeRight = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.swipeLeft = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel-container')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
      //Added swipe events for Carousel
      $carousel.on('swipeleft',function(){
        $carousel.carousel('next');
      });
      $carousel.on('swiperight',function(){
        $carousel.carousel('prev');
      });
    })
  })

}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Accordion component.
------------------------------------------------------------------------ */
var DMCP = DMCP || {};

+function ($) {
  'use strict';
  DMCP.accordion = DMCP.accordion || {};
  DMCP.accordion.toggleSections = function ($currentElement) {

    if ($currentElement.nextAll(".accordion-panel-content").hasClass('accordion-panel-hide')) {
      $currentElement.attr("aria-selected", 'true');
      $currentElement.nextAll(".accordion-panel-content").attr("aria-hidden", 'false');
      $currentElement.find("span.fa").removeClass('fa-plus').addClass('fa-minus');
      $currentElement.nextAll(".accordion-panel-content").removeClass('accordion-panel-hide').addClass('accordion-panel-show');
      $currentElement.next(".accordion-panel-content").slideDown();

    } else {
      $currentElement.attr("aria-selected", 'false');
      $currentElement.nextAll(".accordion-panel-content").attr("aria-hidden", 'true');
      $currentElement.find("span.fa").removeClass('fa-minus').addClass('fa-plus');
      $currentElement.nextAll(".accordion-panel-content").removeClass('accordion-panel-show').addClass('accordion-panel-hide');
      $currentElement.next(".accordion-panel-content").slideUp();
    }

  }
  $(document).ready(function () {
      $(".accordion-panel-header").click(function () {
          DMCP.accordion.toggleSections($(this));
        });
    });
}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Commerce configs
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.Config = DMCP.Config || {}; 
  DMCP.Config.Commerce = {
    PURCHASE_ORDER_CONSTANT : "purchaseorder",
    CREDIT_CARD_CONSTANT : "creditcard",
    BAD_REQUEST_ERROR_STATUS : 400,
    FORBIDDEN_ERROR_STATUS : 200
  };
}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Product cart component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  var TOTAL_ITEMS_KEY = "totalItems",
  	  TOTAL_UNITS_COUNT_KEY = "totalUnitCount",
  	  TOTAL_PRICE_KEY = "totalPrice",
  	  BASE_PRICE_KEY = "basePrice",
  	  CURRENCY_ISO_KEY = "currencyIso",
  	  CURRENCY_SYMBOL_KEY = "currencySymbol",
  	  CURRENCY_VALUE_KEY = "value",
  	  ELEMENTS_ARRAY_KEY = "products",
  	  CHILD_PROD_ARRAY_KEY = "childProducts",
  	  CHILD_PROD_ID_KEY = "productId",
  	  CHILD_PROD_NAME_KEY = "productName",
  	  CHILD_PROD_QUANTITY_KEY = "quantity",
  	  CHILD_PROD_ENTRY_NO_KEY = "entryNumber",
  	  PARENT_PROD_KEY = "parentProduct",
  	  PARENT_PROD_ID_KEY = "parentProductId",
  	  PARENT_PROD_IMAGE_KEY = "parentProductImagePath",
  	  PARENT_PROD_LABEL_KEY = "parentProductLabel",
  	  PARENT_PROD_IMAGE_KEY = "parentProductImage",
  	  PARENT_PROD_NAME_KEY = "parentProductName",
  	  CART_IDENTIFIER = "cartIdentifierName";
  DMCP.Cart = DMCP.Cart || function(){};
  DMCP.Cart.prototype  = {
    getCookie : function(key){
    	return $.cookie(key);
	},
	setLocalStorage : function(key, cartData){
	  if(typeof(Storage) !== "undefined" && typeof(this.getCookie(key)) !== "undefined") {
	    localStorage.setItem(key, JSON.stringify(cartData));
	  }
	},
	getLocalStorage : function(key){
	  if(typeof(Storage) !== "undefined" && typeof(this.getCookie(key)) !== "undefined") {
	    return JSON.parse(localStorage.getItem(key));
	  } else {
	    return {}
	  }
	},
	parseResponse : function(responseString){
		var cartData = JSON.parse(responseString), value={};
		
		if(cartData.hasOwnProperty(CART_IDENTIFIER)){
			
			var cartIdentifierName = cartData[CART_IDENTIFIER];
			
			value[CART_IDENTIFIER] = cartData[CART_IDENTIFIER];
			
			if(cartData.hasOwnProperty(TOTAL_ITEMS_KEY)){
				value[TOTAL_ITEMS_KEY] = cartData[TOTAL_ITEMS_KEY];
			}
			
			if(cartData.hasOwnProperty(TOTAL_UNITS_COUNT_KEY)){
				value[TOTAL_UNITS_COUNT_KEY] = cartData[TOTAL_UNITS_COUNT_KEY];
			}
			
			if(cartData.hasOwnProperty(TOTAL_PRICE_KEY)){
				value[TOTAL_PRICE_KEY] = cartData[TOTAL_PRICE_KEY];
			}
			
			if(cartData.hasOwnProperty(BASE_PRICE_KEY)){
				value[BASE_PRICE_KEY] = cartData[BASE_PRICE_KEY];
			}
			
			
			if(cartData.hasOwnProperty(ELEMENTS_ARRAY_KEY)){
				value[ELEMENTS_ARRAY_KEY] = {};
				for(var i=0; i < cartData[ELEMENTS_ARRAY_KEY].length; i++) {
					var rawChildProd = cartData[ELEMENTS_ARRAY_KEY][i];
					
					if(rawChildProd.hasOwnProperty(PARENT_PROD_KEY) && rawChildProd[PARENT_PROD_KEY].hasOwnProperty(PARENT_PROD_ID_KEY)) {
						if(!value[ELEMENTS_ARRAY_KEY].hasOwnProperty(rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY])) {
							value[ELEMENTS_ARRAY_KEY][rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY]] = {};
						}
						value[ELEMENTS_ARRAY_KEY][rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY]][PARENT_PROD_NAME_KEY] = rawChildProd[PARENT_PROD_KEY][PARENT_PROD_NAME_KEY];
						value[ELEMENTS_ARRAY_KEY][rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY]][PARENT_PROD_IMAGE_KEY] = rawChildProd[PARENT_PROD_KEY][PARENT_PROD_IMAGE_KEY];
						
						if(!value[ELEMENTS_ARRAY_KEY][rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY]].hasOwnProperty(CHILD_PROD_ARRAY_KEY)) {
							value[ELEMENTS_ARRAY_KEY][rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY]][CHILD_PROD_ARRAY_KEY] = {};
						}
						var childProduct = {};
						childProduct[CHILD_PROD_ID_KEY] = rawChildProd[CHILD_PROD_ID_KEY];
						childProduct[CHILD_PROD_NAME_KEY] = rawChildProd[CHILD_PROD_NAME_KEY];
						childProduct[CHILD_PROD_QUANTITY_KEY] = rawChildProd[CHILD_PROD_QUANTITY_KEY];
						childProduct[CHILD_PROD_ENTRY_NO_KEY] = rawChildProd[CHILD_PROD_ENTRY_NO_KEY];
						childProduct[TOTAL_PRICE_KEY] = rawChildProd[TOTAL_PRICE_KEY];
						childProduct[BASE_PRICE_KEY] = rawChildProd[BASE_PRICE_KEY];
						
						value[ELEMENTS_ARRAY_KEY][rawChildProd[PARENT_PROD_KEY][PARENT_PROD_ID_KEY]][CHILD_PROD_ARRAY_KEY][rawChildProd[CHILD_PROD_ID_KEY]] = childProduct;
					}
				}
			}
			
			this.setLocalStorage(cartIdentifierName, value);
			
			return value;
		}
		
		
	},
	fetchCart : function(context, data, actionPath) {
		return $.ajax({
		  contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		  context: context,
		  type: 'POST',
		  url: actionPath + '.create.cartentry.html',
		  data: data});
	},
	validateQuantity : function($parentWrapper) {
		$parentWrapper.on('keydown','input',function (e) {
	      // Allow: backspace, delete, tab, escape, enter and .
	      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
	        // Allow: Ctrl+A
	        (e.keyCode == 65 && e.ctrlKey === true) ||
	        // Allow: Ctrl+C
	        (e.keyCode == 67 && e.ctrlKey === true) ||
	        // Allow: Ctrl+X
	        (e.keyCode == 88 && e.ctrlKey === true) ||
	        // Allow: home, end, left, right
	        (e.keyCode >= 35 && e.keyCode <= 39)) {
	          // let it happen, don't do anything
	          return;
	      }
	      // Ensure that it is a number and stop the keypress
	      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	        e.preventDefault();
	      }
	    });
	  }
  };
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________
	
	Shopping cart component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  var selectedChildDefer,
  	  UPDATE_CART_KEY = "updateCart",
  	  DELETE_CART_ENTRY_KEY = "deleteCartEntry",
  	  SCREEN_SM_MIN = 768;
  
  if(typeof DMCP.ShoppingCart  === 'undefined') {
	DMCP.ShoppingCart = function(){DMCP.Cart.call(this);};
	DMCP.ShoppingCart.prototype = Object.create(DMCP.Cart.prototype);
	DMCP.ShoppingCart.constructor = DMCP.ShoppingCart;
  }
  //Function to store new cart data into local storage
  DMCP.ShoppingCart.prototype.updateShoppingCartSuccessHandler = function (success) {
	this[0].parseResponse(success[0]);
	location.reload(true);
  };
  //Function to show error message when there is an error in processing update/remove request
  DMCP.ShoppingCart.prototype.updateShoppingCartErrorHandler = function () {
	$('.shopping-cart-error-message').addClass('has-error');  
  }
  //Fuction to get details of product to be updated and call service to update it
  DMCP.ShoppingCart.prototype.updateShoppingCartClickHandler = function ($updateCartBtn, actionType) {
	var $childProduct = $updateCartBtn.closest('tr'),
		childProductId = $childProduct.attr('data-product-id'),
        entryNumber = $childProduct.attr('data-entry-number'),
	  	quantity = $childProduct.find('input').val(),
	  	parentId = $childProduct.attr('data-parent-id'),
	  	productGroupImageKey = $childProduct.attr('data-parent-image-key'),
	  	actionPath = $childProduct.attr('data-action-path');
	$('.shopping-cart-error-message').removeClass('has-error');
	selectedChildDefer = $.Deferred();
	selectedChildDefer.resolve({parentId: parentId, $childProduct: $childProduct, childProductId: childProductId});
	if (actionType === UPDATE_CART_KEY && quantity != 0) {
	  $.when(this.fetchCart(this, {actionType:actionType, parentProductId:parentId, quantity:quantity, productId:childProductId, entryNumber:entryNumber, productGroupImageKey:productGroupImageKey}, actionPath), selectedChildDefer).done(this.updateShoppingCartSuccessHandler).fail(this.updateShoppingCartErrorHandler);
	}
	else if (actionType === DELETE_CART_ENTRY_KEY){
	  $.when(this.fetchCart(this, {actionType:actionType, parentProductId:parentId, productId:childProductId, entryNumber:entryNumber, productGroupImageKey:productGroupImageKey}, actionPath), selectedChildDefer).done(this.updateShoppingCartSuccessHandler).fail(this.updateShoppingCartErrorHandler);
	}
  };
  
  $(document).ready(function () {
	var ShoppingCart = new DMCP.ShoppingCart();
	//Function to ensure only positive integers can be entered in quantity field
	ShoppingCart.validateQuantity($('.shopping-cart'));
	//In mobile, call function to update cart when quantity field is changed
	$('.shopping-cart input').change(function() {
	  if($(window).width() < SCREEN_SM_MIN) {
		ShoppingCart.updateShoppingCartClickHandler($(this), UPDATE_CART_KEY);
	  }	
	});
	//Call function to update cart when update button is clicked
	$('.shopping-cart-product-update').click(function(){
		ShoppingCart.updateShoppingCartClickHandler($(this), UPDATE_CART_KEY);
	});
	//Call function to delete product from cart when delete button is clicked
	$('.shopping-cart-product-delete').click(function(){
		ShoppingCart.updateShoppingCartClickHandler($(this), DELETE_CART_ENTRY_KEY);
	});
  });
}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Product search results sort component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {}; + function($) {
  'use strict';
  DMCP.productSearchResultsSort = DMCP.productSearchResultsSort || {};
  DMCP.productSearchResultsSort.sortChangeHandler = function($sortDropdown) {
    $sortDropdown.closest('form').submit();
  }
  $(document).ready(function() {
    $('.product-search-results-sort-dropdown , .product-search-results-sort-btn').change(function() {
      DMCP.productSearchResultsSort.sortChangeHandler($(this));
    });
  });
}(jQuery);

/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Product search results list component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.productSearchResultsList = DMCP.productSearchResultsList || {};
  DMCP.productSearchResultsList.sortChangeHandler = function($sortDropdown) {
	$sortDropdown.closest('form').submit();
  }
  $(document).ready(function () {
    $('.product-search-results-list-sort').change(function() {
      DMCP.productSearchResultsList.sortChangeHandler($(this));
    });
  });
}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
/*
 * CHANGE HISTORY:
 * Modified to add swipe effects.
 * Added logic to manage arrows.
 * 
 */
+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var imageGallery = function (element, options) {
    this.$element    = $(element).on('keydown.bs.product-image-gallery', $.proxy(this.keydown, this))
    this.$indicators = this.$element.find('.product-image-gallery-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    = false
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter.bs.product-image-gallery', $.proxy(this.pause, this))
      .on('mouseleave.bs.product-image-gallery', $.proxy(this.cycle, this))
  }

  imageGallery.VERSION  = '3.2.0'

  imageGallery.DEFAULTS = {
    interval: false,
    pause: 'hover',
    wrap: true
  }

  imageGallery.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }
  

  imageGallery.prototype.activeArrows = function ($element) {
    var $activeImage = $element.find('.item.active');
	if(!$activeImage.is(':only-child')) {
      if($activeImage.is(':last-child')) {
    	$element.find('.right.product-image-gallery-control').removeClass('show').siblings('.left').addClass('show');
      } else if($activeImage.is(':first-child')) {
    	$element.find('.left.product-image-gallery-control').removeClass('show').siblings('.right').addClass('show');
      } else {
    	$element.find('.product-image-gallery-control').addClass('show');
      }
    }
  }

  imageGallery.prototype.manageArrows = function (event) {
    if(this.$element.parents('.product-image-gallery-modal').length) {
	  this.activeArrows(this.$element);
    } else {
	  if(event === 'MOUSEENTER') {
		this.activeArrows(this.$element);
		this.$element.find('.product-image-gallery-modal-icon').addClass('show');
	  } else if(event === 'MOUSELEAVE') {
		this.$element.find('.product-image-gallery-control, .product-image-gallery-modal-icon').removeClass('show');
	  }
    }
  }

  imageGallery.prototype.cycle = function (e) {
	this.manageArrows('MOUSELEAVE');
	  
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  imageGallery.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  imageGallery.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.product-image-gallery', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  imageGallery.prototype.pause = function (e) {
	this.manageArrows('MOUSEENTER');
	  
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }
  
  imageGallery.prototype.swipeRight = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  imageGallery.prototype.swipeLeft = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  imageGallery.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  imageGallery.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  imageGallery.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.product-image-gallery', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.product-image-gallery', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()
    this.manageArrows('MOUSEENTER');
    
    var $swipeImage = this.$element.find('.swipe-image')
    if ($swipeImage.length) {
      if(!($swipeImage.css('display') === 'none')) {
        $swipeImage.hide();  
      }
    }
    
    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.product-image-gallery')
      var options = $.extend({}, imageGallery.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.product-image-gallery', (data = new imageGallery(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.imageGallery

  $.fn.imageGallery             = Plugin
  $.fn.imageGallery.Constructor = imageGallery


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.imageGallery.noConflict = function () {
    $.fn.imageGallery = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.product-image-gallery.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('product-image-gallery-container')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.product-image-gallery').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="product-image-gallery"]').each(function () {
      var $imageGallery = $(this)
      Plugin.call($imageGallery, $imageGallery.data())
      //Added swipe events for Carousel
      $imageGallery.on('swipeleft',function(){
        $imageGallery.imageGallery('next');
      });
      $imageGallery.on('swiperight',function(){
        $imageGallery.imageGallery('prev');
      });
    })
  })

}(jQuery);
/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Image gallery component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  DMCP.imageGallery = DMCP.imageGallery || {};
  //Method to align arrows
  DMCP.imageGallery.alignArrows = function ($imageGallery) {
    var galleryHeight = $imageGallery.find('.product-image-gallery-inner').height();
    var arrowsHeight = $imageGallery.find('.product-image-gallery-control').outerHeight();
    var swipeImage = $imageGallery.find('.swipe-image');
    if(galleryHeight){
      $imageGallery.find('.product-image-gallery-control').css('top', galleryHeight/2-arrowsHeight/2+'px');
    }
    if(swipeImage.length){
      swipeImage.css('height', galleryHeight+'px');
    }
  }
  //Method to close modal popup
  DMCP.imageGallery.closeModal = function ($targetModal) {
    $targetModal.attr('aria-hidden', 'true');
    $targetModal.dialog( "close" );
    $targetModal.find('.product-image-gallery').empty();
    $(".close").off('click');
    $(".ui-widget-overlay").off('click');
  }
//Method to open modal popup
  DMCP.imageGallery.openModal = function (targetElement) {
    var $this = targetElement;
    var $modal = $($this.attr('data-target'));
    var $gallery = $($this.attr('data-gallery'));
    var $galleryClone = $gallery.clone();
    var galleryCloneId = $galleryClone.attr('id')+'-clone';
    $galleryClone.attr('tabindex', 2);
    $galleryClone.removeClass("visible-xs-block");
    $galleryClone.attr('id',galleryCloneId);
    $galleryClone.find('.product-image-gallery-control').attr('href','#'+galleryCloneId);
    $galleryClone.find('.product-image-gallery-indicators li').attr('data-target','#'+galleryCloneId);

    $modal.dialog({
      autoOpen: false,
      modal: true,
      dialogClass: 'product-image-gallery-modal-container',
      close: function () {
        DMCP.imageGallery.closeModal($modal);
      }
    });
    $modal.dialog( "open" );
    $modal.attr('aria-hidden', 'false');
    //Removing jquery UI added containers
    $modal.parent().find('.ui-dialog-titlebar').remove();
    $modal.parent().find('.ui-resizable-handle').remove();
    //Setting focus on modal by default
    $modal.parent().focus();
    $modal.find('.product-image-gallery').append($galleryClone);

    $modal.find( ".close" ).on('click', function(){
      DMCP.imageGallery.closeModal($modal);
    });
    $( ".product-image-gallery-modal-container+.ui-widget-overlay, .product-image-gallery-modal-container .product-image-gallery ul" ).on('click',function(e){
      if( e.target !== this ) {
        return;
      }
      DMCP.imageGallery.closeModal($modal);
    });
    
    $('.product-image-gallery-modal-container .item:last-child img').load(function(){
      DMCP.imageGallery.alignArrows($galleryClone);
    });
  }
  $(document).on('click', "[data-open='product-image-gallery']", function () {
    DMCP.imageGallery.openModal($(this));
  });
  $(document).on('click', '.product-image-gallery .swipe-image', function () {
    $(this).hide(); 
  });
  var $imageGallery;
  $(document).ready(function(){
    $imageGallery = $('.product-image-gallery');
  });
  $(window).load(function(){
	if($imageGallery.length) {
	  $imageGallery.each(function() {
		if(!$(this).is(':empty')) {
		  DMCP.imageGallery.alignArrows($(this));
		}
      });
	}
  });
  $(window).resize(function(){
    if($imageGallery.length){
    	$imageGallery.each(function(){
        DMCP.imageGallery.alignArrows($(this));
      });
    }
  });
}(jQuery);
/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Product facets component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+ function($) {
  'use strict';
  DMCP.productFacets = DMCP.productFacets || {};
  DMCP.productFacets.toggleHandler = function($currentElement) {
    event.preventDefault();
    $currentElement.parent("div").find(".product-facets-group-list").slideToggle();
    $currentElement.find("span").toggleClass("fa-chevron-down fa-chevron-up");
      if($currentElement.find("span").hasClass("fa-chevron-up")){
		$currentElement.find("a").attr("aria-selected","true");
        $currentElement.closest("div").find("ul").attr("aria-hidden", "false");
	  } else {
          $currentElement.find("a").attr("aria-selected","false");
          $currentElement.closest("div").find("ul").attr("aria-hidden", "true");
      }
  }
  DMCP.productFacets.listSelectedItemHandler = function() {
    var $selectedFacets = $(".product-facets-group-list li a.selected"),
      listHtml = "",
      deleteBtnHtml = "",
      deleteUrl = "",
      listData = "";
    $selectedFacets.each(function(index) {
      deleteUrl = $(this).attr("href");
      listData = $(this).attr("facet");
      deleteBtnHtml = "<a aria-label ='Delete @i18n' class='product-facets-selected-delete-icon' href='" + deleteUrl + "'></a>";
      listHtml = "<li class='product-facets-selected-list-item'><div class='product-facets-selected-title'>" + listData + "</div> " + deleteBtnHtml + " </li>";
      $(".product-facets-selected-list").append(listHtml);
    });
  }
  $(document).ready(function() {
    DMCP.productFacets.listSelectedItemHandler();
    $(".product-facets-group-header").click(function() {
      DMCP.productFacets.toggleHandler($(this));
    });
  });
}(jQuery);

/* ---------------------------------------------------------------------
       PEARSON MARKETING CLOUD
       _______________________

       Mini-cart component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  var selectedChildDefer,
     TOTAL_UNITS_COUNT_KEY = "totalUnitCount",
     ELEMENTS_ARRAY_KEY = "products",
     PARENT_PROD_NAME_KEY = "parentProductName",
     PARENT_PROD_IMAGE_KEY = "parentProductImage",
     CHILD_PROD_ID_KEY = "productId",
     CHILD_PROD_ARRAY_KEY = "childProducts",
     CHILD_PROD_NAME_KEY = "productName",
     CHILD_PROD_ENTRY_NO_KEY = "entryNumber",
     CURRENCY_ISO_KEY = "currencyIso",
     CURRENCY_VALUE_KEY = "value",
     CURRENCY_SYMBOL_KEY = "currencySymbol",
     CHILD_PROD_QUANTITY_KEY = "quantity",
     TOTAL_PRICE_KEY = "totalPrice",
     BASE_PRICE_KEY = "basePrice",
     CART_IDENTIFIER = "cartIdentifierName",
     $cart = $('.mini-cart'),
     $childHTML = "",
     $parentHTML = "";
  if(typeof DMCP.MiniCart  === 'undefined') {
       DMCP.MiniCart = function(){DMCP.Cart.call(this);};
       DMCP.MiniCart.prototype = Object.create(DMCP.Cart.prototype);
       DMCP.MiniCart.constructor = DMCP.MiniCart;
  }
  DMCP.MiniCart.prototype.updateCartSuccessHandler = function(success, selectedChildDetails) {
       var cartData = this[0].parseResponse(success[0]);
       if(typeof cartData !=='undefined' && cartData.hasOwnProperty(CART_IDENTIFIER)) {
             this[0].setCartContent(cartData);
             var childProductList = new DMCP.ChildProductList();
             childProductList.updateSuccessMessage(cartData);
       } else {
             this[0].setCartContent(cartData);
       }
  };
  DMCP.MiniCart.prototype.updateCartErrorHandler = function(error, selectedChildDetails){
         
  };
  DMCP.MiniCart.prototype.removeProduct = function($selectedContext) {
         var $childProduct = $selectedContext.closest('li'),
             childProductId = $childProduct.find('.code').text(),
              parentId = $childProduct.attr('data-parent-id'),
              entryNumber = $childProduct.attr('data-entry-number').toString(),
              productGroupImageKey = $('.mini-cart-dropdown').attr('data-product-image-key'),
              actionPath = $childProduct.closest('.mini-cart-list').attr('data-action-path');
         selectedChildDefer = $.Deferred();
         selectedChildDefer.resolve({parentId: parentId, $childProduct: $childProduct, childProductId: childProductId});
         $.when(this.fetchCart(this, {actionType:"deleteCartEntry",parentProductId:parentId,productId:childProductId,entryNumber:entryNumber,productGroupImageKey:productGroupImageKey}, actionPath), selectedChildDefer).done(this.updateCartSuccessHandler).fail(this.updateCartErrorHandler);
  };
  DMCP.MiniCart.prototype.updateQuantity = function($quantityField, quantity){
         var $childProduct = $quantityField.closest('li'),
             childProductId = $childProduct.find('.code').text(),
              parentId = $childProduct.attr('data-parent-id'),
              entryNumber = $childProduct.attr('data-entry-number').toString(),
              productGroupImageKey = $('.mini-cart-dropdown').attr('data-product-image-key'),
              actionPath = $childProduct.closest('.mini-cart-list').attr('data-action-path');
         if (quantity != 0) {
               selectedChildDefer = $.Deferred();
               selectedChildDefer.resolve({parentId: parentId, $childProduct: $childProduct, childProductId: childProductId});
               $.when(this.fetchCart(this, {actionType:"updateCart",parentProductId:parentId,quantity:quantity,productId:childProductId,entryNumber:entryNumber,productGroupImageKey:productGroupImageKey}, actionPath), selectedChildDefer).done(this.updateCartSuccessHandler).fail(this.updateCartErrorHandler);
         }
  };
  DMCP.MiniCart.prototype.setCartContent = function(cartData) {
       $('.mini-cart-list').empty();
       $('.mini-cart-total-item-count').text(cartData[TOTAL_UNITS_COUNT_KEY]);
       if(cartData[TOTAL_UNITS_COUNT_KEY] == 0) {
             $('.mini-cart-dropdown.active').slideUp().removeClass("active");
             $('.mini-cart-dropdown').addClass('disabled');
             $('.mini-cart-single-item-label').hide();
             $('.mini-cart-multi-item-label').show();
             $('.mini-cart-delimiter').hide();
       }
       else if(cartData[TOTAL_UNITS_COUNT_KEY] > 1) {
             $('.mini-cart-dropdown').removeClass('disabled');
             $('.mini-cart-single-item-label').hide();
             $('.mini-cart-multi-item-label').show();
             $('.mini-cart-delimiter').show();
       }
       else {
             $('.mini-cart-dropdown').removeClass('disabled');
           $('.mini-cart-multi-item-label').hide();
           $('.mini-cart-single-item-label').show();
           $('.mini-cart-delimiter').show();
       }
       $('.mini-cart-total-price').text(cartData[TOTAL_PRICE_KEY]);
       var $parentHTMLStr = "";
       for (var parentProduct in cartData[ELEMENTS_ARRAY_KEY]) {
             $parentHTMLStr = $parentHTML.clone()[0].outerHTML.toString();
             if(typeof cartData[ELEMENTS_ARRAY_KEY][parentProduct][PARENT_PROD_IMAGE_KEY] !== 'undefined'){
               $parentHTMLStr = $parentHTMLStr.replace('parent-image-path', 'src="' + cartData[ELEMENTS_ARRAY_KEY][parentProduct][PARENT_PROD_IMAGE_KEY].toString() + '"');
               $parentHTMLStr = $parentHTMLStr.replace('image-alt-text', 'alt="' + cartData[ELEMENTS_ARRAY_KEY][parentProduct][PARENT_PROD_NAME_KEY].toString() + '"');
             }
             $parentHTMLStr = $parentHTMLStr.replace('parentTitle', cartData[ELEMENTS_ARRAY_KEY][parentProduct][PARENT_PROD_NAME_KEY].toString());
             var $childHTMLStr = "";
             for(var childProduct in cartData[ELEMENTS_ARRAY_KEY][parentProduct][CHILD_PROD_ARRAY_KEY]) {
                    var $singleChildHTMLStr = $childHTML.clone()[0].outerHTML.toString();
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('dataParentProduct', parentProduct);
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('entryNumber', cartData[ELEMENTS_ARRAY_KEY][parentProduct][CHILD_PROD_ARRAY_KEY][childProduct][CHILD_PROD_ENTRY_NO_KEY].toString());
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('attributeTitle', cartData[ELEMENTS_ARRAY_KEY][parentProduct][CHILD_PROD_ARRAY_KEY][childProduct][CHILD_PROD_NAME_KEY].toString());
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('productCode', cartData[ELEMENTS_ARRAY_KEY][parentProduct][CHILD_PROD_ARRAY_KEY][childProduct][CHILD_PROD_ID_KEY].toString());
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('productPriceValue', cartData[ELEMENTS_ARRAY_KEY][parentProduct][CHILD_PROD_ARRAY_KEY][childProduct][BASE_PRICE_KEY].toString());
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('productCount', cartData[ELEMENTS_ARRAY_KEY][parentProduct][CHILD_PROD_ARRAY_KEY][childProduct][CHILD_PROD_QUANTITY_KEY].toString());
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('value=""', '');
                    $singleChildHTMLStr = $singleChildHTMLStr.replace('data-value', 'value');
                    $childHTMLStr+= $singleChildHTMLStr;
             }
           if(typeof $('.mini-cart-dropdown').attr('data-disable-product-grouping') === 'undefined') {
              $parentHTMLStr = $parentHTMLStr.replace("childProductItem",$childHTMLStr.toString());
                 $('.mini-cart-list').append($parentHTMLStr);
           } else {
               $('.mini-cart-list').addClass('mini-cart-child-product-list').append($childHTMLStr);
           }
       }
  };
  
  $(document).ready(function () {
	if($('.mini-cart').length) {
	   var MiniCart = new DMCP.MiniCart();
	   $childHTML = $('.mini-cart-child-html');
	     $parentHTML = $('.mini-cart-parent-html');
	   //Create mini cart by fetching data from local storage
	   var cartIdentifierName = $('.mini-cart-dropdown').attr('data-cart-identifier-name'),
	   	   cartId = MiniCart.getCookie(cartIdentifierName);
       if(typeof cartId !== 'undefined') {
             var cartData = MiniCart.getLocalStorage(cartIdentifierName);
             if(cartData !== null) {
                    if(cartData.hasOwnProperty(CART_IDENTIFIER)) {
                           MiniCart.setCartContent(cartData);
                    }
             }
       }
       else {
             $('.mini-cart-single-item-label').hide();
             $('.mini-cart-delimiter').hide();
       }
       //Attach click events to mini cart according to desired behavior
       //Show or hide cart when the uppermost button with summary is clicked on
       $('.mini-cart-button').click(function(event){
             event.stopPropagation();
             if($('.mini-cart-dropdown.active').length) {
                 $('.mini-cart-dropdown.active').slideUp().removeClass("active");
             }
             else {
                 $('.mini-cart-dropdown:not(.disabled)').slideDown().addClass("active");
             }
       });
       $('.mini-cart-dropdown, .mini-cart-checkout').click(function(event){
             event.stopPropagation();
       });
       //Hide mini cart if user clicks anywhere else on the page
       $(document).click(function(){
             $('.mini-cart-dropdown.active').slideUp().removeClass("active");
       });
       //Call function to ADD 1 to product quantity when "+" is clicked
       $('.mini-cart-list').on('click', '.mini-cart-add', function() {
             var $quantityField = $(this).next(),
                    quantity = $quantityField.val();
             $quantityField.attr("disabled","disabled");
             quantity++;
             MiniCart.updateQuantity($quantityField, quantity);
       });
       //Call function to SUBTRACT 1 from product quantity when "-" is clicked
       $('.mini-cart-list').on('click', '.mini-cart-subtract', function() {
             var $quantityField = $(this).prev(),
                    quantity = $quantityField.val();
             //dont subtract if quantity is 1
             if(quantity > 1){
                    $quantityField.attr("disabled","disabled");
                    quantity--;
                    MiniCart.updateQuantity($quantityField, quantity);
             }      
       });
       //Call function to UPDATE product quantity when it is changed from mini cart quantity field
       $('.mini-cart-list').on('change', 'input', function() {
             var $quantityField = $(this),
                    quantity = $quantityField.val();
             if(quantity > 0) {
                    $quantityField.attr("disabled","disabled");
                    MiniCart.updateQuantity($quantityField, quantity);
             }      
             else {
                    MiniCart.removeProduct($(this));
             }
       });
       //Call function to REMOVE product from cart when delete button is clicked
       $('.mini-cart-list').on('click', '.mini-cart-product-delete', function() {
             MiniCart.removeProduct($(this));
       });
       //Function to ensure only positive integers can be entered in quantity field
       MiniCart.validateQuantity($('.mini-cart'));
	}
  });
}(jQuery);

/* ---------------------------------------------------------------------
PEARSON MARKETING CLOUD
_______________________

Child products list component.
------------------------------------------------------------------------ */

var DMCP = DMCP || {};
+function ($) {
  'use strict';
  var selectedChildDefer,
  	  TOTAL_ITEMS_KEY = "totalItems",
	  TOTAL_PRICE_KEY = "totalPrice",
	  CURRENCY_ISO_KEY = "currencyIso",
	  CURRENCY_VALUE_KEY = "value",
	  ELEMENTS_ARRAY_KEY = "products",
	  CHILD_PROD_ARRAY_KEY = "childProducts",
	  CHILD_PROD_ID_KEY = "productId",
	  CHILD_PROD_NAME_KEY = "productName",
	  CHILD_PROD_QUANTITY_KEY = "quantity",
	  PARENT_PROD_KEY = "parentProduct",
	  PARENT_PROD_ID_KEY = "parentProductId",
	  PARENT_PROD_IMAGE_KEY = "parentProductImagePath",
	  PARENT_PROD_LABEL_KEY = "parentProductLabel",
	  CART_IDENTIFIER = "cartIdentifierName";
  
  if(typeof DMCP.ChildProductList  === 'undefined') {
	DMCP.ChildProductList = function(){DMCP.Cart.call(this);};
	DMCP.ChildProductList.prototype = Object.create(DMCP.Cart.prototype);
	DMCP.ChildProductList.constructor = DMCP.ChildProductList;
  }
  DMCP.ChildProductList.prototype.addSuccessMessage = function(cartData, selectedChildDetails){
	  var $childProduct = selectedChildDetails.$childProduct,
	  	successMsg = $childProduct.parent().attr("data-success-msg"),
	  	viewCartLabel = $childProduct.parent().attr("data-view-cart-label"),
	  	parentId = selectedChildDetails.parentId,
	  	childProductId = selectedChildDetails.childProductId,
	  	$addToCartIcon = selectedChildDetails.$addToCartIcon,
	  	cartLinkPath = $childProduct.parent().attr("data-cart-page-link"),
	  	notification = 
		  "<div class='child-product-list-message success'>" + 
		  	"<p class='message-title'>" + successMsg + "</p>" + 
		  	"<p>" + cartData[ELEMENTS_ARRAY_KEY][parentId][CHILD_PROD_ARRAY_KEY][childProductId].quantity + 
		  		" x " + cartData[ELEMENTS_ARRAY_KEY][parentId][CHILD_PROD_ARRAY_KEY][childProductId].productName + "</p>" + 
		  	"<a href='" + cartLinkPath + "' class='submit-button'>" + viewCartLabel + "<span class='fa fa-shopping-cart'></span></a>" + 
		  "</div>";
		$childProduct.find('.child-product-list-message').remove();
		$childProduct.append(notification);
		$addToCartIcon.removeClass('fa-spinner icon-spin').addClass('fa-shopping-cart');
  };
  DMCP.ChildProductList.prototype.addErrorMessage = function($childProduct, $addToCartIcon){
	  var $dataContainer = $('.child-product-list-item'),
  	  errorLabel = $dataContainer.attr("data-error-msg"),
  	  errorMsg = $dataContainer.attr("data-error-details"),
  	  viewCartLabel = $dataContainer.attr("data-view-cart-label"),
  	  cartLinkPath = $childProduct.parent().attr("data-cart-page-link"),
  	  notification = 
  		  "<div class='child-product-list-message error'>" + 
  		  	"<p class='message-title'>" + errorLabel + "</p>" + 
  		  	"<p>" + errorMsg + "</p>" + 
  		  	"<a href='" + cartLinkPath + "' class='submit-button'>" + viewCartLabel + "<span class='fa fa-shopping-cart'></span></a>" + 
  		  "</div>";
	  $childProduct.find('.child-product-list-message.error').remove();
	  $childProduct.append(notification);
	  $addToCartIcon.removeClass('fa-spinner icon-spin').addClass('fa-shopping-cart');
  };
  DMCP.ChildProductList.prototype.addToCartSuccessHandler = function(success, selectedChildDetails) {
	var cartData = this[0].parseResponse(success[0]);
	if(typeof cartData !=='undefined' && cartData.hasOwnProperty(CART_IDENTIFIER)) {
		this[0].addSuccessMessage(cartData, selectedChildDetails);
		if($('.mini-cart').length) {
		    var miniCart = new DMCP.MiniCart();
		    miniCart.setCartContent(cartData); 
		}
	}
  };
  DMCP.ChildProductList.prototype.addToCartClickHandler = function($addToCartBtn){
	var $childProduct = $addToCartBtn.closest('li'),
		$childProductTitle = $addToCartBtn.closest('.child-product-list-item'),
		childProductId = $childProduct.find('.code').text(),
	  	quantity = $childProduct.find('.quantity').val(),
	  	parentId = $childProductTitle.attr('data-parent-id'),
	  	productGroupImageKey = $('.mini-cart-dropdown').attr('data-product-image-key'),
	  	$addToCartIcon = $childProduct.find('.add-to-cart span'),
	  	actionPath = $childProductTitle.attr('data-action-path');
	if (quantity != 0) {
	  selectedChildDefer = $.Deferred();
	  selectedChildDefer.resolve({parentId: parentId, $childProduct: $childProduct, childProductId: childProductId, $addToCartIcon: $addToCartIcon});
	  $addToCartIcon.removeClass('fa-shopping-cart').addClass('fa-spinner icon-spin');
	  $.when(this.fetchCart(this, {actionType:"addToCart",parentProductId:parentId,quantity:quantity,productId:childProductId,productGroupImageKey:productGroupImageKey}, actionPath), selectedChildDefer).done(this.addToCartSuccessHandler).fail(function(error){this.addErrorMessage($childProduct, $addToCartIcon);});
	}
  };
  DMCP.ChildProductList.prototype.updateSuccessMessage = function(cartData){
	  var childProductList = this;
	  $('.child-product-list-item').each(function(index){
			var parentProductId = $(this).attr('data-parent-id');
			if(cartData[ELEMENTS_ARRAY_KEY].hasOwnProperty(parentProductId)) {
				$(this).find('li').each(function(){
					var childProductId = $(this).find('.code').text(),
						$addToCartIcon = $(this).find('.add-to-cart span');
					if(cartData[ELEMENTS_ARRAY_KEY][parentProductId][CHILD_PROD_ARRAY_KEY].hasOwnProperty(childProductId)) {
						childProductList.addSuccessMessage(cartData, {parentId: parentProductId, $childProduct: $(this), childProductId: childProductId, $addToCartIcon: $addToCartIcon})
					}
					else {
						$(this).find('.child-product-list-message').remove();
					}
				});
			}
			else {
				$('.child-product-list').find('.child-product-list-message').remove();
			}
		}); 
  };
   
  $(document).ready(function () {
	var childProductList = new DMCP.ChildProductList();
	$('.add-to-cart').click(function(){
	  childProductList.addToCartClickHandler($(this));
	});
	childProductList.validateQuantity($('.child-product-list'));
	
	var cartIdentifierName = $('.child-product-list-item').attr('data-cart-identifier-name'),
		cartId = childProductList.getCookie(cartIdentifierName);
	if(typeof cartId !== 'undefined') {
		var cartData = childProductList.getLocalStorage(cartIdentifierName);
		if(cartData !== null) {
			if(cartData.hasOwnProperty(CART_IDENTIFIER)) {
				childProductList.updateSuccessMessage(cartData);
			}
		}
	}
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Model
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Model = DMCP.Checkout.Model || {};
  
  DMCP.Checkout.Model.Container = Backbone.Model.extend({
    defaults: {
	  orderSummary: {},
	  paymentModes: {}
    },
  
    setDetails: function(key, data) {
      var map = {};
      map[key] = data ? data : '';
	  this.set(map);
    },
    
    getDetails: function(key) {
      return this.get(key) ? this.get(key) : '';
    }
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Model
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Model = DMCP.Checkout.Model || {};
  
  DMCP.Checkout.Model.DeliveryDetails = Backbone.Model.extend({
    successCount: 0,
    
    containerModel: null,
    
    initialize: function(model, containerModel) {
      this.containerModel = containerModel;
    },
  
    setDetails: function(element, formType) {
	  this.set({
	    titleCode : element.find('#'+formType+'Title').val(),
	    firstName : element.find('#'+formType+'FirstName').val(),
	    lastName : element.find('#'+formType+'LastName').val(),
	    countryCode : element.find('#'+formType+'CountryCode').val(),
	    phone : element.find('#'+formType+'PhoneNumber').val(),
	    companyName : element.find('#'+formType+'OrganisationName').val(),
	    hideEmail : (element.find('#'+formType+'EmailAddress').length ? 'false' : 'true'),
	    email : (element.find('#'+formType+'EmailAddress').length ? element.find('#'+formType+'EmailAddress').val() : ''),
	    line1 : element.find('#'+formType+'AddressLine1').val(),
	    line2 : element.find('#'+formType+'AddressLine2').val(),
	    town : element.find('#'+formType+'City').val(),
	    countyOrRegion: element.find('.show .addressCountyRegion').val(),
	    regionIsoCode: (element.find('.show .addressCountyRegion').val()=="region" ? element.find('#'+formType+'Region').val() : ''),
	    county: (element.find('.show .addressCountyRegion').val()=="county" ? element.find('#'+formType+'County').val() : ''),
	    postalCode : element.find('#'+formType+'PostalCode').val(),
	    countryIsoCode : element.find('#'+formType+'Country').val(),
	    '_charset_':'UTF-8'
      });
    },
    
    sendFormData: function(element,formType) {
      $.ajax({
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    context: this,
	    type: 'POST',
	    dataType: 'json',
	    url: window.location.pathname.replace('.html','.'+formType+'.html'),
	    data: this.attributes
      })
	  .done(this.success)
      .fail(function(error){
	    element.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
        if(error.status === DMCP.Config.Commerce.BAD_REQUEST_ERROR_STATUS && error.hasOwnProperty('responseJSON')) {
	      var fields = error.responseJSON[0];
	      for (var field in fields) {
	        fields[field] = fields[field].replace("[","").replace("]","");
	        window.ParsleyUI.addError(element.find('[name="'+field+'"]').parsley(), 'serverError', fields[field]);
	      }
        }
        else if (error.status === DMCP.Config.Commerce.FORBIDDEN_ERROR_STATUS && error.getResponseHeader("Content-Type").toLowerCase().indexOf("text/html") >= 0) {
  	      location.reload(true);
  	    }
        else {
          element.closest('.checkout-process-container').find('.checkout-process-container-error-message').addClass('has-error');
        }
      });
    },
    
    success: function(success) {
	  this.successCount++;
	  if(success.region!=null) {
        this.set({
	      'regionIsoCode' : success.region.name
        });
      }
      this.set({
        'titleCode' : success.title.label,
        'countryIsoCode' : success.country.name,
        'successDetails' : this.successCount
      });
      this.containerModel.setDetails('deliveryModes',success.deliveryModes);
    },
  
    fetchProvinces: function(currentCountry, successHandler, errorHandler, context) {
      $.ajax({
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    context: context,
	    type: 'POST',
	    dataType: 'json',
	    url: window.location.pathname.replace('.html','.genericlist.json'),
        data: {
          type: 'state/'+currentCountry
        }
      })
	  .done(successHandler)
	  .fail(errorHandler);
    }
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Model
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Model = DMCP.Checkout.Model || {};
  
  DMCP.Checkout.Model.DeliveryOptions = Backbone.Model.extend({
    successCount: 0,
    
    containerModel: null,
    
    initialize: function(model, containerModel) {
      this.containerModel = containerModel;
    },
    
    setDeliveryMode: function(object) {
	  var deliveryModeId = '',
		  deliveryInstructions = undefined,
		  other = false;
	  if(typeof object.find('input[name="deliveryOptions"]:checked').val() !== undefined) {
	    deliveryModeId = object.find('input[name="deliveryOptions"]:checked').val();
	  }
	  if (object.find('input[name="deliveryOptions"]:checked').attr("data-is-other") === "true") {
	    deliveryInstructions = object.find('textarea').val();
	    other = true;
	  }
	  $.ajax({
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    context: this,
	    type: 'POST',
	    dataType: 'json',
	    url: window.location.pathname.replace('.html','.deliveryOptions.html'),
        data: {
    	  deliveryModeId: deliveryModeId,
    	  deliveryInstructions: deliveryInstructions,
    	  other: other,
    	  '_charset_':'UTF-8'
        }
      })
	  .done(function(success){
		this.successCount++;
		this.containerModel.setDetails('selectedDeliveryMode', success.deliveryMode);
		this.set({
		  'successOptions':this.successCount,
		});
	  })
	  .fail(function(error){
		var errorMessage = '';
		$('.checkout-process-container-delivery-options button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
		if(error.status === DMCP.Config.Commerce.BAD_REQUEST_ERROR_STATUS && error.hasOwnProperty('responseJSON')) {
		  for(var i = 0; i < error.responseJSON.length; i++) {
			if(error.responseJSON[i].hasOwnProperty('deliveryModeId')) {
			  errorMessage = error.responseJSON[i].deliveryModeId.replace("[","").replace("]","");
	  		  window.ParsleyUI.addError($('input[name="deliveryOptions"]').parsley(), 'serverError', errorMessage);
	  		}
	  		else {
	  		  errorMessage = error.responseJSON[i].deliveryInstructions.replace("[","").replace("]","");
	  		  window.ParsleyUI.addError($('.delivery-options-form textarea').parsley(), 'serverError', errorMessage);
	   		}
		  }
		}
		else if (error.status === DMCP.Config.Commerce.FORBIDDEN_ERROR_STATUS && error.getResponseHeader("Content-Type").toLowerCase().indexOf("text/html") >= 0) {
	      location.reload(true);
	    }
		else {
	      object.closest('.checkout-process-container').find('.checkout-process-container-error-message').addClass('has-error');
		}
	  });
    }
    
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Model
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Model = DMCP.Checkout.Model || {};
  
  DMCP.Checkout.Model.BillingDetails = DMCP.Checkout.Model.DeliveryDetails.extend({
    success: function(success){
	  this.successCount++;
	  if(success.useDeliveryAsBillingAddress == null) {
        if(success.region!=null) {
          this.set({
	        'regionIsoCode' : success.region.name
          });
        }
        this.set({
          'titleCode' : success.title.label,
          'countryIsoCode' : success.country.name
        });
      }
      this.set({
    	'taxExemptionCode': (success.taxExemptionCode!='' ? ': '+success.taxExemptionCode : ''), 
        'successDetails' : this.successCount	    	
      });
      this.containerModel.setDetails('orderSummary',success.orderSummary);
    }
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Model
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Model = DMCP.Checkout.Model || {};
  
  DMCP.Checkout.Model.OrderSummary = Backbone.Model.extend({
	
	containerModel: null,
    
    initialize: function(model, containerModel) {
      this.containerModel = containerModel;
    },
    
    getPaymentModes: function(object) {
	  var specialInstructions = object.find('textarea').val();
	  var hideSoldToSection = object.find('.order-summary-sold-to-details').length ? false : true;
      var soldToFirstName = object.find('#soldToFirstName').val() === undefined ? "" : object.find('#soldToFirstName').val();
      var soldToLastName = object.find('#soldToLastName').val() === undefined ? "" : object.find('#soldToLastName').val();
      var soldToEmailAddress = object.find('#soldToEmailAddress').val() === undefined ? "" : object.find('#soldToEmailAddress').val();
      var termsAndConditionsAccepted = object.find('.order-summary-terms-and-conditions-checkbox').prop("checked");
	  $.ajax({
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
		context: this,
		type: 'POST',
		dataType: 'json',
		url: window.location.pathname.replace('.html','.orderSummary.html'),
	    data: {
	      specialInstructions: specialInstructions,
	      hideSoldToSection: hideSoldToSection,
	      soldToFirstName: soldToFirstName,
	      soldToLastName: soldToLastName,
	      soldToEmailAddress: soldToEmailAddress,
	      termsAndConditionsAccepted: termsAndConditionsAccepted,
	      '_charset_':'UTF-8'
	    }
	  })
	  .done(function(success){
	    this.successCount++;
		this.containerModel.setDetails('paymentModes', success.paymentModes);
  	    if(success.hasOwnProperty('specialInstructions') && success.specialInstructions !== '') {
		  object.find('.order-summary-special-instructions').text(success.specialInstructions).prev().show();
		}
		else {
		  object.find('.order-summary-special-instructions').empty().prev().hide();	
		}
  	    if(object.find('.order-summary-sold-to-information').length) {
  		  object.find('.order-summary-sold-to-name').text("");
		  if(success.hasOwnProperty('soldToFirstName') && success.soldToFirstName !== "") {
			object.find('.order-summary-sold-to-name').text(success.soldToFirstName + " ");
		  }
		  if(success.hasOwnProperty('soldToLastName') && success.soldToLastName !== "") {
			object.find('.order-summary-sold-to-name').append(success.soldToLastName);
		  }
		  if(success.hasOwnProperty('soldToEmail') && success.soldToEmail !== "") {
			object.find('.order-summary-sold-to-email').text(success.soldToEmail);
		  }
		}
		this.set({
		  'successSummary':this.successCount,
		});  
	  })
	  .fail(function(error){
		object.find('.order-summary-details').parsley().reset();
	    object.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
	    if(error.status === DMCP.Config.Commerce.BAD_REQUEST_ERROR_STATUS && error.hasOwnProperty('responseJSON')) {
          var fields = error.responseJSON[0];
          for (var field in fields) {
            fields[field] = fields[field].replace("[","").replace("]","");
            window.ParsleyUI.addError(object.find('[name="'+field+'"]').parsley(), 'serverError', fields[field]);
          }
	    }
	    else if (error.status === DMCP.Config.Commerce.FORBIDDEN_ERROR_STATUS && error.getResponseHeader("Content-Type").toLowerCase().indexOf("text/html") >= 0) {
	      location.reload(true);
	    }
	    else {
	      object.closest('.checkout-process-container').find('.checkout-process-container-error-message').addClass('has-error');
	    }
	  });
    }
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Model
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Model = DMCP.Checkout.Model || {};
  
  DMCP.Checkout.Model.PaymentOptions = Backbone.Model.extend({
	successCount: 0,
	  
	containerModel: null,
    
    initialize: function(model, containerModel) {
      this.containerModel = containerModel;
    },
    
    setPaymentMode: function(element) {
  	  var paymentModeId = '',
  	  	  purchaseOrderNumber = undefined;
  	  if(typeof element.find('input[name="paymentOptions"]:checked').val() !== undefined) {
  		paymentModeId = element.find('input[name="paymentOptions"]:checked').val();
  	  }
  	  if (paymentModeId === DMCP.Config.Commerce.PURCHASE_ORDER_CONSTANT) {
  		purchaseOrderNumber = element.find('.payment-options-purchase-order').val();
  		
  		$.ajax({
  	      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  	      context: this,
  	      type: 'POST',
  	      dataType: 'json',
  	      url: window.location.pathname.replace('.html','.purchaseOrder.json'),
            data: {
        	  paymentModeId: paymentModeId,
        	  purchaseOrderNumber: purchaseOrderNumber,
        	  '_charset_':'UTF-8'
            }
          })
  	    .done(function(success){
  		  window.location.href = success.order.confirmationPageLinkPath + "/" + success.order.orderId;
  	    })
  	    .fail(function(error){
  		  var errorMessage = '';
  		  $('.checkout-process-container-payment-options button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
  		  if(error.status === DMCP.Config.Commerce.BAD_REQUEST_ERROR_STATUS && error.hasOwnProperty('responseJSON')) {
  		    for(var i = 0; i < error.responseJSON.length; i++) {
  		      if(error.responseJSON[i].hasOwnProperty('paymentModeId')) {
  		 	    errorMessage = error.responseJSON[i].paymentModeId.replace("[","").replace("]","");
  			    window.ParsleyUI.addError($('input[name="paymentOptions"]').parsley(), 'serverError', errorMessage);
  		      }
  		      else {
  			    errorMessage = error.responseJSON[i].purchaseOrderNumber.replace("[","").replace("]","");
  			    window.ParsleyUI.addError($('.payment-options-form .payment-options-purchase-order').parsley(), 'serverError', errorMessage);
  		      }
  		    }
  		  }
	  	  else if (error.status === DMCP.Config.Commerce.FORBIDDEN_ERROR_STATUS && error.getResponseHeader("Content-Type").toLowerCase().indexOf("text/html") >= 0) {
	  	    location.reload(true);
	  	  }
  		  else {
  			element.closest('.checkout-process-container').find('.checkout-process-container-error-message').addClass('has-error');
  		  }
  	    });
  	  } else {
		$.ajax({
  	      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  	      context: this,
  	      type: 'POST',
  	      dataType: 'json',
  	      url: window.location.pathname.replace('.html','.creditCard.paymentForm.json')
        })
	  	  .done(function(success) {
	  		this.successCount++;
	  		this.set({
	  		  'paymentFormObject': success,
	  		  'successPayment':this.successCount
	  		});
	  	  })
	  	  .fail(function(error){
	  		element.closest('.checkout-process-container').find('.checkout-process-container-error-message').addClass('has-error');  
	  	  });
  	    }
  	  }
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Delivery Details View
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.View = DMCP.Checkout.View || {};
  
  DMCP.Checkout.View.DeliveryDetails = Backbone.View.extend({
	    
	// The DOM Element associated with this view
	el: 'li.checkout-process-container-delivery-details',
		
	// View constructor
	initialize: function() {
	  this.render();
	  this.model.bind('change:successDetails', _.bind(this.updateView, this));
	  this.deliveryAddressForm = this.$el.find('.delivery-details-form');
	},
	  
	events: {
	  'click button' : 'postFormData',
	  'change .parsley-error' : 'resetError',
	  'change #deliveryDetailsCountry' : 'changeProvinces'
	},
		
	postFormData: function(event) {
	  this.deliveryAddressForm.parsley().reset();
	  this.$el.closest('.checkout-process-container').find('.checkout-process-container-error-message').removeClass('has-error');
	  if(this.deliveryAddressForm.parsley().validate()){
		$(event.currentTarget).find('span').removeClass('fa-chevron-right').addClass('fa-spinner icon-spin');
		this.model.setDetails(this.$el,'deliveryDetails');
		this.model.sendFormData(this.$el,'deliveryDetails');
	  }
	},
	  
	render: function() {
      this.$el.find('.delivery-details-form').parsley({excluded: ":hidden, :disabled"});
	  this.$el.siblings('li').removeClass('checkout-process-container-expanded-section').attr('aria-expanded','false').find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideUp();
	  this.$el.addClass('checkout-process-container-expanded-section').attr('aria-expanded','true').find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideDown();
	  this.$el.parent().find('> li').removeClass('checkout-process-container-panel-changes-enabled').attr('aria-readonly','false').find('.checkout-process-container-readable-data').slideUp();
	},
	  
	updateView: function() {
	  this.$el.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
	  this.template = DMCP.tpl['checkout-process-container-delivery-details'];
	  this.$el.find('.checkout-process-container-readable-data').html(this.template({data: this.model.attributes}));
	  
	  window.location.hash = this.$el.find('button').attr('data-state');
	},
	
	changeProvinces: function(event){
	  this.model.fetchProvinces($(event.target).val(), this.updateProvinces, this.error, this);
	},
	
	resetError: function(event) {
	  $(event.currentTarget).parsley().reset();	
	},
	  
	updateProvinces: function(states) {
	  if(states=='') {       
	    this.$el.find('.delivery-details-address-county').addClass('show').removeClass('hide').siblings('.delivery-details-address-region').addClass('hide').removeClass('show').find('select').removeAttr('required aria-required'); 
	  } else {
		this.$el.find('.delivery-details-address-region').addClass('show').removeClass('hide').find('select').empty().attr({'aria-required' : 'true', 'required' : 'required'});
	    this.$el.find('.delivery-details-address-county').addClass('hide').removeClass('show');
		var deliveryDetailsView = this;
		_.each(states, function(data) {
		  var newProvince = new DMCP.Checkout.View.Province({ model: data });
		  deliveryDetailsView.$el.find('#deliveryDetailsRegion').append(newProvince.render().el); 
	    });
		this.$el.find('.delivery-details-address-region option:first-child').attr({'selected' : 'selected', 'disabled' : 'disabled'});
	  }
	},
	
	error: function() {},
	
	clear: function() {
	  $(this.el).off('click', 'button');
	  $(this.el).off('change', '#deliveryDetailsCountry');
	}
	
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Delivery Options View
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.View = DMCP.Checkout.View || {};
  
  DMCP.Checkout.View.DeliveryOptions = Backbone.View.extend({
	  
	// The DOM Element associated with this view
	el: 'li.checkout-process-container-delivery-options',
	  
	// View constructor
	initialize: function() {
	  this.render();
	  this.model.bind('change:successOptions', _.bind(this.updateView, this));
	},
			
	events: {
	  'click button' : 'postFormData',
	  'change input[name="deliveryOptions"]' : 'checkSelectedOption'
	},
	  
	checkSelectedOption: function(){
	  this.$el.find('textarea').attr('disabled', this.$el.find('input[name="deliveryOptions"]:checked').attr("data-is-other") === "false").parsley().reset();
	},
	  
	postFormData: function(event) {
	  this.$el.closest('.checkout-process-container').find('.checkout-process-container-error-message').removeClass('has-error');
	  if(this.$el.find('.delivery-options-form').parsley().validate()){
		$(event.currentTarget).find('span').removeClass('fa-chevron-right').addClass('fa-spinner icon-spin');
		this.model.setDeliveryMode(this.$el);
	  }
	},
			
	render: function() {
	  var formElement = this.$el.find('.delivery-options-form'),
	  	  optionsWrapper = this.$el.find('.delivery-options-wrapper'),
	  	  deliveryOptionsView = this,
	  	  deliveryModes = deliveryOptionsView.model.containerModel.getDetails('deliveryModes');
	  if (typeof formElement.parsley() !== 'undefined') {
		  formElement.parsley().destroy();
	  }
	  optionsWrapper.empty();  
	  this.template = DMCP.tpl['checkout-process-container-delivery-options'];
	  formElement.find('textarea').hide().attr('disabled', true);
	  _.each(deliveryModes, function(option) {
	    option.isChecked = '';
	    option.separator = ':';
	    if(deliveryModes.length == 1 || option.code === deliveryOptionsView.model.containerModel.getDetails('selectedDeliveryMode').code) {
	      option.isChecked = 'checked';
	    }
	    if(option.isOther) {
	    	formElement.find('textarea').show();
	    	option.separator = '';
	    	option.deliveryCost = '';
	      if(deliveryModes.length == 1 || option.code === deliveryOptionsView.model.containerModel.getDetails('selectedDeliveryMode').code) {
	    	  formElement.find('textarea').attr('disabled', false);
	      }
	      else {
	    	  formElement.find('textarea').val("");
		    }
	    }
	    optionsWrapper.append(deliveryOptionsView.template({data: option}));
	  });
	  formElement.parsley({excluded: ":hidden, :disabled"});
	  this.$el.siblings('li').removeClass('checkout-process-container-expanded-section').attr({'aria-expanded':'false', 'aria-readonly':'false'}).find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideUp();
	  this.$el.addClass('checkout-process-container-expanded-section').attr({'aria-expanded':'true', 'aria-readonly':'false'}).find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideDown();
	  this.$el.prev('li').addClass('checkout-process-container-panel-changes-enabled').nextAll('li').removeClass('checkout-process-container-panel-changes-enabled').find('.checkout-process-container-readable-data').slideUp();
	  this.$el.siblings('.checkout-process-container-panel-changes-enabled').attr({'aria-expanded':'true', 'aria-readonly':'true'}).find('.checkout-process-container-readable-data').slideDown();
	},
	
	updateView: function(){
	  this.$el.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
	  if(this.model.containerModel.getDetails('selectedDeliveryMode').isOther) {
		if(this.model.containerModel.getDetails('selectedDeliveryMode').hasOwnProperty('deliveryInstructions')){
			this.$el.find('.checkout-process-container-readable-data').text(this.model.containerModel.getDetails('selectedDeliveryMode').name + ": " + this.model.containerModel.getDetails('selectedDeliveryMode').deliveryInstructions);
		} else {
		  this.$el.find('.checkout-process-container-readable-data').text(this.model.containerModel.getDetails('selectedDeliveryMode').name);
		}
	  }
	  else {
	    this.$el.find('.checkout-process-container-readable-data').text(this.model.containerModel.getDetails('selectedDeliveryMode').name + ": " + this.model.containerModel.getDetails('selectedDeliveryMode').deliveryCost);
	  }
	  window.location.hash = this.$el.find('button').attr('data-state');
	},
	
	clear: function(){
	  $(this.el).off('click', 'button');
	  $(this.el).off('change', 'input[name="deliveryOptions"]');
  	}
	
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Billing Details View
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.View = DMCP.Checkout.View || {};
  
  DMCP.Checkout.View.BillingDetails = Backbone.View.extend({
      
    // The DOM Element associated with this view
    el: 'li.checkout-process-container-billing-details',

    // View constructor
	initialize: function() {
	  this.render();
	  this.model.bind('change:successDetails', _.bind(this.updateView, this));
	  this.billingAddressType = this.$el.find('.billing-details-copy-address');
	  this.billingTaxExemption = this.$el.find('.billing-details-tax-exemption-option');
	  this.billingAddressForm = this.$el.find('.billing-details-form');
	},
	  
	events: {
	  'click button' : 'postFormData',
	  'change #billingDetailsCheckbox' : 'toggleForm',
	  'change #billingDetailsTaxExemptionOption' : 'toggleTaxExemptionField',
	  'change .parsley-error' : 'resetError',
	  'change #billingDetailsCountry' : 'changeProvinces'
	},
		
	postFormData: function(event) {
	  this.billingAddressForm.parsley().reset();
	  this.$el.closest('.checkout-process-container').find('.checkout-process-container-error-message').removeClass('has-error');
	  if(!($('#billingDetailsTaxExemptionOption').is(':checked'))) {
		$('#billingDetailsTaxExemptionCode').val('');
	  }
	  this.model.set({'productGroupImageKey' : this.$el.siblings('li').find('.order-summary-product-details-wrapper').attr('data-parent-image-key'),
		  			'taxExemptionCodeMandatory' : $('.billing-details-tax-exemption-code').hasClass('billing-details-tax-exemption-mandatory') ? 'true' : 'false',
		    		  'useTaxExemptionCode' : $('#billingDetailsTaxExemptionOption').val(),
		    		  'taxExemptionCode' : $('#billingDetailsTaxExemptionCode').val()}); 
	  if(this.billingAddressForm.parsley().validate()) {
        $(event.currentTarget).find('span').removeClass('fa-chevron-right').addClass('fa-spinner icon-spin');
	    if((this.billingAddressType.length)&&(this.billingAddressType.find('input').is(':checked'))) {
		  this.model.set('useDeliveryAsBillingAddress',true);
	    } else {
		  this.model.set('useDeliveryAsBillingAddress',false);
		  this.model.setDetails(this.$el,'billingDetails');
	    }  
	    this.model.sendFormData(this.$el,'billingDetails');
	  }
	},
	
	toggleForm: function(event) {
	  if($(event.currentTarget).is(':checked')){
		this.billingAddressType.addClass('billing-details-checkbox-checked').find('input').val('true');
		this.billingAddressForm.parsley().reset();
	  } else {
		this.billingAddressType.removeClass('billing-details-checkbox-checked').find('input').val('false');
	  }
	  this.billingAddressForm.parsley().destroy();
      this.billingAddressForm.parsley({excluded: ":hidden, :disabled"});
	},
	
	toggleTaxExemptionField: function(event) {
	  if($(event.currentTarget).is(':checked')){
		this.billingTaxExemption.addClass('billing-details-checkbox-checked').find('input').val('true');
	  } else {
		this.billingTaxExemption.removeClass('billing-details-checkbox-checked').find('input').val('false');
	  }
	  this.billingAddressForm.parsley().destroy();
      this.billingAddressForm.parsley({excluded: ":hidden, :disabled"});
	},
	  
	changeProvinces: function(event) {
	  this.model.fetchProvinces($(event.target).val(), this.updateProvinces, this.error, this);
	},
	
	render: function() {
	  this.$el.siblings('li').removeClass('checkout-process-container-expanded-section').attr('aria-expanded','false').find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideUp();
      this.$el.addClass('checkout-process-container-expanded-section').attr({'aria-expanded':'true', 'aria-readonly':'false'}).find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideDown();
      if(this.$el.find('.billing-details-copy-address').length) {
    	this.$el.prev('li').addClass('checkout-process-container-panel-changes-enabled').nextAll('li').removeClass('checkout-process-container-panel-changes-enabled').attr('aria-readonly','false').find('.checkout-process-container-readable-data').slideUp();
        this.$el.siblings('.checkout-process-container-panel-changes-enabled').attr({'aria-expanded':'true', 'aria-readonly':'true'}).find('.checkout-process-container-readable-data').slideDown();
      } else {
        this.$el.parent().find('> li').removeClass('checkout-process-container-panel-changes-enabled').attr('aria-readonly','false').find('.checkout-process-container-readable-data').slideUp();
      }
      this.$el.find('.billing-details-form').parsley({excluded: ":hidden, :disabled"});
    },
    
    updateView: function() {
      this.$el.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
	  if((this.billingAddressType.length)&&(this.billingAddressType.find('input').is(':checked'))) {
		this.template = DMCP.tpl['billing-details-same-as-delivery'];
		this.$el.find('.checkout-process-container-readable-data').html(this.template({data: this.model.attributes}));
	  } else {
		this.template = DMCP.tpl['checkout-process-container-billing-details'];
		this.$el.find('.checkout-process-container-readable-data').html(this.template({data: this.model.attributes}));
      }
	  window.location.hash = this.$el.find('button').attr('data-state');
  	},
  	
  	resetError: function(event) {
  	  $(event.currentTarget).parsley().reset();	
  	},
  	  
  	updateProvinces: function(states) {
  	  if(states=='') {       
  	    this.$el.find('.billing-details-address-county').addClass('show').removeClass('hide').find('.form-control').val('');
  	    this.$el.find('.billing-details-address-region').addClass('hide').removeClass('show'); 
  	  } else {
  		this.$el.find('.billing-details-address-region').addClass('show').removeClass('hide').find('select').empty();
  	    this.$el.find('.billing-details-address-county').addClass('hide').removeClass('show');
  		var billingDetailsView = this;
  		_.each(states, function(data) {
  		  var newProvince = new DMCP.Checkout.View.Province({ model: data });
  		  billingDetailsView.$el.find('#billingDetailsRegion').append(newProvince.render().el); 
  	    });
  		this.$el.find('.billing-details-address-region option:first-child').attr({'selected' : 'selected', 'disabled' : 'disabled'});
  	  }
  	},
  	
  	error: function() {},
  	
  	clear: function() {
  	  $(this.el).off('click', 'button');
  	  $(this.el).off('change', '#billingDetailsCountry');
  	}
  });
}(jQuery);

/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Order Summary View
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.View = DMCP.Checkout.View || {};
  DMCP.Checkout.View.OrderSummary = Backbone.View.extend({
	  
	// The DOM Element associated with this view
	el: "li.checkout-process-container-order-summary",
		
	// View constructor
	initialize: function() {
	  this.render();
	  this.model.bind('change:successSummary', _.bind(this.updateView, this));
	},
			
	events: {
	  "click button" : "postFormData"
	},
	  
	postFormData: function(event) {
	  this.$el.closest('.checkout-process-container').find('.checkout-process-container-error-message').removeClass('has-error');
	  if($('.order-summary-details').parsley().validate()) {
		$(event.currentTarget).find('span').removeClass('fa-chevron-right').addClass('fa-spinner icon-spin');
		this.model.getPaymentModes(this.$el);
	  }
	},

	renderSummaryTable: function() {
      this.$el.find('.order-summary-product-details-wrapper').empty();
	  var orderSummaryData = this.model.containerModel.getDetails('orderSummary'),
	      parentTemplate = DMCP.tpl['order-summary-parent-title'],
	      baseTableTemplate = DMCP.tpl['order-summary-table-wrapper'],
	      productTemplate = DMCP.tpl['order-summary-product-details'],
	      orderSummaryView = this,
          previousParentCode = '';
	  _.each(orderSummaryData.products, function(product, index) {
		  product.noTaxClass = '';
		  if(!product.hasOwnProperty('taxPercentage')) {
			product.noTaxClass = "order-summary-no-tax-class";
		  }
          if(!orderSummaryView.$el.find('.order-summary-product-details-wrapper').attr("data-grouping-disabled")) {
              if(product.parentProduct.parentProductCode !== previousParentCode) {
                previousParentCode = product.parentProduct.parentProductCode;
                orderSummaryView.$el.find('.order-summary-product-details-wrapper').append(parentTemplate({data:product}), baseTableTemplate({data:product}));
                orderSummaryView.$el.find('table[data-parent-id="' + product.parentProduct.parentProductCode + '"]').append(productTemplate({data: product}));
              }
              else {
                  orderSummaryView.$el.find('table[data-parent-id="' + product.parentProduct.parentProductCode + '"]').append(productTemplate({data: product}));
              }
          }
          else {
              if(index === 0) {
			      orderSummaryView.$el.find('.order-summary-product-details-wrapper').append(baseTableTemplate({data:product}));
              }
              orderSummaryView.$el.find('.order-summary-products-table').append(productTemplate({data: product}))
          }
	  });
	  orderSummaryView.$el.find('.order-summary-no-tax-class').remove();
	  orderSummaryView.$el.find('.order-summary-subtotal').text(orderSummaryData.subTotal);
	  orderSummaryView.$el.find('.order-summary-tax').text(orderSummaryData.tax);
	  if(orderSummaryData.hasOwnProperty('shipping')) {
	    orderSummaryView.$el.find('.order-summary-shipping-cost').text(orderSummaryData.shipping);
	  }
	  else {
		orderSummaryView.$el.find('.order-summary-shipping-cost').parent().remove(); 
	  }
	  orderSummaryView.$el.find('.order-summary-total').text(orderSummaryData.total);
	},
			
	render: function() {
	  this.renderSummaryTable();
      this.$el.find('.order-summary-details').parsley();
	  this.$el.siblings('li').removeClass('checkout-process-container-expanded-section').attr({'aria-expanded':'false', 'aria-readonly':'false'}).find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideUp();
	  this.$el.addClass('checkout-process-container-expanded-section').attr({'aria-expanded':'true', 'aria-readonly':'false'}).find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideDown();
	  this.$el.prev('li').addClass('checkout-process-container-panel-changes-enabled').nextAll('li').removeClass('checkout-process-container-panel-changes-enabled').find('.checkout-process-container-readable-data').slideUp();
	  this.$el.siblings('.checkout-process-container-panel-changes-enabled').attr({'aria-expanded':'true', 'aria-readonly':'true'}).find('.checkout-process-container-readable-data').slideDown();
	},
	
	updateView: function(){
	  this.$el.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
	  window.location.hash = this.$el.find('button').attr('data-state');
	},
	
	clear: function(){
	  $(this.el).off('click', 'button');	  
  	}
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Payment Options View
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.View = DMCP.Checkout.View || {};
  
  DMCP.Checkout.View.PaymentOptions = Backbone.View.extend({

	// The DOM Element associated with this view
	el: "li.checkout-process-container-payment-options",
		
	// View constructor
	initialize: function() {
	  this.render();
	  this.model.bind('change:successPayment', _.bind(this.updateView, this));
	},
			
	events: {
	  "click button" : "postFormData",
	  'change input[name="paymentOptions"]' : 'checkSelectedOption'
	},
	  
	postFormData: function(event) {
	  this.$el.closest('.checkout-process-container').find('.checkout-process-container-error-message').removeClass('has-error');
	  if(this.$el.find('.payment-options-form').parsley().validate()) {
		$(event.currentTarget).find('span').removeClass('fa-chevron-right').addClass('fa-spinner icon-spin');
	    this.model.setPaymentMode(this.$el);
	  }
		
	},
	
	checkSelectedOption: function() {
	  this.$el.find('.payment-options-iframe-container').hide();
	  if(this.$el.find('input[name="paymentOptions"]:checked').val() === DMCP.Config.Commerce.PURCHASE_ORDER_CONSTANT) {
	    this.$el.find('.payment-options-purchase-order').show();
	    this.$el.find('button').show();
	  }
	  else {
		this.$el.find('.payment-options-purchase-order').hide().parsley().reset();
		if(this.$el.find('input[name="paymentOptions"]:checked').val() === DMCP.Config.Commerce.CREDIT_CARD_CONSTANT) {
		  this.$el.find('button').hide();
		  if(!this.$el.find('iframe[data-active-iframe="true"]').length) {
		    this.model.setPaymentMode(this.$el);
		  }
		  else {
			this.$el.find('.payment-options-iframe-container').show();
		  }
		}
	  }
	},
	  
	render: function() {
	  var formElement = this.$el.find('.payment-options-form'),
  	      optionsWrapper = this.$el.find('.payment-options-wrapper'),
  	      paymentOptionsView = this,
  	      paymentModes = paymentOptionsView.model.containerModel.getDetails('paymentModes');
	  if (typeof formElement.parsley() !== 'undefined') {
		formElement.parsley().destroy();
	  }
	  optionsWrapper.empty();
	  paymentOptionsView.$el.find('.payment-options-iframe-container').hide();
	  paymentOptionsView.$el.find('button').hide();
	  formElement.find('.payment-options-purchase-order').val('').hide();
	  this.template = DMCP.tpl['checkout-process-container-payment-options'];
	  _.each(paymentModes, function(option) {
	    option.isChecked = '';
	    if(paymentModes.length == 1) {
	      option.isChecked = 'checked';
	      if(paymentModes[0].code === DMCP.Config.Commerce.PURCHASE_ORDER_CONSTANT) {
	    	formElement.find('.payment-options-purchase-order').show();
	    	paymentOptionsView.$el.find('button').show();
	      }
	      else if(paymentModes[0].code === DMCP.Config.Commerce.CREDIT_CARD_CONSTANT) {
	    	paymentOptionsView.model.setPaymentMode(paymentOptionsView.$el); 
	      }
	    }
	    optionsWrapper.append(paymentOptionsView.template({data: option}));
	  });
	  formElement.parsley({excluded: ":hidden, :disabled"});
	  this.$el.siblings('li').removeClass('checkout-process-container-expanded-section').find('.checkout-process-container-editable-data, .checkout-process-container-continue-button').slideUp();
	  this.$el.addClass('checkout-process-container-expanded-section').attr({'aria-expanded':'true', 'aria-readonly':'false'}).find('.checkout-process-container-editable-data').slideDown();
	  this.$el.prev('li').addClass('checkout-process-container-panel-changes-enabled');
	  this.$el.siblings('.checkout-process-container-panel-changes-enabled').attr({'aria-expanded':'true', 'aria-readonly':'true'}).find('.checkout-process-container-readable-data').slideDown();
    },
    
    updateView: function() {
    	var option = {},
	    hiddenFieldTemplate = DMCP.tpl['checkout-process-container-payment-form'],
	    paymentOptionsView = this;
    	paymentOptionsView.$el.find('#payment_form').empty();
		for(var key in paymentOptionsView.model.attributes.paymentFormObject) {
  	      if(key != "formSubmitURL" && paymentOptionsView.model.attributes.paymentFormObject.hasOwnProperty(key)) {
  			option.name = key;
  			option.value = paymentOptionsView.model.attributes.paymentFormObject[key];
  			paymentOptionsView.$el.find('#payment_form').append(hiddenFieldTemplate({data:option}));	  			
  		  } 
  		}
		paymentOptionsView.$el.find('#payment_form').attr("action",paymentOptionsView.model.attributes.paymentFormObject.formSubmitURL);
		paymentOptionsView.$el.find('#payment_form').submit();
		paymentOptionsView.$el.find('button span').removeClass('fa-spinner icon-spin').addClass('fa-chevron-right');
		paymentOptionsView.$el.find('.payment-options-iframe-container').show().find('iframe').attr('data-active-iframe','true');
  	},
    
    clear: function(){
    	$(this.el).off('click', 'button');
    	$(this.el).off('change', 'input[name="paymentOptions"]');
  	}
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Province View
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.View = DMCP.Checkout.View || {};
  
  DMCP.Checkout.View.Province = Backbone.View.extend({
	    
	tagName: 'option',
	  
	attributes : function () {
	  return {
	    value : this.model.value
	  };
	},	

	initialize: function() {
	  this.render();
	},
		
	render: function() {
	  this.$el.html(this.model.label);
	  return this;
	}	  
  });
}(jQuery);
/* ---------------------------------------------------------------------
	PEARSON MARKETING CLOUD
	_______________________

	Checkout Process Container component - Router
------------------------------------------------------------------------ */

if(typeof DMCP === 'undefined' || DMCP === null) {
  var DMCP = {};
}

+function ($) {
  'use strict';
  
  DMCP.Checkout = DMCP.Checkout || {};
  DMCP.Checkout.Router = DMCP.Checkout.Router || {};
  
  DMCP.Checkout.Router.Tab = Backbone.Router.extend({
    
	model: new DMCP.Checkout.Model.Container(),
	
	currentView: null,
	
	currentModel: null,
	
	switchView: function(view) {
	  if(this.currentView) {
		this.currentView.clear();
	  }
	  this.currentView = view;
	},
  
    routes: {
	  'deliveryDetails' : 'deliveryDetails',
	  'deliveryOptions' : 'deliveryOptions',
	  'billingDetails' : 'billingDetails',
	  'orderSummary' : 'orderSummary',
	  'paymentOptions' : 'paymentOptions'
    },
    
    deliveryDetails : function () {
      this.currentModel = new DMCP.Checkout.Model.DeliveryDetails({},this.model);
      this.switchView(new DMCP.Checkout.View.DeliveryDetails({model : this.currentModel}));
    },
    
    deliveryOptions : function () {
      this.currentModel = new DMCP.Checkout.Model.DeliveryOptions({},this.model);
      this.switchView(new DMCP.Checkout.View.DeliveryOptions({model : this.currentModel}));
    },
    
    billingDetails : function () {
      this.currentModel = new DMCP.Checkout.Model.BillingDetails({},this.model);
      this.switchView(new DMCP.Checkout.View.BillingDetails({model : this.currentModel}));
    },
    
    orderSummary: function () {
      this.currentModel = new DMCP.Checkout.Model.OrderSummary({},this.model);
      this.switchView(new DMCP.Checkout.View.OrderSummary({model : this.currentModel}));
    },
    
    paymentOptions : function () {
      this.currentModel = new DMCP.Checkout.Model.PaymentOptions({},this.model);
      this.switchView(new DMCP.Checkout.View.PaymentOptions({model : this.currentModel}));
    }
  });
  
  $(document).ready(function () {
	var checkoutComponent = $('.checkout-process-container');
	if(checkoutComponent.length) {
	  var checkoutTabRouter = new DMCP.Checkout.Router.Tab();
	  if(!Backbone.History.started) {
	    Backbone.history.start();  
	  }
      if(checkoutComponent.find('.checkout-process-container-delivery-details').length){
	    window.location.hash = $('.checkout-process-container-delivery-details .checkout-process-container-edit-button').attr('href');
	  } else {
	    window.location.hash = $('.checkout-process-container-billing-details .checkout-process-container-edit-button').attr('href');	
	  }
	}
  });
}(jQuery);



/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
 $(document).ready(function() {
  var $headerLinks = $(".header-links");
  var $headerLinksIcon = $("#mainnav-trigger");
  $headerLinksIcon.click(function() {
    $headerLinks.toggleClass("header-links-isopen")        
  });
});
/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
$(document).ready(function() {
  var $searchContainer = $(".header-search");	
  var $searchIcon = $("#mobilesearch-trigger");
  $searchIcon.click(function(){
    $searchContainer.toggleClass("header-search-isopen");
  });
});
