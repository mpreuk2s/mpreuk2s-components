import { html, render } from 'https://unpkg.com/lit-html@1.4.1/lit-html.js?module';
export { render };
export function main( text ) {
    return html`<h>${text}</h>`;
}