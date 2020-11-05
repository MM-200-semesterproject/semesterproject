let txtNmbr = 0;

class TextBox {
    constructor (content) {

        this.content = content;

    }

    

    spawnText(slideDiv) {
        let elm = document.createElement("h3");
        elm.setAttribute('class', 'userAddedText');
        elm.setAttribute('contentEditable', 'true');
        elm.setAttribute('id', 'userText' + txtNmbr);
        elm.textContent = this.content;
        slideDiv.appendChild(elm);
        txtNmbr ++;
    }


}


export {TextBox};