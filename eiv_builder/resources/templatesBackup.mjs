/**
 * @overview HTML templates of ccm component for building a fill-in-the-blank text
 * @author André Kless <andre.kless@web.de> 2020-2021
 */

import {html, render, repeat, unsafeHTML} from 'https://ccmjs.github.io/akless-components/libs/lit/lit.js';

export {render};

/**
 * returns the main HTML template
 * @param {Object} config - initial app configuration
 * @param {Object} builder - app builder instance
 * @returns {TemplateResult} main HTML template
 */
export function main(config, builder, events) {
    const text = text => new DOMParser().parseFromString(text, 'text/html').body.textContent.trim() || '';
    return html`
        <form>
            <div class="accordion" id="eiv-accordion">
                <!-- General Settings -->
                <div class="card" id=" ">
                    <div class="card-header p-1" id="eiv-general-heading">
                        <h2 class="mb-0">
                            <!-- disabled collapse <button class="btn btn-lg btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#eiv-general-collapse" aria-expanded="false" aria-controls="eiv-general-collapse">-->
                            <button class="btn btn-lg btn-block text-left collapsed" type="button"
                                    data-toggle="collapse"
                                    data-target="#eiv-general-collapse" aria-expanded="true"
                                    aria-controls="eiv-general-collapse">
                                General Settings
                            </button>
                        </h2>
                    </div>
                    <div id="eiv-general-collapse" class="collapse show" aria-labelledby="eiv-general-heading"
                         data-parent="#eiv-accordion">
                        <div class="card-body">
                            <div class="form-group">
                                <label class="font-weight-bold" for="eiv-youtubeUrl-btn">Youtube URL</label>
                                <span type="button" data-toggle="collapse" data-target="#eiv-info-youtubeUrl"
                                      aria-expanded="false" aria-controls="eiv-info-youtubeUrl">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                         class="bi bi-info-circle-fill text-info mb-1"
                                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </span>
                                <div class="collapse" id="eiv-info-youtubeUrl">
                                    <div class="bg-info text-light rounded p-2">
                                        Please Enter Youtube ID.
                                    </div>
                                </div>
                                <input type="text" name="youtubeUrl" class="form-control" id="eiv-youtubeUrl-btn"
                                       value="${config.video}" required>
                            </div>
                            <!-- Layout -->
                            <div class="form-group">
                                <label class="font-weight-bold" for="eiv-layout">Layout</label>
                                <span type="button" data-toggle="collapse" data-target="#eiv-info-layout"
                                      aria-expanded="false" aria-controls="eiv-info-layout">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                         class="bi bi-info-circle-fill text-info mb-1"
                                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </span>
                                <div class="collapse" id="eiv-info-layout">
                                    <div class="bg-info text-light rounded p-2">
                                        Choose between prefered a layout format.
                                    </div>
                                </div>
                                <select class="form-control" name="layout" id="eiv-layout">
                                    ${Object.values(builder.ignore.layout).map(obj => html`
                                        <option value="${obj.key}"
                                                ?selected=${JSON.stringify(config.layout) === JSON.stringify(obj.value)}>
                                            ${obj.title}
                                        </option>`)}
                                </select>
                            </div>
                            <!-- Behavior -->
                            <div class="form-group">
                                <label class="font-weight-bold" for="eiv-layout">Behavior of interaction area</label>
                                <span type="button" data-toggle="collapse" data-target="#eiv-info-behavior"
                                      aria-expanded="false" aria-controls="eiv-info-behavior">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                         class="bi bi-info-circle-fill text-info mb-1"
                                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </span>
                                <div class="collapse" id="eiv-info-behavior">
                                    <div class="bg-info text-light rounded p-2">
                                        Choose between a behavior of interaction. Static means, the area of interaction
                                        is
                                        always displayed. Dynamic means the area of interaction is automaticaly opened
                                        and
                                        closed.
                                    </div>
                                </div>
                                <select class="form-control" name="behavior" id="eiv-behavior">
                                    ${Object.values(builder.ignore.behavior).map(obj => html`
                                        <option value="${obj.key}"
                                                ?selected=${JSON.stringify(config.behavior) === JSON.stringify(obj.value)}>
                                            ${obj.title}
                                        </option>`)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- IC Editor Settings -->
                <div class="card" id=" ">
                    <div class="card-header p-1" id="eiv-ic-editor-heading">
                        <h2 class="mb-0">
                            <!-- disabled collapse <button class="btn btn-lg btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#eiv-ic-editor-collapse" aria-expanded="false" aria-controls="eiv-ic-editor-collapse">-->
                            <button class="btn btn-lg btn-block text-left collapsed" type="button"
                                    data-toggle="collapse"
                                    data-target="#eiv-ic-editor-collapse" aria-expanded="false"
                                    aria-controls="eiv-ic-editor-collapse">
                                Interaction Editor
                            </button>
                        </h2>
                    </div>
                    <div id="eiv-ic-editor-collapse" class="collapse hide" aria-labelledby="eiv-ic-editor-heading"
                         data-parent="#eiv-accordion">
                        <div class="card-body">

                            ${interactionBuild(config, builder, events, null, null)}


                            <!-- Add IC -->
                            <div>
                                <button type="button" class="btn btn-primary btn-sm" title="Add interaction"
                                        @click=${() => events.onAdd()}>
                                    Add interaction
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Preview Button -->
            <button type="button" class="btn btn-info btn-block mt-0" data-toggle="modal" data-target="#eiv-preview"
                    ?data-hidden=${!builder.preview}>${builder.preview}
            </button>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-block mt-0" 
                    ?data-hidden=${!builder.onfinish || !builder.submit}>${builder.submit}
            </button>
            <div id="fileSection" ?data-hidden=${!builder.download}>
            </div>
            <button type="button" class="btn btn-info btn-block mt-0" data-toggle="modal" data-target="#eiv-download-modal"
                    ?data-hidden=${!builder.download}>${builder.download}
            </button>
        </form>

        <!-- Modal: Download -->
        <div id="eiv-download-modal" class="modal" role="dialog">
            <div class="modal-dialog modal-dialog-scrollable modal-xl">
                <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h5 class="modal-title">File download</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div id="eiv-preview-body" class="modal-body p-0 container">
                        <div class="d-flex justify-content-center align-items-center spinner">
                            <button type="button" class="btn btn-info btn-block mt-0" data-toggle="modal" data-target="#eiv-preview"
                                    @click=${ () => events.onDownloadConfig() }
                            >Configuratin file: 
                            </button>
                            <button type="button" class="btn btn-info btn-block mt-0" data-toggle="modal" data-target="#eiv-preview"
                                    @click=${ () => events.onDownloadHTML() }
                            >HTML file
                            </button>
                            <a id="fileDownloadConfig" hidden></a>
                            <a id="fileDownloadHTML" hidden></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal: Edit Text -->
        <div id="mcb-edit-modal" class="modal" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content"></div>
            </div>
        </div>

        <!-- Modal: Preview -->
        <div class="modal fade" id="eiv-preview" tabindex="-1" aria-labelledby="App Preview" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-xl">
                <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h5 class="modal-title">App Preview</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div id="eiv-preview-body" class="modal-body p-0 container">
                        <div class="d-flex justify-content-center align-items-center spinner">
                            <div class="spinner-border text-success" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function interactionBuild(config, builder, events) {
    //${icHTTPCall(config, builder,events,interaction,index)}
    return html`${repeat(Object.values(config.interactions), interaction => interaction.key, interaction => html`
                <table style="width: 100%">
                    <tr>
                        <td>
                            <div class="form-group">
                                ${icName(config, builder, events, interaction, interaction.key)}
                                ${icTypeSelect(config, builder, events, interaction, interaction.key)}
                                ${icSetTime2(config, builder, events, interaction, interaction.key)}
                                ${icArtSelect(config, builder, events, interaction, interaction.key)}
                                ${icGapText(config, builder, events, interaction, interaction.key)}
                                ${icPureHTML(config, builder, events, interaction, interaction.key)}
                                ${icHTMLText(config, builder, events, interaction, interaction.key)}
                                ${icCCMApp(config, builder, events, interaction, interaction.key)}
                                ${imageIC(config, builder, events, interaction, interaction.key)}
                                ${icMultiple(config, builder, events, interaction, interaction.key)}
                                ${icSingleAnswer(config, builder, events, interaction, interaction.key)}
                                ${icHTTPCall(config, builder, events, interaction, interaction.key)}
                                <div id="empty${interaction.key}" class="form-group" }>

                                </div>
                                <div class="mb-3 formSection">

                                </div>
                        </td>
                    </tr>
                </table>
            `
    )
    }
    `
}

export function icName(config, builder, events, interaction, index) {

    return html`
        <div class="form-group">
            <label class="font-weight-bold">Interaction #${index}</label>
            <input type="text" name="interactions.${index}.key" class="form-control" id="key${index}"
                   value="${index}" hidden>
            <div style="float: right" class="form-group mb-3">
                <button type="button" class="btn btn-danger btn-sm" title="Add interaction"
                        @click=${() => events.onDelete(interaction.key)}>
                    Delete interaction
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>
                </button>
            </div>
        </div>
    `
}

export function icSetTime2(config, builder, events, interaction, index) {
    if (interaction.interactionBehavior === "singleStop") {
        return html`
            <div class="form-group mb-3">
                <label class="font-weight-bold" for="interactionSelect">Interaction start time :</label>
                <table>
                    <tr>
                        <th>
                            <label class="font-weight-bold" for="timestartMinute${index}">Minute:</label>
                            <input type="number" name="interactions.${index}.timestartMinute" class="form-control"
                                   id="timestartMinute${index}"
                                   value="${interaction.timestartMinute}" min="0" required>
                        </th>
                        <th>
                            <label class="font-weight-bold" for="timestartMinute${index}">Second :</label>
                            <input type="number" name="interactions.${index}.timestartSeconds" class="form-control"
                                   id="timestartSeconds${index}"
                                   value="${interaction.timestartSeconds}" min="0" max="60" required>
                        </th>
                    </tr>
                </table>
                <input type="number" name="interactions.${index}.timestopMinute" class="form-control"
                       id="timestopMinute${index}"
                       value="${interaction.timestopMinute}"
                       ?hidden=${JSON.stringify(interaction.interactionBehavior) === JSON.stringify("singleStop")}>
                <input type="number" name="interactions.${index}.timestopSeconds" class="form-control"
                       id="timestopSeconds${index}"
                       value="${interaction.timestopSeconds}"
                       ?hidden=${JSON.stringify(interaction.interactionBehavior) === JSON.stringify("singleStop")}>
            </div>
        `
    }
    return html`
        <div class="form-group">
            <table>
                <td style="width: 150px;">
                    <label class="font-weight-bold" for="interactionSelect">Interaction time : </label>
                </td>
                <td>
                     <table>
                                    <tr>
                                        <th>
                                            <label class="font-weight-bold" for="timestartMinute${index}">Start :</label>
                                        </th>
                                        <th>
                                            <label class="font-weight-bold" for="timestopMinute${index}">Stop :</label>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <label class="font-weight-bold" for="timestartMinute${index}">Minute :</label>
                                                        <input type="number" name="interactions.${index}.timestartMinute"
                                                               class="form-control" id="timestartMinute${index}"
                                                               value="${interaction.timestartMinute}" required>
                                                    </td>
                                                    <td>
                                                        <label class="font-weight-bold" for="timestartSeconds${index}">Second :</label>
                                                        <input type="number" name="interactions.${index}.timestartSeconds"
                                                               class="form-control" id="timestartSeconds${index}"
                                                               value="${interaction.timestartSeconds}" required>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <label class="font-weight-bold" for="timestopMinute${index}">Minute :</label>
                                                        <input type="number" name="interactions.${index}.timestopMinute"
                                                               class="form-control" id="timestopMinute${index}"
                                                               value="${interaction.timestopMinute}" required>
                                                    </td>
                                                    <td>
                                                        <label class="font-weight-bold" for="timestopSeconds${index}">Second :</label>
                                                        <input type="number" name="interactions.${index}.timestopSeconds"
                                                               class="form-control" id="timestopSeconds${index}"
                                                               value="${interaction.timestopSeconds}" required>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                </td>
            </table>
        </div>
    `
}

export function icSetTime(config, builder, events, interaction, index) {
    if (interaction.interactionBehavior === "singleStop") {
        return html`
            <div class="form-group">
                <label class="font-weight-bold" for="interactionSelect">Interaction start time</label>
                <div class="form-group row">
                    <label class="font-weight-bold" for="timestartMinute${index}">Start minute:</label>
                    <input type="number" name="interactions.${index}.timestartMinute" class="form-control"
                           id="timestartMinute${index}"
                           value="${Object.values(config.interactions)[index].timestartMinute}" required>
                    <label class="font-weight-bold" for="timestartMinute${index}">second :</label>
                    <input type="number" name="interactions.${index}.timestartSeconds" class="form-control"
                           id="timestartSeconds${index}"
                           value="${Object.values(config.interactions)[index].timestartSeconds}" required>
                </div>
                <div>
                    <input type="number" name="interactions.${index}.timestopMinute" class="form-control"
                           id="timestopMinute${index}"
                           value="${Object.values(config.interactions)[index].timestopMinute}"
                           ?hidden=${JSON.stringify(interaction.interactionBehavior) === JSON.stringify("singleStop")}>
                    <input type="number" name="interactions.${index}.timestopSeconds" class="form-control"
                           id="timestopSeconds${index}"
                           value="${Object.values(config.interactions)[index].timestopSeconds}"
                           ?hidden=${JSON.stringify(interaction.interactionBehavior) === JSON.stringify("singleStop")}>
                </div>
            </div>
        `
    }
    return html`
        <div class="form-group">
            <label class="font-weight-bold" for="interactionSelect">Interaction time : </label>
            <div class="form-group">
                <div>
                    <label class="font-weight-bold" for="timestartMinute${index}">Start minute :</label>
                    <input type="number" name="interactions.${index}.timestartMinute" class="form-control"
                           id="timestartMinute${index}"
                           value="${Object.values(config.interactions)[index].timestartMinute}" required>
                    <label class="font-weight-bold" for="timestartSeconds${index}">second :</label>
                    <input type="number" name="interactions.${index}.timestartSeconds" class="form-control"
                           id="timestartSeconds${index}"
                           value="${Object.values(config.interactions)[index].timestartSeconds}" required>
                </div>
                <div>
                    <label class="font-weight-bold" for="timestopMinute${index}">Stop minute :</label>
                    <input type="number" name="interactions.${index}.timestopMinute" class="form-control"
                           id="timestopMinute${index}"
                           value="${Object.values(config.interactions)[index].timestopMinute}" required>
                    <label class="font-weight-bold" for="timestopSeconds${index}">second :</label>
                    <input type="number" name="interactions.${index}.timestopSeconds" class="form-control"
                           id="timestopSeconds${index}"
                           value="${Object.values(config.interactions)[index].timestopSeconds}" required>
                </div>
            </div>
        </div>
        </div>
    `
}

export function icTypeSelect(config, builder, events, interaction, index) {

    return html`
        <div class="form-group mb-3">
            <table>
                <tr>
                    <td>
                        <label class="font-weight-bold" id="${index}.labelSelectType" for="interactionSelect">Select interaction
                            type</label>
                        <span type="button" data-toggle="collapse" data-target="#eiv-info-layout"
                              aria-expanded="false" aria-controls="eiv-info-layout">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                         class="bi bi-info-circle-fill text-info mb-1"
                                         fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                              d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </span>
                        <div class="collapse" id="eiv-info-layout">
                            <div class="bg-info text-light rounded p-2">
                                Choose interacion type.
                            </div>
                        </div>
                    </td>
                    <td >
                        <select class="form-control" style="margin-left: 15px;width: 250px;" name="interactions.${index}.interactionBehavior"
                                id="interactionBehaviorSelect">
                            ${Object.values(builder.ignore.interactionBehavior).map(obj => html`
                            <option value="${obj.key}"
                                    ?selected=${JSON.stringify(interaction.interactionBehavior === JSON.stringify(obj.value))}>
                                ${obj.title}
                            </option>`)}
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    `
}

export function icArtSelect(config, builder, events, interaction, index) {

    return html`
        <div class="form-group mb-3">
            <label class="font-weight-bold" for="interactionType">Select interaction art # ${index} :</label>
            <select class="form-control" style="width: 250px;" name="interactions.${index}.interactionType"
                    id="interactionType">
                ${Object.values(builder.ignore.interactionType).map(obj => html`
                    <option value="${obj.key}"
                            ?selected=${JSON.stringify(interaction.interactionType) === JSON.stringify(obj.value)}>
                        ${obj.title}
                    </option>`)}
            </select>
        </div>
    `
}

export function icGapText(config, builder, events, interaction, index) {
    if (JSON.stringify(interaction.interactionType) !== JSON.stringify("gaptext")) {
        return html`<input type="text" name="interactions.${index}.gaptext" id="gaptextHidden${index}"
                           value="${interaction.gaptext}" } hidden>`
    }
    return html`
        <div id="gaptext${index}" class="imeditor" }></div>`
    //<div id="editor${index}Inner"></div>-->
    //return html`<div class="form-control editor-container" data-use-div-wrapper="1" data-id="inputEditor${index}" id="contentEditorDiv${index}" autocomplete="off"><p>Value</p></div>
    //<input type="hidden" name="name_for${index}" id="inputEditor${index}">`


}

