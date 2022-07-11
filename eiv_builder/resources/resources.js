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
    "preview": "Vorschau",
    "downloadHTML": "Download : Seperate HTML Datei",
    "downloadConfig": "Download : Seperate Konfigurationsdatei",
    "downloadOnfile":"Download : Applikation in einer HTML-Datei",
    //"onfinish": { "restart": true },
    //"submit": "Submit",
    "shadow": "none",
    "tool": [ "ccm.component", "../eiv/ccm.eiv.js" ],
    "video":"bHQqvYy5KYo",
    "eivURL":"https://mpreuk2s.github.io/mpreuk2s-components/eiv/ccm.eiv.js"
  } ,
  "online":  {

    "preview": "Vorschau",
    "downloadHTML": "Download : Seperate HTML Datei",
    "downloadConfig": "Download : Seperate Konfigurationsdatei",
    "downloadOnfile":"Download : Applikation in einer HTML-Datei",
    "tool": [ "ccm.component", "https://mpreuk2s.github.io/mpreuk2s-components/eiv/ccm.eiv.js" ],
    "eivURL":"https://mpreuk2s.github.io/mpreuk2s-components/eiv/ccm.eiv.js"
    //  "onfinish": { "restart": true },
    //"submit": "Submit",
  },

  };