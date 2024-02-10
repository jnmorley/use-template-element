export class useTemplate extends HTMLElement {
    static get observedAttributes() {
        return ["src"];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "open"});
        this.replaceEvent = new CustomEvent("template-replaced", {detail: this.shadow});
    }
    
    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "src") {
            let template = await this.fetchTemplate(newValue);
            this.shadow.replaceChildren(template.content.cloneNode(true));
            this.dispatchEvent(this.replaceEvent);    
        }
    }

    async fetchTemplate(url) {
        let res = await fetch(url);
        let htmlText = await res.text();
        
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlText, "text/html");
        return doc.head.firstChild;
    }
}
