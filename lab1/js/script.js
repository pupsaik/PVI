import { loadComponent } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () =>  {
    //Провантаження хедера і сайдбару
    await loadComponent("header", "components/header.html", "css/header.css");
    await loadComponent("sidebar", "components/sidebar.html", "css/sidebar.css");

    //Перевірка, чи повідомлення прочитані
    const button = document.getElementById("notification-button");

    if (!button) {
        console.error("Елемент #notification-button не знайдено!");
        return;
    }

    function updateBellIcon() {
        const isRead = localStorage.getItem("messagesRead") === "true";
        button.style.backgroundImage = isRead
            ? "url('../assets/images/bell.png')" 
            : "url('../assets/images/bell-new.png')";
    }

    updateBellIcon();

    button.addEventListener("click", () => {
        const isRead = localStorage.getItem("messagesRead") === "true";
        localStorage.setItem("messagesRead", isRead ? "false" : "true");
        updateBellIcon(); 
    });

    window.addEventListener("storage", (event) => {
        if (event.key === "messagesRead") {
            updateBellIcon();
        }
    });

    let links = document.querySelectorAll(".sidebar .sidebar-links a");
    console.log(links);
    let currentPath = window.location.pathname.split("/").pop();
    console.log(currentPath);

    links.forEach(link => {
        let linkTrimmed = link.getAttribute("href").split("/").pop();
        if (linkTrimmed === currentPath) {
            link.classList.add("active");
        }
    });
});