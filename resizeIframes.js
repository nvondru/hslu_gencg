function resizeIFrameToFitContent( iFrame ) {

    let bodyIFrame = iFrame.contentWindow.document.getElementsByTagName("body")[0];
    let htmlIFrame = iFrame.contentWindow.document.getElementsByTagName("html")[0];
    iFrame.width  = bodyIFrame.scrollWidth;
    iFrame.height = Math.max( bodyIFrame.scrollHeight, bodyIFrame.offsetHeight, 
        htmlIFrame.clientHeight, htmlIFrame.scrollHeight, htmlIFrame.offsetHeight )
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