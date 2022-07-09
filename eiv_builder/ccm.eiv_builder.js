(() => {

    const component = {
        name: 'eiv_builder',
        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-26.1.1.js',
        config: {
            "css": ["ccm.load",
                [  // serial
                    "https://ccmjs.github.io/akless-components/libs/bootstrap-4/css/bootstrap.css",
                    [
                        "./../eiv_builder/resources/default.css",
                    ]
                ]
            ],
            "editor": ["ccm.component", "https://ccmjs.github.io/tkless-components/editor/versions/ccm.editor-4.0.0.js", {
                "editor": ["ccm.load",
                    "https://ccmjs.github.io/tkless-components/libs/quill/quill.js",
                    "https://cdn.quilljs.com/1.2.0/quill.snow.css"
                ],
                "settings": {
                    "modules": {
                        "toolbar": [
                            [{'header': [1, 2, 3, false]}],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{'script': 'sub'}, {'script': 'super'}],
                            [{'color': []}, {'background': []}],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                        ]
                    },
                    "theme": "snow"
                }
            }],
            "helper": ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-7.0.0.mjs"],
            "html": ["ccm.load", "./resources/templates.mjs"],
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
                "ccmAppTypes": {
                    "DMS": {
                        "key": "DMS",
                        "title": "DMS",
                        "value": "DMS"
                    },
                    "CCM_App_URL_Config": {
                        "key": "CCM_App_URL_Config",
                        "title": "CCM_App_URL_Config",
                        "value": "CCM_App_URL_Config"
                    },
                },
                "ccmConfigFileTypes": {
                    "noConfigNeeded": {
                        "key": "noConfigNeeded",
                        "title": "noConfigNeeded",
                        "value": "noConfigNeeded"
                    },
                    "URL": {
                        "key": "URL",
                        "title": "URL",
                        "value": "URL"
                    },
                    "textinput": {
                        "key": "textinput",
                        "title": "textinput",
                        "value": "textinput"
                    },
                },
            },
            "libs": ["ccm.load",
                [  // serial
                    "https://ccmjs.github.io/akless-components/libs/jquery-3/jquery.min.js",
                    [  // parallel
                        "https://ccmjs.github.io/akless-components/libs/bootstrap-4/js/bootstrap.bundle.min.js",
                    ]
                ]
            ],
            //"preview": "Preview",
            //"download": "Download",
            //"onfinish": { "restart": true },
            //"submit": "Submit",
            "shadow": "none",
            "tool": ["ccm.component", "../eiv/ccm.eiv.js"],
        },
        Instance: function () {
            let $, dataset;
            let config;
            let editorsMap = new Map();
            let counter = 0;
            this.ready = async () => {
                $ = Object.assign({}, this.ccm.helper, this.helper);
                $.use(this.ccm);  // set shortcut to help functions
                delete this.tool.config.parent;                                            // remove no needed parent reference
                this.logger && this.logger.log('ready', $.privatize(this, true));      // logging of 'ready' event
            };

            this.start = async () => {

                //TODO umbauen auf modal vielleicht ?

                // get initial app configuration (priority order: [high] this.data -> this.ignore.defaults -> this.tool.config [low])
                dataset = await $.integrate(await $.dataset(this.data), await $.integrate(this.ignore.defaults, this.tool.config));
                config = {};
                config.interactions = [];
                this.addIC(config.interactions);
                if (typeof this.video !== 'undefined') {
                    // the variable is defined
                    config.video = this.video;
                } else {
                    config.video = ""
                }


                this.logger && this.logger.log('start', $.clone(config));                  // logging of 'start' event
                this.render(config);                                                         // render main HTML template

                jQuery('[data-toggle=popover]');                                    // initialize popovers for info icons

                // listen to change events of the input fields
                this.element.querySelectorAll('*[name]')
                    .forEach(input => {
                            input.addEventListener(
                                'change', this.changeEvent)
                        }
                    );

                // listen to submit event of the HTML form
                this.submit && this.element.querySelector('form').addEventListener('submit', event => {
                    event.preventDefault();
                    const result_data = this.getValue();                                 // get result data
                    this.logger && this.logger.log('finish', $.clone(result_data));  // logging of 'finish' event
                    $.onFinish(this, result_data);                                     // trigger finish actions
                });

                // update app preview in modal dialog
                jQuery('#eiv-preview').on('show.bs.modal', () => {

                    this.tool.start(Object.assign(this.getValue(), {root: this.element.querySelector('#eiv-preview-body')}))
                });
                jQuery('#eiv-preview').on('hide.bs.modal', () => {
                    this.element.querySelector('#eiv-preview-body').removeChild(this.element.querySelector('#eiv-preview-body').firstChild);
                });

            };

            this.changeEvent = () => {

                editorsMap.forEach((value, key, map) => {
                    let id = this.extractID(key)
                    if (config.interactions[id].interactionType === "gaptext") {
                        config.interactions[id].gaptext = value.getValue().inner;
                    }
                    if (config.interactions[id].interactionType === "htmltext") {
                        config.interactions[id].htmltext = value.getValue().inner;
                    }
                    if (config.interactions[id].interactionType === "html") {
                        config.interactions[id].htmlAsValue = value.getValue().inner;
                    }
                })
                this.render();
            }

            this.extractID = idAsText => {
                idAsText = idAsText.replace("gaptext", "")
                idAsText = idAsText.replace("htmltext", "")
                idAsText = idAsText.replace("html", "")
                return idAsText;
            }

            this.createEditor = async editorDiv => {
                let id = this.extractID(editorDiv.id);
                let valueTExt = "";
                if (editorDiv.id.includes("gaptext")) {
                    valueTExt = config.interactions[id].gaptext;
                } else if (editorDiv.id.includes("htmltext")) {
                    valueTExt = config.interactions[id].htmltext;
                } else {
                    //(editorDiv.id.includes("html"))
                    valueTExt = config.interactions[id].htmlAsValue;
                }
                let editor = await this.editor.start({
                    data: valueTExt,
                    root: editorDiv
                });
                if (editorsMap.has(editorDiv.id)) {
                    editorsMap.set(editorDiv.id, editor);
                } else {
                    editorsMap.set(editorDiv.id, editor);
                }
            }
            /**
             * renders the main HTML template
             * @param {Object} [config = this.getValue()] - app configuration
             */
            this.render = (config = this.getValue()) => {
                this.html.render(this.html.main(config, this, events), this.element);

                this.element.querySelectorAll('.imeditor')
                    .forEach(editor => {
                            this.createEditor(editor)
                        }
                    );
            }

            this.validateNumbers = number => {
                let tmp = parseInt(number)
                if (tmp <= 0) {
                    return 0;
                }
                if (tmp >= 59) {
                    return 59;
                }
                return number
            }

            /**
             * returns current result data
             * @returns {Object} app configuration
             */
            this.getValue = () => {
                const result = Object.assign({}, config, $.formData(this.element));
                // const result = Object.assign( {}, config, $.formData( this.element ) );
                editorsMap.forEach((value, key, map) => {
                    let id = this.extractID(key);
                    if (key.includes("gaptext")) {
                        result.interactions[id].gaptext = value.getValue().inner;
                    } else if (key.includes("htmltext")) {
                        result.interactions[id].htmltext = value.getValue().inner;
                    } else {
                        //(key.includes("html"))
                        result.interactions[id].htmlAsValue = value.getValue().inner;
                    }
                })
                Object.entries(result.interactions).forEach((interaction) => {
                    if (interaction[1].interactionType === "single_answer") {
                        Object.entries(interaction[1].single_answer_question.answers).forEach(answer => {
                            answer[1].correct = answer[1].key === interaction[1].single_answer_question.correct;
                        })
                    }
                    /*interaction[1].timestartMinute=this.validateNumbers(interaction[1].timestartMinute)
                    interaction[1].timestartSeconds=this.validateNumbers(interaction[1].timestartSeconds)
                    interaction[1].timestopMinute=this.validateNumbers(interaction[1].timestopMinute)
                    interaction[1].timestopSeconds=this.validateNumbers(interaction[1].timestopSeconds)*/


                    interaction[1].timestart = (parseInt(interaction[1].timestartMinute) * 60) + interaction[1].timestartSeconds
                    if (interaction[1].interactionBehavior === "timeframe") {
                        interaction[1].timestop = (parseInt(interaction[1].timestopMinute) * 60) + interaction[1].timestopSeconds
                        /*if (interaction[1].timestart>=interaction[1].timestop){
                          interaction[1].timestop=interaction[1].timestart;
                          interaction[1].timestop=interaction[1].timestop+1;
                          interaction[1].timestartSeconds=interaction[1].timestart%60;
                          interaction[1].timestartMinute=(interaction[1].timestart/60)>> 0;
                          interaction[1].timestopSeconds=interaction[1].timestart%60;
                          interaction[1].timestopMinute=(interaction[1].timestart/60)>> 0;

                        }*/
                    }
                    if (interaction[1].interactionType === "ccmapp") {
                        if (interaction[1].ccmAppType === "CCM_App_URL_Config") {
                            interaction[1].ccmAppTool = ["ccm.component", interaction[1].ccmAppToolURL]

                            if (interaction[1].ccmAppConfigFileType === this.ignore.ccmConfigFileTypes.noConfigNeeded) {
                                interaction[1].ccmAppConfigFile = "";
                            } else if (interaction[1].ccmAppConfigFileType === "URL") {
                                interaction[1].ccmAppConfigFile = ["ccm.load", interaction[1].ccmAppConfigFileURL]
                            } else {
                                try {
                                    interaction[1].ccmAppConfigFile = interaction[1].ccmAppConfigFileText;
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }

                    }
                })
                config.interactions = $.clone(result.interactions)
                config.behavior = this.ignore.behavior[result.behavior].value;
                config.layout = this.ignore.layout[result.layout].value;

                switch (result.store) {
                    case 'collective':
                        result.onfinish.store = true;
                        result.data = {store: ['ccm.store', this.results.store], key: key};
                        break;
                    case 'user':
                        result.onfinish.store = true;
                        result.data = {
                            store: ['ccm.store', this.results.store],
                            key: key,
                            login: true,
                            user: true,
                            permissions: this.results.permissions
                        };
                        break;
                    case 'unique':
                        result.onfinish.login = true;
                        result.onfinish.store = {
                            settings: ['ccm.store', this.results.store],
                            key: key,
                            login: true,
                            user: true,
                            unique: true,
                            permissions: this.results.permissions
                        };
                        result.data = '';
                        break;
                    default:
                        result.data = '';
                }
                if (!result.store || result.store === 'collective') result.user = '';
                result.store = '';
                if (result.user) result.user = this.ignore.user[result.user].value;
                switch (result.render) {
                    case 'clear':
                        result.onfinish.clear = true;
                        break;
                    case 'restart':
                        result.onfinish.restart = true;
                        break;
                    case 'app':
                        result.onfinish.render = {};
                        if (result.app) {
                            result.onfinish.render = $.decomposeEmbedCode(result.app);
                            result.onfinish.render.result = ['ccm.get', result.onfinish.render.result.store, result.onfinish.render.result.key];
                        }
                        break;
                }
                console.log(config)
                delete result.render;
                delete result.app;
                console.log(result);
                return result;
            };

            this.collectEditorValues = () => {
                editorsMap.forEach((value, key, map) => {
                    let id = this.extractID(key);
                    if (key.includes("gaptext")) {
                        config.interactions[id].gaptext = value.getValue().inner;
                        ;
                    } else if (key.includes("html")) {
                        config.interactions[id].htmlAsValue = value.getValue().inner;
                    } else {
                        //(key.includes("htmltext"))
                        config.interactions[id].htmltext = value.getValue().inner;
                        ;
                    }
                })
            }

            this.renderAndReaddEvents = (skipremovelisteners) => {
                this.render(config);
                if (!skipremovelisteners) {
                    this.element.querySelectorAll('*[name]')
                        .forEach(input => {
                                input.removeEventListener("change", this.changeEvent);
                            }
                        );
                    this.element.querySelectorAll('*[name]')
                        .forEach(input => {
                                input.addEventListener(
                                    'change', this.changeEvent)
                            }
                        );
                }
            }

            this.addIC = (interactions) => {
                let singleAnswerKey = $.generateKey();
                let singleAnswer = {key: singleAnswerKey, answer: "4", correct: true};
                let singleAnswerKey2 = $.generateKey();
                let singleAnswer2 = {key: singleAnswerKey2, answer: "5", correct: true};
                let singleAnswerObject = {};
                singleAnswerObject[singleAnswerKey] = singleAnswer;
                singleAnswerObject[singleAnswerKey2] = singleAnswer2;

                let multipleAnswerKey = $.generateKey();
                let multipleAnswer = {key: multipleAnswerKey, answer: "4", correct: true};
                let multipleAnswerKey2 = $.generateKey();
                let multipleAnswer2 = {key: multipleAnswerKey2, answer: "5", correct: true};
                let multipleAnswerObject = {};
                multipleAnswerObject[singleAnswerKey] = multipleAnswer;
                multipleAnswerObject[singleAnswerKey2] = multipleAnswer2;


                const generateKey = $.generateKey();
                interactions[generateKey] = {
                    key: generateKey,
                    counter: ++counter,
                    interactionBehavior: "timeframe",
                    interactionType: "single_answer",
                    single_answer_question: {
                        text: "2+2?",
                        correct: singleAnswerKey,
                        "answers": singleAnswerObject
                    },
                    multiple_answer_question: {
                        text: "2+2?",
                        "answers": multipleAnswerObject
                    },
                    timestartSeconds: 0,
                    timestartMinute: 0,
                    timestopSeconds: 0,
                    timestopMinute: 0,
                    textquestion: "Make Call to : https://reqbin.com/echo/get/json",
                    headers: [
                        {
                            key: $.generateKey(),
                            "headerName": "Content-Type",
                            "headerValue": "application/json; charset=utf-8"
                        }
                    ],
                    httpURL: "https://reqbin.com/echo/get/json",
                    expectedResponse: "",
                    imageUrl: "",
                    ccmAppType: "DMS",
                    ccmAppToolURL: "https://ccmjs.github.io/akless-components/cloze/ccm.cloze.min.js",
                    ccmAppConfigFileText: "{\n" +
                        "      \"editor\": [ \"ccm.load\",\n" +
                        "        \"https://ccmjs.github.io/tkless-components/libs/quill/quill.js\",\n" +
                        "        \"https://cdn.quilljs.com/1.2.0/quill.snow.css\"\n" +
                        "      ],\n" +
                        "      \"settings\": {\n" +
                        "        \"modules\": {\n" +
                        "          \"toolbar\": [\n" +
                        "            [ { 'header': [ 1, 2, 3, false ] } ],\n" + "            [ 'bold', 'italic', 'underline', 'strike' ],\n" +
                        "            [ { 'script': 'sub' }, { 'script': 'super' } ],\n" + "            [ { 'color': [] }, { 'background': [] } ],\n" +
                        "            [ { 'list': 'ordered' }, { 'list': 'bullet' } ],\n" +
                        "          ]\n" +
                        "        },\n" +
                        "        \"theme\": \"snow\"\n" +
                        "      }\n" +
                        "    }",
                    ccmAppConfigFileURL: "https://mpreuk2s.github.io/mpreuk2s-components/eiv_builder/resources/testAppConfig2.js",
                    ccmAppConfigFileType: "",
                    ccmAppConfigFile: "",
                    httpDescription: "",
                    text: "Ich bin ein einfacher Text.",
                    htmlAsValue: "<h>htmlAsValue </h>",
                    htmltext: "<h>htmltext </h>",
                    gaptext: "Ich bin ein einfacher *Text*.",
                    ccmAppDmsURL: "https://ccmjs.github.io/digital-makerspace/app.html?app=live_poll,1657053736557X0013442437656943085",
                    "showExpectedResponse": true,
                    "showHTTPURL": true,
                    "showHTTPMethod": true,
                    "showHTTPHeaders": true,

                }
            }

            const events = {

                onDelete: key => {
                    this.collectEditorValues();
                    delete config.interactions[key];
                    this.renderAndReaddEvents(true)
                },
                onAddHTTPCallHeader: (index) => {
                    this.collectEditorValues();
                    const key = $.generateKey();
                    config.interactions[index].headers[key] = {key: key, "headerName": "", "headerValue": ""};
                    this.renderAndReaddEvents()
                },
                onDeleteHTTPCallHeader: (index, headerindex) => {
                    console.log(headerindex)
                    console.log(config.interactions[index].headers[headerindex])
                    this.collectEditorValues();
                    delete config.interactions[index].headers[headerindex];
                    //config.interactions[index].headers = $.clone( config.interactions[index].headers );
                    this.renderAndReaddEvents(true)
                },


                onAddAnswerMutlipleAnswer: (index) => {
                    this.collectEditorValues();
                    const answerkey = $.generateKey();
                    config.interactions[index].multiple_answer_question.answers[answerkey] = {
                        key: answerkey,
                        "answer": "",
                        "correct": false
                    };
                    this.renderAndReaddEvents()
                },
                onDeleteAnswerMultipleAnswer: (indexIC, indexAnswer) => {
                    this.collectEditorValues();
                    delete config.interactions[indexIC].multiple_answer_question.answers[indexAnswer];
                    this.renderAndReaddEvents();
                },

                onAddAnswerSinleAnswer: (index) => {
                    this.collectEditorValues();
                    const answerkey = $.generateKey();
                    config.interactions[index].single_answer_question.answers[answerkey] = {
                        key: answerkey,
                        "answer": "",
                        "correct": false
                    };
                    this.renderAndReaddEvents()
                },
                onDeleteAnswerSinleAnswer: (indexIC, indexAnswer) => {
                    this.collectEditorValues();
                    if (Array.isArray(config.interactions[indexIC].single_answer_question.answers)) {
                        const indexOfObject = config.interactions[indexIC].single_answer_question.answers.findIndex(object => {
                            return object.key === indexAnswer;
                        });
                        delete config.interactions[indexIC].single_answer_question.answers[indexOfObject];
                    } else {
                        delete config.interactions[indexIC].single_answer_question.answers[indexAnswer];
                    }
                    this.renderAndReaddEvents();
                },
                onExtractYoutubeID: () => {
                    //this.collectEditorValues();
                    //this.renderAndReaddEvents()
                    //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
                    var url = this.element.querySelector('#eiv-youtubeUrl-btn')
                    config = this.getValue();
                    var i, r,
                        rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                    this.element.querySelector('#eiv-youtubeUrl-btn').value = url.value.match(rx)[1];
                    //this.renderAndReaddEvents();
                },
                onAdd: () => {
                    this.collectEditorValues();
                    this.addIC(config.interactions);
                },
                onDownloadConfig: () => {
                    let result = this.getValue();
                    result.key = "local"
                    let test = JSON.stringify({"local": result});
                    console.log(test)
                    this.downloadFile("#fileDownloadConfig", "config.js", "ccm.files[ 'config.js' ] = " + test);
                },
                onDownloadHTML: () => {
                    this.downloadFile("#fileDownloadHTML", "index.html",
                        "<!DOCTYPE html>\n" +
                        "<meta charset=\"utf-8\">\n" +
                        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "<meta name=\"license\" content=\"The MIT License (MIT)\">\n" +
                        "<script src=\"https://mpreuk2s.github.io/mpreuk2s-components/eiv/ccm.eiv.js\"></script>\n" +
                        "<style>html, body, body > *:first-child {\n" +
                        "    height: calc(100% - 5px);\n" +
                        "    width: calc(100% - 5px);\n" +
                        "}\n" +
                        "ccm-eiv>*:first-child{\n" +
                        "    height: 100%;\n" +
                        "    width: 100%;\n" +
                        "}\n" +
                        "ccm-eiv {\n" +
                        "    font-weight: bold;\n" +
                        "    display: block;\n" +
                        "    margin: auto;\n" +
                        "    height: 100%;\n" +
                        "    width: 100%;\n" +
                        "}\n" +
                        "#eiv-1{\n" +
                        "    display: block;\n" +
                        "    height: 100%;\n" +
                        "    width: 100%;\n" +
                        "}\n" +
                        "\n" +
                        "body {\n" +
                        "    margin: 0;\n" +
                        "}</style>\n" +
                        "<ccm-eiv key='[\"ccm.get\",\"./config.js\",\"local\"]'></ccm-eiv>");
                }
            }


            this.downloadFile = (elementID, filename, text) => {
                const file = this.element.querySelector(elementID);
                file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                file.setAttribute('download', filename);

                file.click();

                //this.element.removeChild(element);
            }

        }
    };

    let b = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
    if (window.ccm && null === window.ccm.files[b]) return window.ccm.files[b] = component;
    (b = window.ccm && window.ccm.components[component.name]) && b.ccm && (component.ccm = b.ccm);
    "string" === typeof component.ccm && (component.ccm = {url: component.ccm});
    let c = (component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/) || [""])[0];
    if (window.ccm && window.ccm[c]) window.ccm[c].component(component); else {
        var a = document.createElement("script");
        document.head.appendChild(a);
        component.ccm.integrity && a.setAttribute("integrity", component.ccm.integrity);
        component.ccm.crossorigin && a.setAttribute("crossorigin", component.ccm.crossorigin);
        a.onload = function () {
            (c = "latest" ? window.ccm : window.ccm[c]).component(component);
            document.head.removeChild(a)
        };
        a.src = component.ccm.url
    }
})();