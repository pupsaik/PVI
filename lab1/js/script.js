import { loadComponent } from "./ui.js";

const tbody = document.getElementById("tableBody");

document.addEventListener("DOMContentLoaded", async () =>  {
    const width  = window.innerWidth || document.documentElement.clientWidth || 
    document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| 
    document.body.clientHeight;

    console.log(width, height);    
    //Завантаження хедеру і сайдбару
    await loadComponent("header", "components/header.html", "css/header.css");
    await loadComponent("sidebar", "components/sidebar.html", "css/sidebar.css");

    localStorage.setItem("username", "Yurii Stelmakh");
    document.getElementById("username").textContent = localStorage.getItem("username");

    //Індикатор повідомлень
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


    //Активний пункт меню
    let links = document.querySelectorAll(".sidebar .sidebar-buttons a");
    let currentPath = window.location.pathname.split("/").pop();

    console.log(currentPath);

    links.forEach(link => {
        let linkTrimmed = link.getAttribute("href").split("/").pop();
        if (linkTrimmed === currentPath) {
            link.classList.add("active");
        }
    });

    loadTable();
    attachButtonListeners();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker зареєстровано успішно:', registration.scope);
        })
        .catch(error => {
          console.log('Помилка реєстрації ServiceWorker:', error);
        });
    });
  }