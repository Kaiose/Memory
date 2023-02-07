{
    let addContainer = document.querySelector('.add-record');
    let recordForm = document.querySelector('#record-form');
    let recordBtn = document.querySelector('.new-record');

    recordBtn.addEventListener('click', ()=>{
        window.history.pushState('Home', 'Home', '/record/create')

        gsap.to(addContainer, {
            duration: 1,
            opacity: "1",
            display: 'flex',
            onComplete: function(){
                gsap.to(recordForm, {
                    display: 'block',
                    opacity:1,
                    y: 0,
                    duration: 1,
                    ease:'elastic',
                    force3D: true
                })
            }
        })
    });
}