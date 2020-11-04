
class TextBox {
    constructor (content) {

        this.content = content;

    }

    spawnText(slideDiv) {
        let elm = document.createElement("h3");
        elm.setAttribute('class', 'userAddedText');
        elm.setAttribute('contentEditable', 'true');
        elm.textContent = this.content;
        slideDiv.appendChild(elm);
    }
}


export {TextBox};