export function imageIC(config, builder, events, interaction, index) {

    return html`
        <div class="form-group" ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("image")}>
            <label class="font-weight-bold" for="imageUrl${index}"
                   ?hidden=${JSON.stringify(interaction.interactionBehavior) !== JSON.stringify("image")}>Image URL:</label>
            <input type="text" name="interactions.${index}.imageUrl" class="form-control" id="imageUrl${index}"
                   placeholder="Enter image URL"
                   value="${interaction.imageUrl}" }>
        </div>
    `


}

export function icMultiple(config, builder, events, interaction, index) {

    return html`
        <div class="form-group"
             ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("multiple_answer")}>
            <div class="form-group">
                <label class="font-weight-bold" for="multiple_answer${index}">Question:</label>
                <textarea type="text" name="interactions.${index}.multiple_answer_question.text"
                          class="form-control"
                          id="multiple_answer${index}text"
                          rows="2">${interaction.multiple_answer_question.text}</textarea>


            </div>
            <div class="form-group">
                <div>
                    <p>Answers :</p>
                </div>
                <table style="width:100%">${answersMultiple(config, builder, events, interaction, index)}
                    <tr>
                        <td style="width: 60px; height: 40px;text-align: center">
                            <button type="button" class="btn btn-primary btn-sm" title="Add new answer"
                                    @click=${() => events.onAddAnswerMutlipleAnswer(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    `
}

