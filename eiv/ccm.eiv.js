/**
 *
 * https://github-wiki-see.page/m/ccmjs/ccm/wiki/Loading-of-Resources
 https://github.com/ccmjs/ccm/wiki/HTML-Templating
 // replace existing message or append new message in frontend
 if ( element )
 $.replace( element, $.html( this.html.message, message ) );
 else
 $.append( this.element.querySelector( '#messages' ), $.html( this.html.message, message ) );

 // add message text and translate content
 $.setContent( this.element.querySelector( '#msg-' + message.key + ' .text' ), message.text );

 https://masteringjs.io/tutorials/fundamentals/foreach-break -> 1. Use every() instead of forEach()

 dynmic conent building with json objects


 //fadetooogle
 jQuery( this.element.querySelector('#interaction') ).fadeToggle();
 ,
 "libs": [ "ccm.load",
 [  // serial
 "https://ccmjs.github.io/akless-components/libs/jquery-3/jquery.min.js"
 ]
 ]
 */
(() => {
    const component = {

        name: 'eiv',
        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-26.1.1.js',

        config: {
            "html": {
                "tag": "div",
                "id": " mainContainer",
                "class": "main",
                "inner": [
                    {
                        "tag": "div",
                        "id": "playerContainer",
                        "class": "video-container",
                        "inner": [
                            {
                                "id": "iframe"
                            },
                            {"id": "youtubeImage", "tag": "img"} //https://i.ytimg.com/vi_webp/bHQqvYy5KYo/maxresdefault.webp https://img.youtube.com/vi/${imageUrl}/hqdefault.jpg
                        ]
                    }
                    ,
                    {
                        "id": "interactionContainer",
                        "tag": "div",
                        "class": "interactionContainer",
                        "inner": {
                            "id": "interaction",
                            "tag": "div",
                            "class": "interactionInner",
                            "inner": []
                        }
                    },
                ]
            }
            ,
            "css": ["ccm.load",
                [
                    "https://mpreuk2s.github.io/mpreuk2s-components/eiv/resources/default.css",
                    "https://ccmjs.github.io/akless-components/libs/bootstrap-5/css/bootstrap.min.css",
                    //"https://ccmjs.github.io/akless-components//libs/bootstrap-5/css/bootstrap-dark.min.css"
                ]
            ],
            "vars": {
                "enablejsapi": 1,
                "rel": 0,
                "showinfo": 0,
                "fs": 0,
                "origin": window.origin
            },
            "helperTemplate": ["ccm.load", "https://mpreuk2s.github.io/mpreuk2s-components/eiv/resources/templates.mjs"],
            "helper": ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-8.1.0.mjs"],
            "libs": ["ccm.load",
                [  // serial
                    "https://ccmjs.github.io/akless-components/libs/jquery-3/jquery.min.js",
                    "https://code.jquery.com/ui/1.13.0/jquery-ui.js",
                    "https://ccmjs.github.io/akless-components/libs/bootstrap-5/js/bootstrap.bundle.min.js",
                ]
            ]
            ,
            //  "loading",                    {string} loading - lazy loading: 'lazy', 'eager' or 'auto' (see https://addyosmani.com/blog/lazy-loading/)
            "height": "100%",
            "width": "100%",
            //  "vars",                       {object} params - [player parameter]{@link https://developers.google.com/youtube/player_parameters#Parameters}
            //  "onReady",                    {function} onReady - [onReady]{@link https://developers.google.com/youtube/iframe_api_reference#onReady} callback
            //  "onStateChange",              {function} onStateChange - [onStateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onStateChange} callback
            //  "onPlaybackQualityChange",    {function} onPlaybackQualityChange - [onPlaybackQualityChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange} callback
            //  "onPlaybackRateChange",       {function} onPlaybackRateChange - [onPlaybackRateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange} callback
            //  "onError",                    {function} onError - [onError]{@link https://developers.google.com/youtube/iframe_api_reference#onError} callback
            //  "onApiChange",                {function} onApiChange - [onApiChange]{@link https://developers.google.com/youtube/iframe_api_reference#onApiChange} callback
            //  "user": [ "ccm.instance", "https://ccmjs.github.io/akless-components/user/versions/ccm.user-8.1.0.js", [ "ccm.get", "https://ccmjs.github.io/akless-components/user/resources/configs.js", "guest" ] ]
            //  "logger": [ "ccm.instance", "https://ccmjs.github.io/akless-components/log/versions/ccm.log-4.0.1.js", [ "ccm.get", "https://ccmjs.github.io/akless-components/log/resources/configs.js", "greedy" ] ]

        },
        ready: () => new Promise(resolve => {

            // set global ready callback of YouTube iFrame API
            window.onYouTubeIframeAPIReady = resolve;

            // load YouTube iFrame API
            this.ccm.load({url: 'https://www.youtube.com/iframe_api', type: 'js'});

        }),
        Instance: function () {

            let $;
            this.currentICID = null;
            let intervalID;
            let stoppedAutomatically = true;
            let mark = "*";
            let icTmpHTTP = null;

            const timeStartFieldName = "timestart";
            const timeEndFieldName = "timestop";
            const icTypeTimeFrame = "timeframe"
            const icNameStop = "singleStop"
            const minimumSize = 400;
            let keywords_data = [];
            let playerContainerID = "interactionContainer";

            var eivCallbacks = {
                checkResult: this.checkIfAnswerIsOK,
                request: this.performHTTPRequest,
                rmHeaders: this.removeHader,
                addHeaders: this.addHeader,
                backToVideo: this.backToVideoFunction
            };

            /**
             * result data
             * @type {Object}
             */
            let results = null;

            let errorLoadingInteraction = {
                "id": "interaction",
                "tag": "div",
                "class": "interactionInner",
                "inner": [
                    {
                        "tag": "h5",
                        "class": "error",
                        "inner": "Error while loading interactions."
                    }
                ]
            };

            let icEmpty = {
                "id": "interaction",
                "tag": "div",
                "class": "interactionInner",
                "style": "",
                "inner": []
            }
            this.init = async () => {
                $ = Object.assign({}, this.ccm.helper, this.helper);
                $.use(this.ccm);  // set shortcut to help functions
            };

            this.ready = async () => {

                // prepare YouTube Player settings
                this.settings = $.privatize(this, 'video', 'height', 'width', 'vars');
                $.renameProperty(this.settings, 'video', 'videoId');
                $.renameProperty(this.settings, 'vars', 'playerVars');


                this.settings.events = {
                    'onReady': event => {
                        event.target && event.target.playVideo();
                        this.startTik()
                    }
                };

                // prevent error in case of loading more than one video at the same time
                const i = this.id - 1;
                return new Promise(resolve => setTimeout(resolve, i * 1000));

            };


            //TODO inhalte in eine Klasse auslagern, prefered auto layout? layout auswahl über für benutzer möglich machen ?

            this.start = async () => {
                switch (this.layout) {
                    case "horizontal":
                        this.html.class = this.html.class += " horizontalMain";
                        break;
                    case "vertical":
                        this.html.class = this.html.class += " verticalMain";
                        this.html.inner[1].class = "interactionContainerVertical"
                        //this.html.inner[1].style = "display: none;"
                        this.html.inner[0].id = "playerContainerVertical"
                        this.html.inner[0].class = "video-containerVertical"
                        playerContainerID = "interactionContainerVertical"
                        break;
                    default :
                        this.html.class = this.html.class += " horizontalMain";
                }

                // render main HTML structure
                $.setContent(this.element, $.html(this.html));

                //LIT HTML RENDER
                //this.helperTemplate.render(this.helperTemplate.mainTemplate(this.settings.videoId,events),this.element);  // prepare main HTML structure

                // embed YouTube Player
                this.player = new YT.Player(this.element.querySelector('#iframe'), this.settings);

                // manage lazy loading
                this.loading && this.element.querySelector('#iframe').setAttribute('loading', this.loading);

                await this.checkInteractionConfig();

                if (this.behavior === "dynamic" || this.behavior === "allwaysone") {
                    if (this.layout === "vertical") {
                        jQuery(this.element.querySelector("#interactionContainer")).slideDown(500);
                    } else {
                        jQuery(this.element.querySelector("#interactionContainer")).hide("slide", {direction: "right"}, 500);
                    }
                }
                if (this.layout === "horizontal") {
                    if (this.element.clientWidth < minimumSize) {
                        this.horizontalToVertical();
                    }
                } else if (this.layout === "vertical") {
                    if (this.element.height < minimumSize) {
                        this.verticalToHorizontal();
                    }
                }

                if (this.element.querySelector('.main') === null) {
                    return
                }
                const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        if (this.layout === "horizontal") {
                            if (entry.contentRect.width < minimumSize) {
                                this.horizontalToVertical();
                            } else {
                                this.verticalToHorizontal();
                            }
                        } else if (this.layout === "vertical") {
                            if (entry.contentRect.height < minimumSize) {
                                this.verticalToHorizontal();
                            } else {
                                this.horizontalToVertical();
                            }
                        }
                    }
                });
                resizeObserver.observe(this.element.querySelector('.main'));
            };

            /*
            https://stackoverflow.com/question/69469814/how-can-i-throttle-a-resizeobserver
            function throttle(f, delay) {
              let timer = 0;
              return function(...args) {
                clearTimeout(timer);
                timer = setTimeout(() => f.apply(this, args), delay);
              }
              }

              const myResize = new ResizeObserver(throttle((entries) => {
              entries[0].target.style.backgroundColor =
                "#" + (Math.random() * 4096 | 0).toString(16);
              }, 1000));

              const elemToWatch = document.querySelector('textarea');
              myResize.observe(elemToWatch);
             */

            this.verticalToHorizontal = () => {
                this.element.querySelector('.main').classList.remove("verticalMain");
                this.element.querySelector('.main').classList.add("horizontalMain")

                let querySelector = this.element.querySelector('.interactionContainerVertical');
                if (typeof (querySelector) != 'undefined' && querySelector != null) {
                    querySelector.classList.remove("interactionContainerVertical");
                    querySelector.classList.add("interactionContainer");
                }
                var playerContainerVertical = this.element.querySelector('.video-containerVertical');
                if (typeof (playerContainerVertical) != 'undefined' && playerContainerVertical != null) {
                    playerContainerVertical.classList.add("video-container");
                    playerContainerVertical.classList.remove("video-containerVertical");
                    playerContainerVertical.id = "playerContainer";
                    playerContainerID = "playerContainer"
                }
            }
            this.horizontalToVertical = () => {
                this.element.querySelector('.main').classList.remove("horizontalMain");
                this.element.querySelector('.main').classList.add("verticalMain");
                let querySelector = this.element.querySelector('.interactionContainer');
                if (typeof (querySelector) != 'undefined' && querySelector != null) {
                    querySelector.classList.remove("interactionContainer");
                    querySelector.classList.add("interactionContainerVertical");
                }
                var playerContainer = this.element.querySelector('.video-container');
                if (typeof (playerContainer) != 'undefined' && playerContainer != null) {
                    playerContainer.classList.remove("video-container");
                    playerContainer.classList.add("video-containerVertical");

                    playerContainer.id = "playerContainerVertical";
                    playerContainerID = "playerContainerVertical"
                }
            }

            this.interActionFactory = async interaction => {
                let interActionAsHtml = null;
                if (interaction === null) {
                    this.replaceInterAction(icEmpty);
                    return;
                }

                switch (interaction.interactionType) {
                    case "single_answer":
                        interActionAsHtml = this.singleAnswerQuestion(interaction);
                        break;
                    case "text":
                        interActionAsHtml = this.normalText(interaction);
                        break;
                    case "html":
                        interActionAsHtml = this.htmlInteraction(interaction);
                        break;
                    case "htmltext":
                        interActionAsHtml = this.htmltextInteraction(interaction);
                        break;
                    case "multiple_answer":
                        interActionAsHtml = await this.multipleAnswerQuestion(interaction);
                        break;
                    case "httpcall":
                        interActionAsHtml = await this.httpCallInteraction(interaction);
                        break;
                    case "gaptext":
                        //this.gaptext(interaction);
                        this.replaceInterAction(null, interaction, this.gaptext);
                        break;
                    case "image":
                        interActionAsHtml = this.imageHTML(interaction);
                        break;
                    case "ccmapp":
                        interActionAsHtml = this.ccmapp(interaction);
                        break;
                    default:
                    // code block
                }
                if (interActionAsHtml !== null) {
                    await this.replaceInterAction(interActionAsHtml);
                }
            }

            /*
            tik methods
             */

            this.startTikDelayed = () => {
                setTimeout(this.startTik, 1000, true);
            }

            this.startTik = async startPlayer => {
                if (startPlayer) {
                    await this.playVideo();
                }
                // tik already started?
                if (!intervalID) {
                    intervalID = setInterval(this.tik, 500);
                }
            }
            this.tik = () => {
                //console.log("tik");
                const currentTime = this.getCurrentPlayerTime();
                if (currentTime === null) {
                    return;
                }
                for (const interaction of this.interactions) {
                    let start = numberToInt(interaction.timestart);
                    if (interaction.interactionBehavior === icTypeTimeFrame) {
                        let stop = numberToInt(interaction.timestop);
                        if (start <= currentTime && currentTime <= stop) {
                            if (this.currentICID !== interaction.id) {
                                this.currentICID = interaction.id;
                                this.renderIC(interaction);
                            }
                            return;
                        }
                    }
                    if (interaction.interactionBehavior === icNameStop) {
                        if (start === currentTime) {
                            if (this.currentICID !== interaction.id) {
                                this.currentICID = interaction.id;
                                this.renderIC(interaction);
                            }
                            return;
                        }
                    }
                }
                // no interaction found and old interaction still displayed, let's clear
                if (this.currentICID !== null) {
                    this.currentICID = null;
                    this.renderIC(null);
                }
            }

            let numberToInt = number => {
                return parseInt(number.toFixed());
            }

            /*
            Interaction replacements
           */
            this.replaceInterAction = (interactionHTML, interaction, callbackLitHTMl) => {
                //https://github.com/ccmjs/ccm/wiki/Responsive-Design impelmentiern
                if (this.behavior === "dynamic") {
                    if (interactionHTML === icEmpty) {
                        if (this.layout === "horizontal") {
                            jQuery(this.element.querySelector('#interactionContainer'))
                                .hide("slide", {direction: "right"}, 500, () => {
                                    $.replace(this.element.querySelector('#interaction'), $.html(interactionHTML, {
                                        checkResult: this.checkIfAnswerIsOK,
                                        request: this.performHTTPRequest,
                                        rmHeaders: this.removeHader,
                                        addHeaders: this.addHeader,
                                        backToVideo: this.backToVideoFunction,
                                        imageclickEvent: this.imageClick,
                                        closeImageModal: this.closeModal,
                                    }))
                                });
                        } else {
                            jQuery(this.element.querySelector('#interactionContainer'))
                                .hide("slide", {direction: "down"}, 500, () => {
                                    $.replace(this.element.querySelector('#interaction'), $.html(interactionHTML, {
                                        checkResult: this.checkIfAnswerIsOK,
                                        request: this.performHTTPRequest,
                                        rmHeaders: this.removeHader,
                                        addHeaders: this.addHeader,
                                        backToVideo: this.backToVideoFunction,
                                        imageclickEvent: this.imageClick,
                                        closeImageModal: this.closeModal,
                                    }));
                                });
                        }
                        return;
                    }
                    if (interactionHTML === null) {
                        callbackLitHTMl(interaction);
                        if (this.layout === "horizontal") {
                            jQuery(this.element.querySelector('#interactionContainer'))
                                .show("slide", {direction: "right"}, 500, () => {
                                    /*jQuery(this.element.querySelector('#playerContainer'))
                                        .hide("slide", {direction: "left" }, 500,()=>{
                                                this.element.querySelector('#interactionContainer').classList.toggle('exanded');
                                                jQuery(this.element.querySelector('#hidebutton')).toggle();
                                            }
                                        );*/
                                });
                        } else {
                            jQuery(this.element.querySelector('#interactionContainer'))
                                .show("slide", {direction: "up"}, 500);
                        }
                    } else {
                        $.replace(this.element.querySelector('#interaction'), $.html(interactionHTML, {
                            checkResult: this.checkIfAnswerIsOK,
                            request: this.performHTTPRequest,
                            rmHeaders: this.removeHader,
                            addHeaders: this.addHeader,
                            backToVideo: this.backToVideoFunction,
                            imageclickEvent: this.imageClick,
                            closeImageModal: this.closeModal,
                        }));
                        if (this.layout === "horizontal") {
                            jQuery(this.element.querySelector('#interactionContainer'))
                                .show("slide", {direction: "right"}, 500);
                        } else {
                            jQuery(this.element.querySelector('#interactionContainer'))
                                .show("slide", {direction: "up"}, 500);
                        }
                    }
                } else {
                    if (interactionHTML === icEmpty) {
                        jQuery(this.element.querySelector('#interaction'))
                            .slideUp(300, () => {
                                    if (interactionHTML != null) {
                                        $.replace(this.element.querySelector('#interaction'), $.html(interactionHTML, {
                                            checkResult: this.checkIfAnswerIsOK,
                                            request: this.performHTTPRequest,
                                            rmHeaders: this.removeHader,
                                            addHeaders: this.addHeader,
                                            backToVideo: this.backToVideoFunction,
                                            imageclickEvent: this.imageClick,
                                            closeImageModal: this.closeModal,
                                        }));
                                    }
                                }
                            );
                    } else if (interactionHTML === null) {
                        jQuery(this.element.querySelector('#interaction'))
                            .slideUp(300, () => {
                                    callbackLitHTMl(interaction);
                                    jQuery(this.element.querySelector('#interaction')).slideDown(300);
                                }
                            );
                    } else {
                        jQuery(this.element.querySelector('#interaction'))
                            .slideUp(300, () => {
                                    if (interactionHTML != null) {
                                        $.replace(this.element.querySelector('#interaction'), $.html(interactionHTML, {
                                            checkResult: this.checkIfAnswerIsOK,
                                            request: this.performHTTPRequest,
                                            rmHeaders: this.removeHader,
                                            addHeaders: this.addHeader,
                                            backToVideo: this.backToVideoFunction,
                                            imageclickEvent: this.imageClick,
                                            closeImageModal: this.closeModal,
                                        }));
                                    }
                                    jQuery(this.element.querySelector('#interaction')).slideDown(300);
                                }
                            );
                    }
                }
            }

            this.backToVideoFunction = () => {
                jQuery(this.element.querySelector('#interactionContainer')).show("slide", {direction: "right"}, 500);
                jQuery(this.element.querySelector('#playerContainer'))
                    .hide("slide", {direction: "left"}, 500, () => {
                            this.element.querySelector('#interactionContainer').classList.toggle('exanded');
                        }
                    );
                jQuery(this.element.querySelector('#hidebutton')).toggle();
            }

            this.imageClick = () => {
                this.pauseVideo();
                var modal = this.element.querySelector('#myModal')

                var img = this.element.querySelector("#myImg");
                var modalImg = this.element.querySelector("#img01");
                modal.style.display = "block";
                modalImg.src = img.src;
            }
            this.closeModal = () => {
                this.element.querySelector('#myModal').style.display = "none"
            }

            this.renderIC = async interaction => {
                if (interaction === null) {
                    this.interActionFactory(null);
                } else {
                    if (interaction.interactionBehavior === icNameStop) {
                        stoppedAutomatically = true;
                        this.pauseVideo();
                    }
                    this.interActionFactory(interaction);
                }
            }

            /*
                check functions
             */
            this.checkInteractionConfig = async () => {
                if ($.isObject(this.interactions)) {
                    this.interactions = Object.values(this.interactions);
                }
                this.interactions.forEach(value => {
                        switch (value.interactionType) {
                            case "single_answer":
                                if ($.isObject(value.single_answer_question.answers)) {
                                    value.single_answer_question.answers = Object.values(value.single_answer_question.answers);
                                }
                                break;
                            case "multiple_answer":
                                if ($.isObject(value.multiple_answer_question.answers)) {
                                    value.multiple_answer_question.answers = Object.values(value.multiple_answer_question.answers);
                                }
                                break;
                            case "httpcall":
                                if ($.isObject(value.headers)) {
                                    value.headers = Object.values(value.headers);
                                }
                                break;
                            default:
                        }
                    }
                )
                for (var i = 0; i < this.interactions.length; i++) {
                    this.interactions[i].id = i;
                }
                this.everyInterActionHasStart();
                await this.interactionsDontStartAtSameTime();
                const icNotInterference = await this.interactionHasNoInterference();
                if (!icNotInterference) {
                    await this.replaceInterAction(errorLoadingInteraction);
                }
            }

            this.interactionsDontStartAtSameTime = async () => {
                const tmp = [];
                for (const interaction of this.interactions) {
                    if (tmp.includes(interaction.timestart)) {
                        await this.replaceInterAction(errorLoadingInteraction);
                        break;
                    }
                    tmp.push(interaction.timestart);
                }
            }

            this.interactionHasNoInterference = async () => {
                for (var i = 0; i < this.interactions.length; i++) {
                    if (this.interactions[i].hasOwnProperty(timeEndFieldName)) {
                        for (var j = 0; j < this.interactions.length; j++) {
                            if (i !== j && this.interactions[j].hasOwnProperty(timeEndFieldName)) {
                                const startBetween = this.interactions[j].timestart <= this.interactions[i].timestart && this.interactions[i].timestart <= this.interactions[j].timestop;
                                const endBetween = this.interactions[j].timestart <= this.interactions[i].timestop && this.interactions[i].timestop <= this.interactions[j].timestop;
                                if (startBetween || endBetween) {
                                    return false;
                                }
                            }
                        }
                    }

                }
                for (i = 0; i < this.interactions.length; i++) {
                    for (j = 0; j < this.interactions.length; j++) {
                        if (i !== j && this.interactions.hasOwnProperty(timeEndFieldName)) {
                            const startBetween = this.interactions[j].timestart <= this.interactions[i].timestart && this.interactions[i].timestart <= this.interactions[j].timestop;
                            if (startBetween) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }

            this.everyInterActionHasStart = () => {
                this.interactions.every(interaction => {
                        if (!interaction.hasOwnProperty(timeStartFieldName)) {
                            this.replaceInterAction(errorLoadingInteraction);
                            return false;
                        }
                        return true;
                    }
                )
            }

            this.gaptext = interaction => {
                //borowed from cloze app
                results = {sections: []};

                var textinteraction = interaction.gaptext;
                keywords_data = [];


                const regex_keyword = new RegExp('\\' + mark + '.+?\\' + mark, 'g');                     // regular expression for finding all gaps/keywords in the text
                const regex_keyword_ = new RegExp('(\\' + mark + '.+?\\' + mark + ')(</.*?>)?( )', 'g');  // regular expression for whitespace behind a gap
                const regex_given = /\(.+?\)/g;                                                                    // regular expression for finding all given characters of a keyword
                const regex_reference = /^#(\d+)$/;                                                                    // regular expression for finding a gap reference

                // iterate all keywords in the text to determine the information data for each keyword
                (textinteraction.match(regex_keyword) || []).forEach(keyword => {

                    // remove distinguishing characteristic '*'
                    keyword = keyword.substr(1, keyword.length - 2);

                    // prevent escaped HTML in a keyword
                    keyword = $.unescapeHTML(keyword);

                    // the same as a previous gap? => use reference of previous gap
                    if (regex_reference.test(keyword)) return keywords_data.push(keywords_data[keyword.substr(1) - 1]);

                    const entry = [];
                    const split = keyword.split('/');
                    split.forEach((value, i) => {
                        if (value.endsWith('<') && i + 1 < split.length) {
                            split[i + 1] = split[i] + '/' + split[i + 1];
                            return;
                        }
                        entry.push(determineKeywordData(value.trim()));
                    });
                    keywords_data.push(entry);

                    function determineKeywordData(keyword) {

                        // replace all given characters of a keywords with '*'
                        const keyw__d = keyword.replace('*', '#').replace(regex_given, given => {
                            const length = given.length - 2;
                            given = '';
                            for (let i = 0; i < length; i++)
                                given += '*';
                            return given;
                        });

                        // determine given characters and hold this information in a single number (disadvantage: possible positions
                        let givens = 0;                                                      // for given letters in a word are 0-31
                        for (let i = 0; i < keyw__d.length; i++)                           // because of data type limitations)
                            if (keyw__d.charAt(i) === '*') givens += Math.pow(2, i);

                        // determine solution word
                        keyword = keyword.replace(regex_given, given => given.substr(1, given.length - 2));

                        // determine placeholder value
                        let placeholder = '';
                        if (!self.blank)
                            for (let j = 0; j < keyword.length; j++)
                                placeholder += Math.pow(2, j) & givens ? keyword.charAt(j) : '_';

                        return {word: keyword, placeholder: placeholder};
                    }

                });

                // prevent loose of whitespace behind a gap
                textinteraction = textinteraction.replace(regex_keyword_, "$1" + "$2" + '&nbsp;');

                // replace gaps/keywords with empty span elements
                textinteraction = textinteraction.replace(regex_keyword, '<span class="gap"></span>');


                /**
                 * predefined answers for text gaps
                 * @type {string[]}
                 */
                const keywords = self.keywords === true ? keywords_data.map(keyword => keyword[0].word) : self.keywords;

                // generated list of predefined answers? => sort predefined answers lexicographical
                this.keywords === true && keywords.sort((a, b) => a.localeCompare(b));

                //LIT HTML RENDER
                this.helperTemplate.render(this.helperTemplate.mainGapText(), (this.element.querySelector('#interaction')));  // prepare main HTML structure

                this.element.querySelector('#text').innerHTML = textinteraction;         // render text including gaps

                // determine size of longest solution word
                let max_length = 0;
                keywords_data.forEach(keyword => keyword.forEach(keyword => {
                    if (keyword.word.length > max_length) max_length = keyword.word.length;
                }));
                dataset = []
                // render a input field into each gap
                this.element.querySelectorAll('.gap').forEach((gap_elem, i) => {

                    const value = $.deepValue(dataset, 'sections.' + i + '.input');
                    const size = self.blank ? this.size || max_length : keywords_data[i][0].word.length;
                    const maxlength = self.blank ? max_length : size;
                    const onInput = () => {
                        const event_data = {gap: 1 + i, input: this.value};
                        this.logger && this.logger.log('input', $.clone(event_data));
                        this.oninput && this.oninput(this, $.clone(event_data));
                    };
                    const onChange = () => {
                        const event_data = {gap: 1 + i, input: this.value};
                        this.logger && this.logger.log('change', $.clone(event_data));
                        this.onchange && this.onchange(this, $.clone(event_data));
                    };

                    // render input field
                    this.helperTemplate.render(this.helperTemplate.inputField(value, keywords_data[i][0].placeholder, size * 1.11, maxlength, onInput, onChange), gap_elem);

                });
                this.helperTemplate.render(this.helperTemplate.button(this.feedbackGapText), this.element.querySelector('#buttons'));

                //jQuery(this.element.querySelector('#interactionContainer')).show("slide", { direction: "right" }, 1000);
                //if (this.element.querySelector('#interactionContainer').classList.contains('collapsed')){
                //    this.element.querySelector('#interactionContainer').classList.toggle('collapsed');
                //}
                return textinteraction;
            }


            this.imageHTML = interaction => {
                //TODO mehrere bilder?
                let emptyContainer = this.createEmptyContainer();
                //emptyContainer.inner = "<div class=\"container-fluid\"><img src=\""+interaction.imageUrl+"\" class=\"img-fluid\" /></div>"
                emptyContainer.inner = {
                    "tag": "div",
                    "id": "container-fluid",
                    "inner": [{
                        "tag": "div",
                        "id": "imgWrap",
                        "onclick": "%imageclickEvent%",
                        "inner": {
                            "tag": "img",
                            "id": "myImg",
                            "class": "img-fluid",
                            "src": interaction.imageUrl
                        }
                    }, {
                        "tag": "div",
                        "class": "modal",
                        "id": "myModal",
                        "style": "display:none;",
                        "inner": [{
                            "tag": "span",
                            "class": "close",
                            "inner": "&times;", "onclick": "%closeImageModal%",
                        }, {
                            "id": "img01",
                            "tag": "img",
                            "class": "modal-content",
                            "inner": "&times;"
                        },
                            {
                                "id": "caption",
                                "tag": "div",
                            }
                        ]
                    }
                    ]
                }
                return emptyContainer;
                //LIT HTML RENDER
                //this.helperTemplate.render(this.helperTemplate.imageHTMLRender2( this, this ),(this.element.querySelector('#interaction') ));  // prepare main HTML structure
                //jQuery('#exampleModal').modal();
            }
            this.ccmapp = interaction => {
                let emptyContainer = this.createEmptyContainer();
                emptyContainer.inner = "<iframe src=\"" + interaction.ccmappURL + "\" title=\"CMM APP\" width=\"100%\" height=\"100%\"></iframe>"
                return emptyContainer;
                //LIT HTML RENDER
                //this.helperTemplate.render(this.helperTemplate.imageHTMLRender2( this, this ),(this.element.querySelector('#interaction') ));  // prepare main HTML structure
                //jQuery('#exampleModal').modal();
            }

            this.performHTTPRequest = () => {
                this.performHTTPRequest
            }


            this.feedbackGapText = () => {
                // set initial state for detail information's of the gap results
                results.sections = [];
                results.correct = 0;

                // iterate over all gap input fields
                this.element.querySelectorAll('.gap input').forEach((gap, i) => {

                    /**
                     * event data (contains information's about the input field)
                     * @type {Object}
                     */
                    const event_data = {
                        gap: 1 + i,      // number of the text gap
                        input: gap.value,  // user input
                        solution: [],         // list of correct solution words
                        correct: false,      // true: correct user input value
                        nearly: false       // true: almost correct user input value
                    };

                    // add solution information to event data
                    event_data.solution = [];
                    keywords_data[i].forEach(keyword => {
                        event_data.solution.push(keyword.word);

                        // determine correctness of the user input value
                        if (keyword.used) return;
                        gap.value = gap.value.trim();
                        if (gap.value === keyword.word) {
                            event_data.correct = true;
                            results.correct++;
                        }
                        if (gap.value.toLowerCase() === keyword.word.toLowerCase()) {
                            event_data.nearly = true;
                            keyword.used = true;
                        }
                        this.onvalidation && !self.onvalidation(self, event_data);  // trigger individual 'validation' callback
                    });

                    // give visual feedback for correctness
                    //gap.disabled = true;
                    if (true) {
                        if (!event_data.nearly && self.solutions) gap.value = '';
                        if (true) {
                            let placeholder = '';
                            for (let j = 0; j < keywords_data[i].length; j++)
                                if (!keywords_data[i][j].used) {
                                    placeholder = keywords_data[i][j].word;
                                    break;
                                }
                            gap.setAttribute('placeholder', placeholder);
                        }
                        gap.parentNode.classList.add(event_data.correct ? 'correct' : (event_data.nearly ? 'nearly' : 'wrong'));
                    }

                    // set detail information's for current gap result
                    results.sections.push(event_data);

                });

                // restore original keywords information data
                keywords_data.forEach(keyword => keyword.forEach(keyword => delete keyword.used));

                if (results.sections.length === 0) return;                       // no evaluation results? => abort
                this.logger && this.logger.log('feedback', $.clone(results));  // logging of 'feedback' event
                this.onfeedback && this.onfeedback(this, $.clone(results));    // trigger individual 'feedback' callback

            }

            this.normalText = interaction => {
                let html = this.createEmptyContainer();
                html.inner = {"tag": "pre", "inner": interaction.text}
                return html;
            }
            this.htmlInteraction = interaction => {
                let html = this.createEmptyContainer();
                html.inner = "<iframe srcdoc='" + interaction.htmlAsValue + "\' title=\"HTML\" width=\"100%\" height=\"100%\"></iframe>"
                //todo add bootstrap cointainer
                return html;
            }
            this.htmltextInteraction = interaction => {
                let html = this.createEmptyContainer();
                html.inner = interaction.htmltext;
                //todo add bootstrap cointainer
                return html;
            }

            this.createEmptyContainer = () => {
                return JSON.parse(JSON.stringify(icEmpty))
            }

            this.singleAnswerQuestion = interaction => {
                var copiedHTML = this.createEmptyContainer();
                copiedHTML.class = copiedHTML.class + " radioQuestion"
                copiedHTML.inner = {"tag": "fieldset", "inner": []};
                copiedHTML.inner.inner.push(
                    {
                        "tag": "h3",
                        "class": "question",
                        "style": "white-space: pre-wrap;",
                        "inner": interaction.single_answer_question.text
                    }
                )

                for (var i = 0; i < interaction.single_answer_question.answers.length; i++) {
                    var answerTmp = interaction.single_answer_question.answers[i];
                    copiedHTML.inner.inner.push(
                        {
                            "tag": "div",
                            "inner": [
                                {
                                    "id": "radioChoose" + i,
                                    "tag": "input",
                                    "type": "radio",
                                    "name": "singleAnswerQuestion",
                                    "class": "innerRadioQuestion answer " + (answerTmp.correct ? "correctAnswer" : "falseAnswer")
                                },
                                {
                                    "tag": "label",
                                    "for": "radioChoose" + i,
                                    "inner": answerTmp.answer
                                }
                            ]
                        })
                }
                copiedHTML.inner.inner.push(
                    {
                        "tag": "button",
                        "id": "button-check",
                        "class": "innerRadioQuestion btn btn-primary btn-sm",
                        "onclick": "%checkResult%",
                        "type": "button",
                        "inner": "Check"
                    }
                )
                return copiedHTML;
            }

            this.multipleAnswerQuestion = interaction => {
                let copiedHTML = this.createEmptyContainer();
                copiedHTML.class = copiedHTML.class + " radioQuestion"
                copiedHTML.inner = {"tag": "fieldset", "inner": []};
                copiedHTML.inner.inner.push({
                    "tag": "h3",
                    "class": "question",
                    "inner": interaction.multiple_answer_question.text
                });

                for (let i = 0; i < interaction.multiple_answer_question.answers.length; i++) {
                    let answerTmp = interaction.multiple_answer_question.answers[i];
                    let preName = "checkboxChoose"
                    copiedHTML.inner.inner.push(
                        {
                            "tag": "div",
                            "inner": [
                                {
                                    "id": preName + i,
                                    "tag": "input",
                                    "type": "checkbox",
                                    "name": "singleAnswerQuestion",
                                    "class": "innerRadioQuestion answer " + (answerTmp.correct ? "correctAnswer" : "falseAnswer")
                                },
                                {
                                    "tag": "label",
                                    "for": preName + i,
                                    "inner": answerTmp.answer
                                }
                            ]
                        })
                }
                copiedHTML.inner.inner.push(
                    {
                        "tag": "button",
                        "id": "button-check",
                        "class": "innerRadioQuestion btn btn-primary btn-sm",
                        "onclick": "%checkResult%",
                        "type": "button",
                        "inner": "Check"
                    }
                )
                return copiedHTML;
            }

            this.httpCallInteraction = interaction => {
                icTmpHTTP = $.clone(this.interactions[this.currentICID]);
                this.interactions[this.currentICID].headers

                //https://gomakethings.com/how-to-use-async-and-await-with-vanilla-javascript/
                //https://github-wiki-see.page/m/ccmjs/ccm/wiki/Loading-of-Resources method	HTTP method to use: 'PUT', 'GET', 'POST', 'DELETE', 'fetch' or 'JSONP' (default is 'POST').
                var copiedHTML = this.createEmptyContainer();
                var htmlOfHTTPInteraction = [
                    {
                        "tag": "div",
                        "class": "container",
                        "style": "font-size: 11pt!important",
                        "inner": [
                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "style": "font-size: 11pt!important",
                                "inner": {
                                    "tag": "div",
                                    "class": "col12",
                                    "style": "white-space: pre-wrap;",
                                    "inner": interaction.httpDescription
                                }

                            },
                            {
                                "tag": "div",
                                "class": "row mt-3 formSection",
                                "inner": [
                                    {
                                        "tag": "div",
                                        "class": "col-sm-2",
                                        "inner": {
                                            "style": "",
                                            "tag": "label",
                                            "for": "url",
                                            "inner": "URL : ",
                                            "class": "span3",

                                        }
                                    },
                                    {
                                        "id": "url",
                                        "class": "form-control",
                                        "style": "max-width 80%;    width: 80% !important;",
                                        "tag": "input",
                                        "type": "text",
                                        "value": interaction.httpURL

                                    }
                                ]

                            },
                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "inner": [
                                    {
                                        "tag": "label",
                                        "for": "http_method",
                                        "style": "width: 140px;",
                                        "inner": "HTTP Method : "

                                    },
                                    {
                                        "id": "http_method_select",
                                        "name": "http_method",
                                        "style": "width: 100px;",
                                        "class": "col-sm-1 form-control",
                                        "tag": "select", "inner": [
                                            {"tag": "option", "value": "GET", "inner": "GET"},
                                            {"tag": "option", "value": "HEAD", "inner": "HEAD"},
                                            {"tag": "option", "value": "POST", "inner": "POST"},
                                            {"tag": "option", "value": "PUT", "inner": "PUT"},
                                            {"tag": "option", "value": "DELETE", "inner": "DELETE"},
                                            {"tag": "option", "value": "CONNECT", "inner": "CONNECT"},
                                            {"tag": "option", "value": "OPTIONS", "inner": "OPTIONS"},
                                            {"tag": "option", "value": "TRACE", "inner": "TRACE"},
                                            {"tag": "option", "value": "PATCH", "inner": "PATCH"}

                                        ]
                                    }
                                ]

                            },
                            {
                                "tag": "div",
                                "id": "httpHeadersRow",
                                "class": "row mt-3",
                                "inner": [
                                    {
                                        "tag": "div",
                                        "class": "col-sm-12",
                                        "inner": [
                                            {"tag": "label", "for": "payload", "inner": "HTTP Headers :"},
                                        ]

                                    },
                                ]
                            }, {
                                "tag": "div",
                                "class": "row",
                                "inner": [
                                    {
                                        "tag": "div",
                                        "class": "headerName col-sm-6",
                                        "type": "text",
                                        "style": "text-align: center;",
                                        "inner": "Header name"

                                    },
                                    {
                                        "tag": "div",
                                        "class": "headerValue col-sm-6",
                                        "type": "text",
                                        "style": "text-align: center;",
                                        "inner": "Header value"

                                    }]
                            },
                            {
                                "tag": "div",
                                "id": "httpHeaders",
                                "style": "margin-left : 5px;",
                                "class": "row mt-1",
                                "inner": []
                            },
                            {
                                "tag": "div",
                                "class": "row mt-1",
                                "inner": [
                                    {
                                        "tag": "button",
                                        "id": "button-addheader",
                                        "class": "btn btn-warning btn-sm col-sm-6",
                                        "onclick": "%addHeaders%",
                                        "type": "button",
                                        "inner": "Add"
                                    },
                                    {
                                        "tag": "button",
                                        "id": "button-removeheader",
                                        "class": "btn btn-danger btn-sm col-sm-6",
                                        "onclick": "%rmHeaders%",
                                        "type": "button",
                                        "inner": "Delete"
                                    },
                                ]

                            },
                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "inner": [
                                    {
                                        "tag": "label",
                                        "for": "payload",
                                        "class": "",
                                        "inner": "HTTP Body :"

                                    },
                                    {
                                        "id": "payload",
                                        "name": "payload",
                                        "class": "form-control",
                                        "style": "margin: 0;  padding: 0;  border:solid 1px; ",
                                        "tag": "textarea",
                                        "type": "text",
                                        "rows": "6"

                                    }
                                ]
                            },
                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "style": "",
                                "inner":
                                    {
                                        "tag": "button",
                                        "id": "button-request",
                                        "onclick": "%request%",
                                        "class": "btn btn-primary btn-sm",
                                        "type": "button",
                                        "inner": "Send request"
                                    }
                            },
                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "inner": [
                                    {
                                        "id": "responseStatus",
                                        "tag": "p",
                                        "for": "responseStatus",
                                        "inner": "HTTP Status :",
                                        "class": "col-sm-6",

                                    }
                                ]
                            },

                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "inner": [

                                    {
                                        "tag": "div",
                                        "class": "col-sm-3",
                                        "inner": "Response Body :",

                                    },
                                    {
                                        "id": "response",
                                        "class": "col-sm-9",
                                        "style": "margin: 0;  padding: 0;  border:solid 1px; ",
                                        "tag": "p"
                                    }
                                ]
                            },
                            {
                                "tag": "div",
                                "class": "row mt-3",
                                "inner": [{
                                    "tag": "p",
                                    "for": "payload",
                                    "class": "col-sm-3",
                                    "inner": "Expected Value :",


                                },
                                    {
                                        "id": "expectedValue",
                                        "class": "col-sm-9",
                                        "style": "margin: 0px; padding: 0px; border: 1px solid;",
                                        "tag": "p"
                                    }
                                ]
                            }]
                    }
                ]
                for (const header of this.interactions[this.currentICID].headers) {
                    var headerHTML = {
                        "tag": "div",
                        "class": "row",
                        "inner": [
                            {
                                "tag": "input",
                                "inner": "",
                                "class": "headerName col-sm-6",
                                "type": "text",
                                "value": header.headerName

                            },
                            {
                                "tag": "input",
                                "inner": "",
                                "class": "headerValue col-sm-6",
                                "type": "text",
                                "value": header.headerValue

                            }]
                    }
                    htmlOfHTTPInteraction[0].inner[5].inner.push(headerHTML);
                }
                copiedHTML.inner = htmlOfHTTPInteraction;
                return copiedHTML;
            }

            this.playVideo = async () => {
                //console.log("playVideo");
                await this.player.playVideo();
            }

            this.pauseVideo = async () => {
                //console.log("pauseVideo");
                this.player.pauseVideo();
            }

            this.getCurrentPlayerTime = () => {
                try {
                    return numberToInt(this.player.getCurrentTime());
                } catch (e) {
                    //not ready
                    return null;
                }
            }

            this.checkIfAnswerIsOK = () => {
                //console.log("checkIfAnswerIsOK");
                for (const querySelectorAllElement of this.element.querySelectorAll('.answer')) {
                    if (querySelectorAllElement.type === "checkbox") {
                        if (querySelectorAllElement.classList.contains("correctAnswer")) {
                            if (querySelectorAllElement.checked) {
                                querySelectorAllElement.parentNode.style.backgroundColor = "LightGreen"
                            } else {
                                querySelectorAllElement.parentNode.style.backgroundColor = "lightpink"
                            }
                        }
                        if (querySelectorAllElement.classList.contains("falseAnswer")) {
                            if (querySelectorAllElement.checked) {
                                querySelectorAllElement.parentNode.style.backgroundColor = "lightpink"
                            } else {
                                querySelectorAllElement.parentNode.style.backgroundColor = "LightGreen"
                            }
                        }
                    }
                    if (querySelectorAllElement.type === "radio") {
                        if (querySelectorAllElement.classList.contains("correctAnswer")) {
                            if (querySelectorAllElement.checked) {
                                querySelectorAllElement.parentNode.style.backgroundColor = "LightGreen"
                            } else {
                                querySelectorAllElement.parentNode.style.backgroundColor = "lightpink"
                            }
                        }
                    }
                }
                //this.startTikDelayed();
            }

            this.setInner = (elementID, text) => {
                this.element.querySelector(elementID).innerHTML = text.trim();
                // this.element.querySelector("#expectedValue").innerHTML = this.interactions[this.currentICID].expectedResponse
            }

            this.performHTTPRequest = async () => {
                let payload = this.element.querySelector('#payload').value;
                let url = this.element.querySelector('#url').value;
                let httpMethod = this.element.querySelector('#http_method_select').value;
                let fetchParam;
                let headersObject = {};

                for (const childNode of this.element.querySelector("#httpHeaders").childNodes) {
                    let headername = childNode.querySelector(".headerName");
                    if (headername && headername.value) {
                        headersObject[childNode.querySelector(".headerName").value] = childNode.querySelector(".headerValue").value;
                    }
                }
                //https://www.rfc-editor.org/rfc/rfc7231#page-24 , "HEAD and GET = no body"
                if (httpMethod === "HEAD" || httpMethod === "GET") {
                    fetchParam = {method: httpMethod, headers: headersObject};
                } else {
                    fetchParam = {method: httpMethod, body: payload, headers: headersObject};
                }
                fetch(url, fetchParam)
                    .then(response => {
                            if (response.ok) {
                                response.text().then(
                                    text => {
                                        this.setInner("#response", text);
                                        this.setInner("#expectedValue", this.interactions[this.currentICID].expectedResponse);
                                        this.setInner("#responseStatus", "HTTP Status : " + response.status + "");
                                        if (this.compareContentOfTwoString(text, this.interactions[this.currentICID].expectedResponse)) {
                                            //this.element.querySelector("#response").style.color = "green"
                                        } else {
                                            //this.element.querySelector("#response").style.color = "red"
                                        }
                                    }
                                );
                            } else {
                                return Promise.reject(response);
                            }
                        }
                    )
                    .catch(
                        error => {
                            this.setInner("#responseStatus", "Error during has been occurred.");
                            console.warn(error)
                        }
                    );
            }
            this.removeHader = async () => {
                //httpHeaders
                this.element.querySelector("#httpHeaders").removeChild(this.element.querySelector("#httpHeaders").lastElementChild);
            }

            this.addHeader = async () => {

                $.append(this.element.querySelector("#httpHeaders"), $.html({
                    "tag": "div",
                    "class": "row",
                    "inner": [
                        {
                            "tag": "input",
                            "inner": "",
                            "class": "headerName col-sm-6",
                            "type": "text",
                            "value": ""

                        },
                        {
                            "tag": "input",
                            "inner": "",
                            "class": "headerValue col-sm-6",
                            "type": "text",
                            "value": ""

                        }]
                }));
            }

            function onYouTubeIframeAPIReady() {
                console.log("reedy")
            }

            this.compareContentOfTwoString = (first, second) => {
                // clean of white spaces, then of new lines = "compare content"
                // example api returns pretty json , expected value "compressed" json
                //https://www.textfixer.com/tutorials/javascript-line-breaks.php#:~:text=Javascript%20Code%20for%20Line%20Break%20Removal&text=replace(%2F(%5Cr%5C,n%7C%5Cn%7C%5Cr.
                var cleanFirst = first.trim().replace(/\s+/g, "").replace(/(\r\n|\n|\r)/gm, "");
                var cleanSecond = second.trim().replace(/\s+/g, "").replace(/(\r\n|\n|\r)/gm, "");
                return cleanFirst === cleanSecond;
            }

            const events = {
                onPlayClick: () => {
                    this.element.querySelector('#playerContainer').removeChild(this.element.querySelector('#youtubeImage'));
                    this.element.querySelector('#iframe').classList.remove("invisible");
                    // embed YouTube Player
                    this.player = new YT.Player(this.element.querySelector('#iframe'), this.settings);

                },
                onAddHeader: () => {
                    icTmpHTTP.headers.push({"headerName": "", "headerValue": ""})

                }
            }
        }

    };

    let b = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
    if (window.ccm && null === window.ccm.files[b]) return window.ccm.files[b] = component;
    (b = window.ccm && window.ccm.components[component.name]) && b.ccm && (component.ccm = b.ccm);
    "string" === typeof component.ccm && (component.ccm = {url: component.ccm});
    let c = (component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/) || ["latest"])[0];
    if (window.ccm && window.ccm[c]) window.ccm[c].component(component); else {
        var a = document.createElement("script");
        document.head.appendChild(a);
        component.ccm.integrity && a.setAttribute("integrity", component.ccm.integrity);
        component.ccm.crossorigin && a.setAttribute("crossorigin", component.ccm.crossorigin);
        a.onload = function () {
            window.ccm[c].component(component);
            document.head.removeChild(a)
        };
        a.src = component.ccm.url
    }
})();
