let box = document.getElementById('box')
box.style.height = '100px'
box.style.width = '100px'


function display(){
    console.log(document.body.clientHeight);
    console.log(document.body.scrollHeight);
    console.log(document.body.getBoundingClientRect());
}

display()