export function icSingleAnswer(config, builder, events, interaction, index) {

    return html`
        <div class="form-group"
             ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("single_answer")}>
            <div class="form-group">
                <label class="font-weight-bold" for="single_answer${index}">Question:</label>
                <textarea type="text" name="interactions.${index}.single_answer_question.text"
                          class="form-control" id="single_answer${index}Text"
                          rows="2">${interaction.single_answer_question.text}</textarea>

            </div>
            <div class="form-group">
                <div>
                    <p class="">Answers :</p>
                </div>
                ${answersSingle(config, builder, events, interaction, index)}
            </div>
        </div>
    `
}

export function answersMultiple(config, builder, events, interaction, index) {
    return html`
        ${repeat(Object.values(interaction.multiple_answer_question.answers), answers => answers.key, answers => html`
            <tr>
                <td style="width: 50px;">
                    <input type="checkbox" class="form-control"
                           name="interactions.${index}.multiple_answer_question.answers.${answers.key}.correct"
                           id="interactions.${index}.multiple_answer_question.answers.${answers.key}.correct" }
                           ?checked=${answers.correct}
                    >
                </td>
                <td>
                    <input id="interactions.${index}.multiple_answer_question.answers.${answers.key}.answer"
                           type="textarea"
                           name="interactions.${index}.multiple_answer_question.answers.${answers.key}.answer"
                           class="form-control"
                           value="${answers.answer}" required>


                    <input id="interactions.${index}.multiple_answer_question.answers.${answers.key}.key"
                           type="text"
                           name="interactions.${index}.multiple_answer_question.answers.${answers.key}.key"
                           value="${answers.key}" hidden>
                </td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm" title="Add interaction"
                            @click=${() => events.onDeleteAnswerMultipleAnswer(interaction.key, answers.key)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </td>
            </tr>`)}
    `
}

