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
    "ignore": {
      "layout": {
        "horizontal": {
          "key": "horizontal",
          "title": "Horizontal",
          "value": "horizontal"
        },
        "vertical": {
          "key": "vertical",
          "title": "Vertical",
          "value": "vertical"
        },
      },
      "behavior": {
        "static": {
          "key": "static",
          "title": "Static",
          "value": "static"
        },
        "dynamic": {
          "key": "dynamic",
          "title": "Dynamic",
          "value": "dynamic"
        },
      },
      "interactionBehavior": {
        "static": {
          "key": "singleStop",
          "title": "Stop Video",
          "value": "singleStop"
        },
        "dynamic": {
          "key": "timeframe",
          "title": "Don't stop video",
          "value": "timeframe"
        },
      },
      "interactionType": {
        "single_answer": {
          "key": "single_answer",
          "title": "single_answer",
          "value": "single_answer"
        },
        "multiple_answer": {
          "key": "multiple_answer",
          "title": "multiple_answer",
          "value": "multiple_answer"
        },
        "httpcall": {
          "key": "httpcall",
          "title": "httpcall",
          "value": "httpcall"
        },
        "html": {
          "key": "html",
          "title": "html",
          "value": "html"
        },
        "htmltext": {
          "key": "htmltext",
          "title": "htmltext",
          "value": "htmltext"
        },
        "gaptext": {
          "key": "gaptext",
          "title": "gaptext",
          "value": "gaptext"
        },
        "image": {
          "key": "image",
          "title": "image",
          "value": "image"
        },
        "ccmapp": {
          "key": "ccmapp",
          "title": "ccmapp",
          "value": "ccmapp"
        },
      },
    },
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
  } ,
  "online":  {

    "preview": "Preview",
    "download": "Download",
    //  "onfinish": { "restart": true },
    //"submit": "Submit",
  },

  };