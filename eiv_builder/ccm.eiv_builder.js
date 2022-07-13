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
                        "title": "Vertikal",
                        "value": "vertical"
                    },
                },
                "behavior": {
                    "static": {
                        "key": "static",
                        "title": "Statisch",
                        "value": "static"
                    },
                    "dynamic": {
                        "key": "dynamic",
                        "title": "Dynamisch",
                        "value": "dynamic"
                    },
                },
                "interactionBehavior": {
                    "static": {
                        "key": "singleStop",
                        "title": "Zeitpunkt",
                        "value": "singleStop"
                    },
                    "dynamic": {
                        "key": "timeframe",
                        "title": "Zeitfenster",
                        "value": "timeframe"
                    },
                },
                "interactionType": {
                    "single_answer": {
                        "key": "single_answer",
                        "title": "Aufgabe mit einer richtigen Antwort",
                        "value": "single_answer"
                    },
                    "multiple_answer": {
                        "key": "multiple_answer",
                        "title": "Aufgabe mit Mehrfachauswahl",
                        "value": "multiple_answer"
                    },
                    "image": {
                        "key": "image",
                        "title": "Bild",
                        "value": "image"
                    },
                    "gaptext": {
                        "key": "gaptext",
                        "title": "Aufgabe als Lückentext",
                        "value": "gaptext"
                    },
                    "htmltext": {
                        "key": "htmltext",
                        "title": "Text",
                        "value": "htmltext"
                    },
                    "httpcall": {
                        "key": "httpcall",
                        "title": "HTTP Client",
                        "value": "httpcall"
                    },
                    "html": {
                        "key": "html",
                        "title": "HTML als Code",
                        "value": "html"
                    },
                    "ccmapp": {
                        "key": "ccmapp",
                        "title": "DMS App/CCM Komponente",
                        "value": "ccmapp"
                    },
                },
                "ccmAppTypes": {
                    "DMS": {
                        "key": "DMS",
                        "title": "DMS App URL",
                        "value": "DMS"
                    },
                    "CCM_App_URL_Config": {
                        "key": "CCM_App_URL_Config",
                        "title": "CCM Komponente",
                        "value": "CCM_App_URL_Config"
                    },
                },
                "ccmConfigFileTypes": {
                    "noConfigNeeded": {
                        "key": "noConfigNeeded",
                        "title": "Keine Konfiguration",
                        "value": "noConfigNeeded"
                    },
                    "URL": {
                        "key": "URL",
                        "title": "URL der Konfigurationsdatei",
                        "value": "URL"
                    },
                    "textinput": {
                        "key": "textinput",
                        "title": "Textform",
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
            let date = new Date();
            let editorsMap = new Map();
            let counter = 0;
            this.ready = async () => {
                $ = Object.assign({}, this.ccm.helper, this.helper);
                delete this.tool.config.parent;                                            // remove no needed parent reference
                this.logger && this.logger.log('ready', $.privatize(this, true));      // logging of 'ready' event
            };

            this.start = async () => {

                //TODO umbauen auf modal vielleicht ?

                // get initial app configuration (priority order: [high] this.data -> this.ignore.defaults -> this.tool.config [low])
                dataset = await $.integrate(await $.dataset(this.data), await $.integrate(this.ignore.defaults, this.tool.config));
                config = {};
                config.interactions = [];
                config.configid=$.generateKey();
                //this.addIC(config.interactions);
                if (typeof this.video !== 'undefined') {
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
                    this.collectEditorValues();
                    let previewConfig = this.getValue();
                    previewConfig.ignoreDeplay=true;
                    this.tool.start(Object.assign(previewConfig, {root: this.element.querySelector('#eiv-preview-body')}))
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
                this.updateTimestamp();
                this.html.render(this.html.main(config, this, events), this.element);
                this.element.querySelector('#eiv-youtubeUrl-btn').value=config.video;
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
                result.video = this.extractVideoID(result.video);
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


                    interaction[1].timestart = (parseInt(interaction[1].timestartHour) * 3600)+(parseInt(interaction[1].timestartMinute) * 60) + parseInt(interaction[1].timestartSeconds)
                    if (interaction[1].interactionBehavior === "timeframe") {
                        interaction[1].timestop = (parseInt(interaction[1].timestopHour) * 3600)+(parseInt(interaction[1].timestopMinute) * 60) + parseInt(interaction[1].timestopSeconds)
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
                config.video=result.video;
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
                delete result.render;
                delete result.app;
                return result;
            };

            this.collectEditorValues = () => {
                editorsMap.forEach((value, key, map) => {
                    let id = this.extractID(key);
                    if (key.includes("gaptext")) {
                        config.interactions[id].gaptext = value.getValue().inner;
                    } else if (key.includes("htmltext")) {
                        config.interactions[id].htmltext = value.getValue().inner;
                    } else {
                        //(key.includes("html"))
                        config.interactions[id].htmlAsValue = value.getValue().inner;
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


            //add new interaction
            this.addIC = (interactions) => {
                let singleAnswerKey = $.generateKey();
                let singleAnswer = {key: singleAnswerKey, answer: "4", correct: true};
                let singleAnswerKey2 = $.generateKey();
                let singleAnswer2 = {key: singleAnswerKey2, answer: "5", correct: false};
                let singleAnswerObject = {};
                singleAnswerObject[singleAnswerKey] = singleAnswer;
                singleAnswerObject[singleAnswerKey2] = singleAnswer2;

                let multipleAnswerKey = $.generateKey();
                let multipleAnswer = {key: multipleAnswerKey, answer: "4", correct: true};
                let multipleAnswerKey2 = $.generateKey();
                let multipleAnswer2 = {key: multipleAnswerKey2, answer: "5", correct: false};
                let multipleAnswerObject = {};
                multipleAnswerObject[singleAnswerKey] = multipleAnswer;
                multipleAnswerObject[singleAnswerKey2] = multipleAnswer2;


                const generateKey = $.generateKey();
                /*interactions[generateKey] = {
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
                    timestartHour: 0,
                    timestopSeconds: 0,
                    timestopMinute: 0,
                    timestopHour: 0,
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

                }*/
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
                    timestartHour: 0,
                    timestopSeconds: 0,
                    timestopMinute: 0,
                    timestopHour: 0,
                    headers: [
                        {
                            key: $.generateKey(),
                            "headerName": "",
                            "headerValue": ""
                        }
                    ],
                    httpURL: "",
                    expectedResponse: "",
                    imageUrl: "",
                    ccmAppType: "DMS",
                    ccmAppToolURL: "",
                    ccmAppConfigFileText: "",
                    ccmAppConfigFileURL: "",
                    ccmAppConfigFileType: "noConfigNeeded",
                    ccmAppConfigFile: "",
                    httpDescription: "",
                    text: "Ich bin ein einfacher Text.",
                    htmlAsValue: "",
                    htmltext: "",
                    gaptext: "Ich esse ein *Apfel*, eine  *Ora(nge)*, eine *B*anane und *Hi(mb)ee(ren)*",
                    ccmAppDmsURL: "",
                    expectedValue: "",
                    "showExpectedResponse": true,
                    "showExpectedValue": true,
                    "showHTTPURL": true,
                    "showHTTPMethod": true,
                    "showHTTPHeaders": true,

                }
            }

            this.extractVideoID= input => {
                let inputLowerCase = input.toLocaleString();
                //most cases included
                if (inputLowerCase.includes("http")
                    || inputLowerCase.includes("youtu")
                    || inputLowerCase.includes("www.you")
                    || inputLowerCase.includes("//")
                ) {
                    //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
                    var i, r,
                        rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                    try {
                        return input.match(rx)[1];
                    }catch (e){
                        //wenn es failt, videoid input behaltet
                        this.logger && this.logger.log(e);
                        return input;
                    }
                }
                return input;
            }
            this.createTimeStampName = () =>{
                return date.getUTCFullYear()+"_"+date.getUTCMonth()+"_"+date.getDate()+"_"+date.getUTCHours()+"_"+date.getUTCMinutes()+"_"+date.getUTCSeconds();
            }
            this.updateTimestamp =()=>{
                date= new Date();
            }

            //events wich are used in template.mjs
            const events = {

                onDelete: key => {
                    this.collectEditorValues();
                    delete config.interactions[key];
                    editorsMap.delete("htmltext"+key);
                    editorsMap.delete("html"+key);
                    editorsMap.delete("gaptext"+key);
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
                    this.renderAndReaddEvents();
                },
                onDownloadConfig: () => {
                    let result = this.getValue();
                    result.key = "online"
                    let test = JSON.stringify({"local": result});
                    console.log(test)
                    let dateAsString = date.getUTCFullYear()+"_"+date.getUTCMonth()+"_"+date.getDate()+"_"+date.getUTCHours()+"_"+date.getUTCMinutes()+"_"+date.getUTCSeconds()
                    this.downloadFile("#fileDownloadConfig", "config_"+this.createTimeStampName()+".js", "ccm.files[ 'config_"+this.createTimeStampName()+".js' ] = " + test);
                },
                onDownloadOneHTML: () => {
                    this.downloadFile("#fileAllInOneFile", "index_"+this.createTimeStampName()+".html",
                        "<!DOCTYPE html>\n" +
                        "<meta charset=\"utf-8\">\n" +
                        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "<meta name=\"license\" content=\"The MIT License (MIT)\">\n" +
                        "\n" +
                        "<style>html, body, body > *:first-child { height: 100%; } body { margin: 0; }\n" +
                        "</style>\n" +
                        "<body>\n" +
                        "<script src=\"https://ccmjs.github.io/ccm/ccm.js\"></script>\n" +
                        "<script>\n" +
                        "    ccm.start( '"+this.eivURL+"', { root: document.body, src: "+JSON.stringify( this.getValue())+"    } );\n" +
                        "</script>");
                }
                ,
                onDownloadHTML: () => {
                    this.downloadFile("#fileDownloadHTML", "index_"+this.createTimeStampName()+".html",
                        "<!DOCTYPE html>\n" +
                        "<meta charset=\"utf-8\">\n" +
                        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "<meta name=\"license\" content=\"The MIT License (MIT)\">\n" +
                        "<script src=\""+this.eivURL+"\"></script>\n" +
                        "<style>html, body, body > *:first-child {\n" +
                        "    height: calc(100% - 5px);\n" +
                        "    width: calc(100% - 5px);\n" +
                        "}\n" +
                        "ccm-eiv>*:first-child{\n" +
                        "    height: 100%;\n" +
                        "    width: 100%;\n" +
                        "}\n" +
                        "ccm-eiv {\n" +
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
                        "<ccm-eiv key='[\"ccm.get\",\"./config_"+this.createTimeStampName()+".js\",\"local\"]'></ccm-eiv>");
                }
            }


            this.downloadFile = (elementID, filename, text) => {
                const file = this.element.querySelector(elementID);
                file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                file.setAttribute('download', filename);

                file.click();

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