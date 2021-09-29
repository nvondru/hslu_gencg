function resizeIFrameToFitContent( iFrame ) {

    let bodyIFrame = iFrame.contentWindow.document.getElementsByTagName("body")[0];
    iFrame.width  = bodyIFrame.scrollWidth;
    iFrame.height = bodyIFrame.scrollHeight;
}


window.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {
        
        // or, to resize all iframes:
        var iframes = document.querySelectorAll("iframe");
        for( var i = 0; i < iframes.length; i++) {
            resizeIFrameToFitContent( iframes[i] );
        }
    }, 2000);
});