export function answersSingle(config, builder, events, interaction, index) {
    return html`
        <div class="form-group">
            <table style="width: 100%;">
                ${repeat(Object.values(interaction.single_answer_question.answers), answers => answers.key, answers => html`
                    <tr>
                        <td style="width: 50px;">
                            <input type="text"
                                   name="interactions.${index}.single_answer_question.answers.${answers.key}.key"
                                   value="${answers.key}"
                                   id="interactions.${index}.single_answer_question.answers.${answers.key}.key" hidden>
                            <input type="radio" class="form-control row-cols-1"
                                   name="interactions.${index}.single_answer_question.correct"
                                   for="interactions.${index}.single_answer_question.correct"
                                   value="${answers.key}"
                                   id="interactions.${index}.single_answer_question.answers.${answers.key}].correct"
                                   ?checked=${JSON.stringify(answers.key) === JSON.stringify(interaction.single_answer_question.correct)}>
                        </td>

                        <td>
                            <input id="interactions.${index}.single_answer_question.answers.${answers.key}].answer"
                                   type="text"
                                   for="interactions.${index}.single_answer_question.answers.${answers.key}].correct"
                                   name="interactions.${index}.single_answer_question.answers.${answers.key}.answer"
                                   class="form-control row-cols-11"
                                   value="${answers.answer}" required>
                        </td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm" title="Add interaction"
                                    @click=${() => events.onDeleteAnswerSinleAnswer(interaction.key, answers.key)}>
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
                <tr>
                    <td style="width: 60px; height: 40px;text-align: center">
                        <button type="button" class="btn btn-primary btn-sm" title="Add interaction"
                                @click=${() => events.onAddAnswerSinleAnswer(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    `
}


export function icHTMLText(config, builder, events, interaction, index) {
    if (JSON.stringify(interaction.interactionType) !== JSON.stringify("htmltext")) {
        return html`<input type="text" name="interactions.${index}.htmltext" id="hiddenHtml${index}"
                           value="${interaction.htmltext}" } hidden>`
    }
    return html`
        <div id="htmltext${index}" class="imeditor"></div>`

}

export function icCCMApp(config, builder, events, interaction, index) {

    return html`
        <input type="textarea" name="interactions.${index}.ccmAppDmsURL" class="form-control"
               id="interactions.${index}.ccmAppDmsURL" placeholder="Pure HTML"
               value="${interaction.ccmAppDmsURL}"
               ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("ccmapp")}
        />
    `
    //    <div id="html${index}" class="imeditor" ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("html")}></div>
    //<div id="editor${index}Inner"></div>-->
    //return html`<div class="form-control editor-container" data-use-div-wrapper="1" data-id="inputEditor${index}" id="contentEditorDiv${index}" autocomplete="off"><p>Value</p></div>
    //<input type="hidden" name="name_for${index}" id="inputEditor${index}">`


}

