
class TextBox {
    constructor (content) {

        this.content = content;

    }

    spawnText(slideDiv) {
        let elm = document.createElement("div");
        elm.textContent = this.content;
        slideDiv.appendChild(elm);
    }
}


export {TextBox};