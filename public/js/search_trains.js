function check(){
    let from = document.getElementsByTagName('select')[0].value;
    let to = document.getElementsByTagName('select')[1].value;
    let form = document.getElementById('form');
    
    if(from === to){
        alert('From and to cannot be same');
    }
    else{
        form.submit();
    }
}