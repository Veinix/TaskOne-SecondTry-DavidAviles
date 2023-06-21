"use strict";

// # Validation - Minimum: Title is mandatory and cannot contain numbers
(()=>{
    

    const addButton = document.querySelector("#addButton");
    addButton.addEventListener("click",()=>{
        if (validateForm()) {
            handleAddImage();
            document.getElementById("theForm").reset(); 
        }
    })

    const imgTitleBox = document.querySelector("#imgTitleBox");
    imgTitleBox.addEventListener("input", ()=>{
        imgTitleBox.classList.remove("is-invalid")
    })

    function validateForm() {
        
        if (regex(imgTitleBox.value) && imgTitleBox.value.length >= 3) return true;
        else {
        imgTitleBox.classList.add("is-invalid");
        return false;
        }
    }

    function regex(str) {
        return /^[A-Za-z\s]*$/.test(str);
    }

    //# Adding image and updating the album container
    function handleAddImage(){
        let storedImages = localStorage.getItem("album");
        let imgArray = [];
        if (storedImages) imgArray = JSON.parse(storedImages);

        // # Adding image to local storage (array of strings)
        const imgTitleBox = document.querySelector("#imgTitleBox"); 
        const imgURLBox = document.querySelector("#imgURLBox"); 
        const imgDescBox = document.querySelector("#imgDescBox"); 

        let imgID = "img" + imgTitleBox.value.replace(/\s/g, "");
        let singleImg = [imgID, imgTitleBox.value,imgURLBox.value, imgDescBox.value]
        imgArray.push(singleImg);
        let imgJSON = JSON.stringify(imgArray);
        localStorage.setItem("album", imgJSON);

        // Load updated data
        loadData();
    }

    // # Displaying images from local storage
    function loadData() {
        let storedImages = localStorage.getItem("album");
        if (!storedImages) return;
        let imgArray = JSON.parse(storedImages);
        let albumContainerHTML = "";

        for (let i = 0; i < imgArray.length; i++) {
            const singleImage = imgArray[i]
            albumContainerHTML += `
            <div class="col my-3" id="${singleImage[0]}">
                <div class="card image-card">
                    <div class="card-header text-center">
                        ${singleImage[1]}
                    </div>
                    <div class="card-body p-0">
                        <img src="${singleImage[2]}">
                        <p class="card-text pt-3 px-3" id="desc${singleImage[0]}">${singleImage[3]}</p>
                        <span class="removeButton">X</span>
                    </div>
                </div>
            </div> `
        }

        const albumContainer = document.querySelector("#albumContainer");
        albumContainer.innerHTML = albumContainerHTML;
    }

        const albumContainer = document.getElementById("albumContainer");
        albumContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("removeButton")) {
            let imgID = event.target.parentElement.parentElement.parentElement.getAttribute("id");
            handleRemoveImage(imgID);
        }
        });


    function handleRemoveImage(imgID){
        // # Deleting images from local storage and screen
        console.log(imgID)
        document.getElementById(`${imgID}`).remove();

        //Loading the array from storage
        let storedImages = localStorage.getItem("album");
        let imgArray = JSON.parse(storedImages);
        
        //Splicing the selected item (sticky note) from the array
        imgArray.forEach(singleImage => {
            if (singleImage.includes(imgID)) {
                let index = imgArray.indexOf(singleImage);
                imgArray.splice(index, 1);
            }
        });

        //Saving the deletion
        let imgJSON = JSON.stringify(imgArray);
        localStorage.setItem("album", imgJSON);
    }

    albumContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("card-text")) {
            let descID = event.target.getAttribute("id");
            console.log(descID);
            handleDescriptionEdit(descID);
        }
    });

    function handleDescriptionEdit(descID) {
    // # BONUS: Ability to edit the description
        const oldText = document.getElementById(`${descID}`).innerHTML;
        console.log(oldText)
        document.getElementById("newDescriptionBox").value = oldText;

        const myModal = new bootstrap.Modal('#editModal', {
            keyboard: false
          })
          
        const modalToggle = document.getElementById("toggleMyModal");
        myModal.show(modalToggle)


        const saveEditDescButton = document.getElementById("saveEditDesc");
        saveEditDescButton.addEventListener("click", ()=> {
        const newText = document.getElementById("newDescriptionBox").value;
        const oldTextBox = document.getElementById(`${descID}`);
        oldTextBox.innerHTML = newText;
        myModal.hide(modalToggle)

        //Loading the array from storage
        let storedImages = localStorage.getItem("album");
        let imgArray = JSON.parse(storedImages);

        //Finding the image

        let imgID = document.getElementById(`${descID}`).parentElement.parentElement.parentElement.getAttribute("id");
        
        imgArray.forEach(singleImage => {
            if (singleImage.includes(imgID)) {
                let index = imgArray.indexOf(singleImage);
                imgArray[index][3] = newText;
            }
        });

        //Saving the changes
        let imgJSON = JSON.stringify(imgArray);
        localStorage.setItem("album", imgJSON);

        })
    }
  
    
    // On page load, load images
    loadData();
})();




