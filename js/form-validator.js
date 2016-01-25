/*
 * Project: Pearson DMCP
 * Copyright(c): 2014
 */
var DMCP = DMCP || {}; + function($) {
  'use strict';
  DMCP.FormValidator = DMCP.FormValidator || {};
  DMCP.FormValidator = {
    InvalidInputHelper: function(input, options) {
      this.changeOrInput = function() {
        if (input.validity.badInput || input.validity.patternMismatch || input.validity.typeMismatch) {
          input.setCustomValidity(options.invalidText);
        } else if (input.value == "") {
          input.setCustomValidity(options.emptyText);
        } else {
          input.setCustomValidity("");
        }
      }
      if (input.value == "") {
        input.setCustomValidity(options.emptyText);
      } else {
        input.setCustomValidity("");
      }
      input.addEventListener("change", this.changeOrInput);
      input.addEventListener("input", this.changeOrInput);
    },
    InvalidGroupInputHelper: function(fieldset, isRequired, options) {
      DMCP.FormValidator.changeOrInputGroup = function() {
        var isChecked = false;
        $(fieldset).find('input').each(function() {
          if (this.checked) {
            isChecked = true;
            this.setAttribute('checked', '');
            this.setAttribute('aria-checked', 'true');
          } else {
            this.removeAttribute('checked');
            this.setAttribute('aria-checked', 'false');
          }
        });
        if (isRequired === "true") {
          var input = $(fieldset).find('input')[0];
          if (!isChecked) {
            input.setAttribute("required", "");
            input.setCustomValidity(options.emptyText);
          } else {
            input.removeAttribute("required");
            input.setCustomValidity('');
          }
        }
      }
      DMCP.FormValidator.changeOrInputGroup();
      $(fieldset).find('input').each(function() {
        this.addEventListener("change", DMCP.FormValidator.changeOrInputGroup);
      });
    },
    //Function for customizing out of the box validation messages
    customizeErrorMessage: function($form) {
      //Customizing out of the box validation messages for text, email, number inputs and select.
      var inputElements = $('input[type="text"], input[type="email"], input[type="number"], input[type="password"], textarea, select', $form),
        groupElements = $('fieldset', $form),
        $this;
      inputElements.each(function() {
        if (typeof this.validity !== 'undefined') {
          $this = $(this);
          DMCP.FormValidator.InvalidInputHelper(this, {
            emptyText: $this.attr('data-required-msg') ? $this.attr('data-required-msg') : $this.closest('form').attr('data-required-msg') ? $this.closest('form').attr('data-required-msg') : '',
            invalidText: $this.attr('data-constraint-msg')
          });
        }
      });
      //Customizing out of the box validation messages for group components like radio and checkbox.
      groupElements.each(function() {
        if (typeof this.validity !== 'undefined') {
          $this = $(this);
          DMCP.FormValidator.InvalidGroupInputHelper(this, this.getAttribute('aria-required'), {
            emptyText: $this.attr('data-required-msg') ? $this.attr('data-required-msg') : $this.closest('form').attr('data-required-msg') ? $this.closest('form').attr('data-required-msg') : '',
            invalidText: $(this).attr('data-constraint-msg')
          });
        }
      });
    },
    //Function to check pattern.
    isValidPattern: function($input) {
      var currentVal = $input.val();
      if (currentVal.length && $input.attr('pattern') && !(currentVal.match($input.attr('pattern')))) {
        return false;
      }
      return true;
    },
    //Function to check email.
    isValidEmail: function($input) {
      var currentVal = $input.val();
      if (currentVal.length && $input.attr('type') === "email") {
        var email = /^[^@]+([@]{1})[0-9a-zA-Z\\._-]+([\\.]{1})[0-9a-zA-Z\\._-]+$/;
        //Checking using regex
        if (!currentVal.match(email)) {
          return false;
        }
      }
      return true;
    },
    //Function to check number.
    isValidNumber: function($input) {
      var currentVal = $input.val();
      if ($input.attr('type') === "number") {
        //Checking using regex
        var number = /^[0-9]+$/;
        if (currentVal.length) {
          if (!currentVal.match(number)) {
            return false;
          }
        } else {
          //Setting input to blank if entered value is not a number
          $input.val('');
        }
      }
      return true;
    },
    //Function for adding error message and corresponding aria attributes
    addErrorMessage: function($field, errorMsg) {
      $field.parent().addClass('has-error');
      $field.attr('aria-invalid', 'true');
      $field.siblings('.error-message').text(errorMsg);
    },
    //Function for adding error message and corresponding aria attributes
    resetErrorMessage: function($field) {
      $field.parent().removeClass('has-error');
      $field.attr('aria-invalid', 'false');
    },
    validateField: function($this) {
      var formValidator = DMCP.FormValidator,
        errorMessage = "";
      if (($this.attr("aria-required") === "true") && ($this.val() === null || $this.val().trim().length === 0)) {
        errorMessage = $this.attr('data-required-msg') ? $this.attr('data-required-msg') : $this.closest('form').attr('data-required-msg') ? $this.closest('form').attr('data-required-msg') : '';
        //Setting input to blank if entered value for Numeric text box is not a number
        $this.val('');
        formValidator.addErrorMessage($this, errorMessage);
        return false;
      } else if (!formValidator.isValidPattern($this) || !formValidator.isValidEmail($this) || !formValidator.isValidNumber($this)) {
        errorMessage = $this.attr('data-constraint-msg');
        formValidator.addErrorMessage($this, errorMessage);
        return false;
      } else {
        formValidator.resetErrorMessage($this);
        return true;
      }
    },
    validateGroup: function($this) {
      if ($this.find('input:checked').length === 0) {
        $this.parent().addClass('has-error');
        $this.find('.error-message').text($this.attr('data-required-msg'));
        return false;
      } else {
        $this.parent().removeClass('has-error');
        $this.find('.error-message').text('');
        return true;
      }
    },
    //Function to trigger validation on focus out
    attachFocusEventHandlers: function($form) {
      //Reset error message when a field is focused into
      $('input, textarea, select', $form).focus(function() {
        DMCP.FormValidator.resetErrorMessage($(this));
      });
      //Triggering custom error messages on FocusOut
      $('input, textarea, select', $form).blur(function() {
        DMCP.FormValidator.validateField($(this));
      });
    },
    //Function to trigger validation on form submit in case there is no HTML5 validation
    validateOnSubmit: function($form, event) {
      var inputElements = $form.find('input[type="text"], input[type="email"], input[type="number"], input[type="password"], textarea, select'),
        inputGroupElements = $form.find('fieldset[aria-required="true"]'),
        isValid = true;
      inputElements.each(function() {
        if (DMCP.FormValidator.validateField($(this)) === false) {
          isValid = false;
        }
      });
      inputGroupElements.each(function() {
        if (DMCP.FormValidator.validateGroup($(this)) === false) {
          isValid = false;
        }
      });
      if (isValid === false) {
        event.preventDefault();
      }
      return isValid;
    }
  };
  $(document).ready(function() {});
}(jQuery);
