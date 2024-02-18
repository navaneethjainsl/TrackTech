function deleteEntry(button){
    if(confirm('Are you sure you want to delete?')){

        let form = document.querySelector(`#deleteform${button}`);
        form.submit();
        console.log(button)
    }

}