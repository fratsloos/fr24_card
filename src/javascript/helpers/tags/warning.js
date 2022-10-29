import { LitElement, html, css } from "lit";

export class Warning extends LitElement {
  static get properties() {
    return {
      config: { type: Object },
      message: { type: String },
    };
  }

  constructor() {
    super();
  }

  render() {
    // Return the table with the data
    return html`<style>
        :host {
          --fr24-warning-bg: ${this.config.colors.table_even_row_bg !== null
            ? this.config.colors.table_even_row_bg
            : "var(--primary-background-color)"};
          --fr24-warning-text: ${this.config.colors.table_even_row_text !== null
            ? this.config.colors.table_even_row_text
            : "var(--primary-text-color)"};
        }
      </style>
      <div>${this.message}</div>`;
  }

  static get styles() {
    return css`
      div {
        padding: 4px;
        background-color: var(--fr24-warning-bg);
        color: var(--fr24-warning-text);
        text-align: center;
      }
    `;
  }
}

customElements.define("fr24-warning", Warning);
