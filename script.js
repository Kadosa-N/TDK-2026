
const slider = document.getElementById("model-slider");
const viewer = document.getElementById("model-viewer");

let sliderTimeout;
let requestNumber = 0;

// Responsive viewer dimensions
function resizeViewer() {

    const mobile = window.matchMedia(
        "(max-width: 600px)"
    ).matches;

    viewer.style.height = mobile
        ? "800px"
        : "min(85vh, 750px)";

    if (viewer.data) {
        Plotly.relayout(viewer, {
            autosize: true,
            width: null,
            height: null
        });
    }
}

// Slider update
slider.addEventListener("input", function() {

    clearTimeout(sliderTimeout);

    const disp = String(this.value).padStart(3, "0");

    sliderTimeout = setTimeout(async () => {

        const thisRequest = ++requestNumber;

        const filename =
            `devstrain/nb08_devstrain_d${disp}um.json`;

        viewer.style.opacity = "0.5";

        try {

            const response = await fetch(filename);

            if (!response.ok) {
                throw new Error("Could not load " + filename);
            }

            const fig = await response.json();

            // Ignore outdated requests
            if (thisRequest !== requestNumber) return;

            // Adapt layout to available screen
            const isMobile = window.matchMedia(
    "(max-width: 600px)"
).matches;

const data = fig.data.map(trace => {

    if (!trace.colorbar) return trace;

    return {
        ...trace,
        colorbar: isMobile
            ? {
                ...trace.colorbar,
                orientation: "h",
                x: 0.5,
                xanchor: "center",
                y: 1.02,
                yanchor: "bottom",
                len: 0.75,
                thickness: 12,
                title: {text: ""}
            }
            : trace.colorbar
    };
});

const layout = {
    ...fig.layout,
    autosize: true,
    width: null,
    height: null,

    margin: isMobile
        ? {l: 0, r: 5, t: 115, b: 5}
        : fig.layout.margin,

    title: {
        ...fig.layout.title,
        y: 0.99,
        yanchor: "top"
    }
};

            await Plotly.react(
                viewer,
                data,
                layout,
                {
                    scrollZoom: true,
                    displaylogo: false,
                    responsive: true
                }
            );

            if (thisRequest === requestNumber) {
                viewer.style.opacity = "1";
            }

        } catch (error) {

            if (thisRequest === requestNumber) {
                console.error(error);
                viewer.style.opacity = "1";
            }

        }

    }, 300);
});

// Resize when browser dimensions change
window.addEventListener("resize", resizeViewer);

// Initial dimensions
resizeViewer();

// Load initial figure
slider.dispatchEvent(new Event("input"));


// LaTeX rendering
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
};
