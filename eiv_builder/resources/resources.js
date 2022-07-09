/**
 * @overview data-based resources of ccm component for building a fill-in-the-blank text
 * @author André Kless <andre.kless@web.de> 2020
 * @license The MIT License (MIT)
 */

ccm.files[ 'resources.js' ] = {

  "local":   {
    "css": [ "ccm.load",
      [  // serial
        "https://ccmjs.github.io/akless-components/libs/bootstrap-4/css/bootstrap.css",
        [
          "./../eiv_builder/resources/default.css",
        ]
      ]
    ],
    "editor": [ "ccm.component", "https://ccmjs.github.io/tkless-components/editor/versions/ccm.editor-4.0.0.js", {
      "editor": [ "ccm.load",
        "https://ccmjs.github.io/tkless-components/libs/quill/quill.js",
        "https://cdn.quilljs.com/1.2.0/quill.snow.css"
      ],
      "settings": {
        "modules": {
          "toolbar": [
            [ { 'header': [ 1, 2, 3, false ] } ],
            [ 'bold', 'italic', 'underline', 'strike' ],
            [ { 'script': 'sub' }, { 'script': 'super' } ],
            [ { 'color': [] }, { 'background': [] } ],
            [ { 'list': 'ordered' }, { 'list': 'bullet' } ],
          ]
        },
        "theme": "snow"
      }
    } ],
    "helper": [ "ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-7.0.0.mjs" ],
    "html": [ "ccm.load", "./resources/templates.mjs" ],

    "libs": [ "ccm.load",
      [  // serial
        "https://ccmjs.github.io/akless-components/libs/jquery-3/jquery.min.js",
        [  // parallel
          "https://ccmjs.github.io/akless-components/libs/bootstrap-4/js/bootstrap.bundle.min.js",
        ]
      ]
    ],
    "preview": "Preview",
    "download": "Download",
    //"onfinish": { "restart": true },
    //"submit": "Submit",
    "shadow": "none",
    "tool": [ "ccm.component", "../eiv/ccm.eiv.js" ],
    "video":"bHQqvYy5KYo"
  } ,
  "online":  {

    "preview": "Preview",
    "download": "Download",
    //  "onfinish": { "restart": true },
    //"submit": "Submit",
  },

  };