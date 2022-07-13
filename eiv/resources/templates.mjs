
import {html, render} from 'https://ccmjs.github.io/akless-components/libs/lit/lit.js';

export {render};

export function mainTemplate(imageUrl,events) {
    return html`
        <div id="mainContainer" class="main horizontalMain">
            <div id="playerContainer" class="video-container">
                <div id="iframe" class="invisible"></div>
                 <img id="youtubeImage" style="display: block;
   margin: auto auto;" src="https://img.youtube.com/vi/${imageUrl}/hqdefault.jpg"  @click=${() => events.onPlayClick()}>
            </div>
            <div id="interactionContainer" class="interactionContainer" >
                <div id="interaction" class="interactionInner">
                </div>
            </div>
        </div>
    `;
}

export function mainGapText(instance,keywords) {
    return html`
        <div class="container">
            <div  id="keywords" ?data-hidden=${!keywords}>
                        ${keywords && keywords.map( keyword => html`
                  <div class="keyword"><span @click="${event => event.target.classList.toggle( 'marked' )}">${instance.helper.escapeHTML( keyword )}</span></div>
                ` )}
            </div>
            <div id="interaction2" class="row mt-1">
                <div class="row">
                    <div id="text"></div>
                </div>
                <div class="row formSection">
                    <div id="buttons"></div>
                </div>
                <div class="row">
                </div>
            </div>
    `;
}

export function inputField(value = '', placeholder = '', size = 10, maxlength = '', onInput, onChange) {
    return html`<input type="text" size="${size}" maxlength="${maxlength}" autocorrect="off" autocapitalize="none"
                       placeholder="${placeholder}" @input="${onInput}" @change="${onChange}">`;
}
export function button(onFeedback) {
    return html`
        <div id="feedback">
            <button class="btn btn-primary btn-sm" style="margin-bottom: 15px;" @click="${onFeedback}">Prüfen</button>
        </div>
    `;
}
export function resetButtonGaptext(onFeedback,onReset) {
    return html`
        <div id="reset">
            <button class="btn btn-primary btn-sm" style="margin-bottom: 15px;" @click="${onReset}">Nochmal versuchen</button>
        </div>
    `;
}