export function icPureHTML(config, builder, events, interaction, index) {

    return html`
        <textarea type="textarea" name="interactions.${index}.htmlAsValue" class="form-control"
                  id="interactions.${index}.htmlAsValue" placeholder="Pure HTML"
                  ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("html")}
        >${interaction.htmlAsValue}</textarea>

    `
    //    <div id="html${index}" class="imeditor" ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("html")}></div>
    //<div id="editor${index}Inner"></div>-->
    //return html`<div class="form-control editor-container" data-use-div-wrapper="1" data-id="inputEditor${index}" id="contentEditorDiv${index}" autocomplete="off"><p>Value</p></div>
    //<input type="hidden" name="name_for${index}" id="inputEditor${index}">`


}

export function icHTTPCall(config, builder, events, interaction, index) {

    return html`
        <div id="httpCall${index}" class="form-group"
             ?hidden=${JSON.stringify(interaction.interactionType) !== JSON.stringify("httpcall")}>
            <table style="width: 100%;">
                <tr>
                    <th style="width: 120px;">
                        HTTP Method:
                    </th>
                    <th>
                        <select class="form-control" style="max-width: 120px;" name="interactions.${index}.httpMethod"
                                id="httpCall${index}httpMethod">
                            <option value="GET"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("GET")}>GET
                            </option>
                            <option value="POST"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("POST")}>POST
                            </option>
                            <option value="PUT"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("PUT")}>PUT
                            </option>
                            <option value="HEAD"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("HEAD")}>HEAD
                            </option>
                            <option value="DELETE"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("DELETE")}>
                                DELETE
                            </option>
                            <option value="CONNECT"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("CONNECT")}>
                                CONNECT
                            </option>
                            <option value="OPTIONS"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("OPTIONS")}>
                                OPTIONS
                            </option>
                            <option value="TRACE"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("TRACE")}>
                                TRACE
                            </option>
                            <option value="PATCH"
                                    ?selected=${JSON.stringify(interaction.httpMethod) === JSON.stringify("PATCH")}>
                                PATCH
                            </option>
                        </select>
                    </th>
                </tr>
                <tr>
                    <th style="width: 120px;">
                        HTTP URL:
                    </th>
                    <th>
                        <input type="textarea" name="interactions.${index}.httpURL" class="form-control"
                               id="imageUrl${index}" placeholder="Enter URL"
                               value="${interaction.httpURL}" }/>
                    </th>
                </tr>
                <tr>
                    <th style="width: 120px;">
                        Description :
                    </th>
                    <th>
                        <textarea class="form-control" id="descriptionHttp${index}"
                                  name="interactions.${index}.httpDescription" rows="3">${interaction.httpDescription}</textarea>
                    </th>
                </tr>
            </table>
            <table>
                <tr>
                    <th style="width: 120px;">
                    </th>
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
                <tr>
                    <th style="width: 120px;">
                        Headers:
                    </th>
                    <td>
                        <table style="width: 100%;">
                            ${icHTTPCallHeaders(config, builder, events, interaction, index)}
                        </table>
                    </td>
                </tr>
                <tr>
                    <th>

                    </th>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm" title="Add interactioaan"
                                @click=${() => events.onAddHTTPCallHeader(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            </table>
        </div>

    `
}

export function icHTTPCallHeaders(config, builder, events, interaction, index) {//<!--${ repeat( interaction.headers, (header) => header.key, headerTemplate ) }-->
    return html`
        ${repeat(Object.values(interaction.headers), header => header.key, header => html`
            <tr>
                <td><input type="textarea" name="interactions.${index}.headers.${header.key}.key"
                           class="form-control" id="interactions.${index}.headers.${header.key}.key"
                           placeholder=""
                           value="${header.key}" } hidden/>

                    <input type="textarea" name="interactions.${index}.headers.${header.key}.headerName"
                           class="form-control" id="interactions.${index}.headers.${header.key}.headerName"
                           placeholder=""
                           value="${header.headerName}" }/>
                </td>
                <td>
                    <input type="textarea" name="interactions.${index}.headers.${header.key}.headerValue"
                           class="form-control" id="interactions.${index}.headers.${header.key}.headerValue"
                           interaction placeholder=""
                           value="${header.headerValue}" }/>
                </td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm" title="Add interaction"
                            @click=${() => events.onDeleteHTTPCallHeader(interaction.key, header.key)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `)}    `
}
