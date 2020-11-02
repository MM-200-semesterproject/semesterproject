


const btnAddTxt = document.getElementById('addTxt');

btnAddTxt.addEventListener('click', async evt => {

    newTxtElm();
    //let txt1 = new TextBox("Text");
    //txt1.spawnText(document.getElementById('slideDiv'));

})

let newTxtElm = async () => {
   
    let spawnElmModule = await import('./modules/spawningElement.js').then( data => {
        
    });
    
    console.log('new function works');
} 