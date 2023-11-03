const textEditor = document.querySelector("#code-editor");
const code = document.querySelector("#code");

let identifierKeyword = ["var", "let", "const"]
// {tab:9},{enter:13},{shift:16},{ctrl:17},{alt:18},{capsLock:20},{esc:27},{space:32}
let keyCode = [9,13,16,17,18,20,27,32]
let speacialKey = ["Alt","Backspace","Tab","Shift","Control",]
let enteredValue = ""

function checkForKeyword(token){
    if(identifierKeyword.includes(token)){
        let spanNode = document.createElement("span")
        spanNode.className = "token keyword"
        spanNode.textContent = token;
        code.appendChild(spanNode);

    }else if(token !== " "){
        code.removeChild()
    }else{
        let spanNode = document.createElement("span")
        spanNode.className = "token whitespace"
        spanNode.textContent = token;
        code.appendChild(spanNode);
    }
}

function checkKeyInput(input){
    if(speacialKey.includes(input)){
        return;
    }
    if(input === " "){
        checkForKeyword(input);
    }else if(input === "Enter"){

    }
    else{
        enteredValue += input;
        checkForKeyword(enteredValue);
    }
    
}

textEditor.addEventListener("input",(event)=>{

    let dataInput = event.data;
    // console.log(event);
    console.log(dataInput);
    checkKeyInput(dataInput);
    
})
