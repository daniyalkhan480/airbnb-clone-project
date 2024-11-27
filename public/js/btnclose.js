let btns = document.querySelectorAll(".close-button");

for(btn of btns){
    btn.addEventListener("click",(event)=>{
        // console.log("btn",btn);
        // console.log("btn parent",btn.parentElement);
        let flashDiv = btn.parentElement;
        flashDiv.style.display = "none";
    });
}