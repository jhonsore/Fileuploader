(function() {
  "use strict";
  function FileUploaderController(){
    this.options = {
      selector:".js-file-uploader",//selector to upload
      type:'POST',//type to send information
      url:"",//url to send file,
      onInit:null,//init element
      onFileChange:null,//on file change
      onRequestDone:null,// request done
      onRequestOpen:null,//request open
      onRequestProgress:null,//request progress
      onRequestLoad:null,//request load
      onRequestError:null,//request error
      onRequestAbort:null//request abort
    }
    // Create options by extending defaults with the passed in argugments
    /*
      * The key here is in the arguments object.
      *This is a magical object inside of every function that contains an array
      *of everything passed to it via arguments.
      *Because we are only expecting one argument,
      *an object containing plugin settings, we check to make sure arguments[0] exists, and that it is indeed an object.
    */
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(this.options, arguments[0]);
    }

    this.init();
  };

  FileUploaderController.prototype.constructor = FileUploaderController;

  FileUploaderController.prototype.init = function (){

    var selector = this.options.selector;
    var url = this.options.url;

    var elements = document.querySelectorAll(selector),
        i;

    this.fileUploadList = [];

    if (elements.length < 1) {
      throw new Error("FileUploader: No Elements found for Fileupload initialize!");
        return;
    }

    if (url ==="") {
      throw new Error("FileUploader: No url found, please insert an url to send the file to server");
        return;
    }

    for (i = 0; i < elements.length; i += 1) {
        this.fileUploadList.push(this.build(elements[i]));
        this.options.onInit(elements[i]);
    }
  };

  FileUploaderController.prototype.build = function (__element__){
    var _self = this;
    cb_addEventListener(__element__,'change', function(__args__){_self.fileChanged(__args__)});
  };

  FileUploaderController.prototype.fileChanged = function (__args__){
    var _self = this;
    var formdata = new FormData();
    var files = __args__.target.files;
    var i, len = files.length,file;
    var nameEl = __args__.target.name;

    for ( i = 0 ; i < len; i++ ) {
      file = files[i];
      formdata.append(nameEl+"[]", file);
      //if (!!file.type.match(/image.*/)) {}
    }

    _self.options.onFileChange(__args__);

    //https://davidwalsh.name/xmlhttprequest
    var request;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        request = new ActiveXObject('Msxml2.XMLHTTP');
      }
      catch (e) {
        try {
          request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (e) {}
      }
    }
    request.open(_self.options.type, _self.options.url, true);
    request.send(formdata);

    // state changes
    request.onreadystatechange = function(__event__) {
      if(request.readyState === 4) { // done
        _self.options.onRequestDone(__event__);
        switch (request.status){
          //complete
          case 200:
            break;
            //page not found
          case 404:
            break;
        }
      }
    };

    cb_addEventListener(request,'progress', function(__event__){_self.progress(__event__);});
    cb_addEventListener(request,'load', function(__event__){_self.load(__event__);});
    cb_addEventListener(request,'error', function(__event__){_self.error(__event__);});
    cb_addEventListener(request,'abort', function(__event__){_self.abort(__event__);});

  };
  FileUploaderController.prototype.open = function (__event__){
      this.options.onRequestOpen(__event__);
  };
  FileUploaderController.prototype.progress = function (__event__){
    this.options.onRequestProgress(__event__);
  };
  FileUploaderController.prototype.load = function (__event__){
    this.options.onRequestLoad(__event__);
  };
  FileUploaderController.prototype.error = function (__event__){
    this.options.onRequestError(__event__);
  };
  FileUploaderController.prototype.abort = function (__event__){
    this.options.onRequestAbort(__event__);
  };

//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
  // Utility method to extend defaults with user options
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  };

  /**
   * Cross Browser helper to addEventListener.
   *
   * @param {HTMLElement} obj The Element to attach event to.
   * @param {string} evt The event that will trigger the binded function.
   * @param {function(event)} fnc The function to bind to the element.
   * @return {boolean} true if it was successfuly binded.
   */
  var cb_addEventListener = function(obj, evt, fnc) {
      // W3C model
      if (obj.addEventListener) {
          obj.addEventListener(evt, fnc, false);
          return true;
      }
      // Microsoft model
      else if (obj.attachEvent) {
          return obj.attachEvent('on' + evt, fnc);
      }
      // Browser don't support W3C or MSFT model, go on with traditional
      else {
          evt = 'on'+evt;
          if(typeof obj[evt] === 'function'){
              // Object already has a function on traditional
              // Let's wrap it with our own function inside another function
              fnc = (function(f1,f2){
                  return function(){
                      f1.apply(this,arguments);
                      f2.apply(this,arguments);
                  }
              })(obj[evt], fnc);
          }
          obj[evt] = fnc;
          return true;
      }
      return false;
  };

//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------
//----------------------------------------------

  window.FileUploader = FileUploaderController;

}());
