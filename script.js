const slider = document.getElementById("model-slider");
const viewer = document.getElementById("model-viewer")
let sliderTimeout;

// Slider update:
slider.addEventListener("input", function() {
    clearTimeout(sliderTimeout);

    const disp = String(this.value).padStart(3, "0");

    sliderTimeout = setTimeout(() => {
        const newSrc = `devstrain_d${disp}um.html`;

        if (!viewer.src.endsWith(newSrc)) {
            viewer.src = newSrc;
        }
    }, 300);
});
    //LaTeX rendering:
    window.MathJax = {
        tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
        }
    };