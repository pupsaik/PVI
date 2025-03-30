export async function loadComponent(elementId, path, csspath = null) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load component ${path}`);
        }
        document.getElementById(elementId).innerHTML = await response.text();
        
        if(csspath) loadCss(csspath);
    }
    catch(error) {
        console.error(error);
    }
}

function loadCss(path) {
    if (!document.querySelector(`link[href="${path}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        document.head.appendChild(link);
    }
}