export function imageHTMLRender(url) {
    return html`
        <div class="container">
            <div class="row">
                <div class="row">
                    <img src="${url}" class="img-fluid fill">
                </div>
                <div class="row">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-bs-target="#imageModal">Popup
                        image
                    </button>

                </div>
            </div>
        </div>
        <div id="imageModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-body">
                        <img src="${url}" class="img-responsive">
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function hideButton(onclickFn) {
    return html`
        <div id="hidebutton">
            <button class="btn btn-primary btn-sm" style="margin-bottom: 15px;">Back to video</button>
        </div>
    `;
}

export function httpCall(instance,tmpHeaders){
    return html`
        <div className="container" style="font-size: 11pt!important">
            <table style="width: 100%">
                <tr>
                    <td>
                        ${instance.interactions[instance.currentICID].httpDescription}>
                    </td>
                </tr>
                <tr>
                    <td>
                        ${instance.interactions[instance.currentICID].httpDescription}>
                    </td>
                    <td>
                        <input id="url" class="form-control" type="text" value="${instance.interactions[instance.currentICID].httpURL}"></div>
                    </td>
                </tr>
                <tr>
                    <td>
                        HTTP Methode :
                    </td>
                    <td>
                        <select id="http_method_select" name="http_method" class="col-sm-7">
                            <option value="GET" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("GET")}>GET</option>
                            <option value="HEAD" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("HEAD")}>HEAD</option>
                            <option value="POST" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("POST")}>POST</option>
                            <option value="PUT" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("PUT")}>PUT</option>
                            <option value="DELETE" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("DELETE")}>DELETE</option>
                            <option value="CONNECT" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("CONNECT")}>CONNECT</option>
                            <option value="OPTIONS" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("OPTIONS")}>OPTIONS</option>
                            <option value="TRACE" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("TRACE")}>TRACE</option>
                            <option value="PATCH" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("PATCH")}>PATCH</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        HTTP Headers :
                    </td>
                    <td>
                        <table>
                            <tr>
                                <th>
                                    Header name
                                </th>
                                <th>
                                    Header value
                                </th>
                                <th>
                                <th style="width: 120px;">
                                </th>
                            </tr>
                            ${ Object.values( icTmpHTTP.headers ).map(header =>  html`
                                    <td>                   
                                        <input type="text" 
                                               class="form-control headerName"
                                               placeholder=""
                                               value="${header.headerName}" }/>
                                    </td>
                                    <td>
                                        <input type="text" name="headers.${header.key}.headerValue"
                                               class="form-control headerValue" id="headers.${header.key}.headerValue"
                                               interaction placeholder=""
                                               value="${header.headerValue}" }/>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-warning btn-sm" title="Add interaction"
                                                @click=${() => instance.events.onDeleteHTTPCallHeader(interaction.key, header.key)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                 class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd"
                                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            `)}
                        </table>
                        <select id="http_method_select" name="http_method" class="col-sm-7">
                            <option value="GET" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("GET")}>GET</option>
                            <option value="HEAD" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("HEAD")}>HEAD</option>
                            <option value="POST" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("POST")}>POST</option>
                            <option value="PUT" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("PUT")}>PUT</option>
                            <option value="DELETE" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("DELETE")}>DELETE</option>
                            <option value="CONNECT" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("CONNECT")}>CONNECT</option>
                            <option value="OPTIONS" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("OPTIONS")}>OPTIONS</option>
                            <option value="TRACE" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("TRACE")}>TRACE</option>
                            <option value="PATCH" ?selected=${JSON.stringify(instance.interactions[instance.currentICID]) === JSON.stringify("PATCH")}>PATCH</option>
                        </select>
                    </td>
                </tr>
        
            </table>
                <button type="button" class="btn btn-warning btn-sm" title="Add interaction"
                @click=${() => events.onDeleteHTTPCallHeader(interaction.key, header.key)}>
            
            <div className="row mt-3"><label for="http_method" class="col-sm-4">HTTP Method : </label></div>
            <div id="httpHeadersRow" className="row mt-3">
                <div className="col-sm-3"><label htmlFor="payload">HTTP Headers :</label></div>
                <div className="col-sm-2">
                    <button id="button-check" className="addHeaders" style="height : 30px; width: 30px;" type="button">+
                    </button>
                    <button id="button-check" className="innerRadioQuestion" style="height : 30px; width: 30px;"
                            type="button">-
                    </button>
                </div>
                <div id="httpHeaders" style="margin-left : 5px;" className="col-sm-7">
                    <div className="row">
                        <div className="headerName col-sm-6" type="text">Header name</div>
                        <div className="headerValue col-sm-6" type="text">Header value</div>
                    </div>
                    <div className="row"><input className="headerName col-sm-6" type="text" value="Content-Type">
                        <input
                            className="headerValue col-sm-6" type="text" value="application/json; charset=utf-8"></div>
                </div>
            </div>
            <div className="row mt-3"><label htmlFor="payload" className="col-sm-3">HTTP Body :</label><textarea id="payload"
                                                                                                                 name="payload"
                                                                                                                 className="col-sm-9"
                                                                                                                 style="margin: 0;  padding: 0;  border:solid 1px; "
                                                                                                                 type="text"
                                                                                                                 rows="6"></textarea>
            </div>
            <div className="row mt-3" style="">
                <button id="button-request" className="btn btn-primary btn-sm" type="button">Send Request</button>
            </div>
            <div className="row mt-3"><p id="responseStatus" htmlFor="responseStatus" className="col-sm-6">HTTP Status :</p>
            </div>
            <div className="row mt-3">
                <div className="col-sm-3">Response Body :</div>
                <p id="response" className="col-sm-9" style="margin: 0;  padding: 0;  border:solid 1px; "></p></div>
            <div className="row mt-3"><p htmlFor="payload" className="col-sm-3">Expected Value :</p><p id="expectedValue"
                                                                                                       className="col-sm-9"
                                                                                                       style="margin: 0px; padding: 0px; border: 1px solid;"></p>
            </div>
        </div>
    `;
}

