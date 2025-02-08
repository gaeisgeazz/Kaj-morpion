document.getElementById("valentineForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    let name = document.getElementById("nameInput").value;
    let messageContainer = document.getElementById("messageContainer");
    let message = document.getElementById("message");

    message.textContent = "Joyeuse Saint-Valentin, " + name + " ! ❤ Envoie le a l'élu de ton coeur";
    messageContainer.classList.remove("hidden");

    generateHearts();
});

function generateHearts() {
    let heartsContainer = document.querySelector(".hearts-container");

    for (let i = 0; i < 20; i++) {
        let heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 2 + 3 + "s"; // Différentes vitesses
        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 10000); // Supprime les cœurs après 5 secondes
    }
}

document.getElementById('valentineForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('audioFrame').src = "y2mate.com - Black Clover  Opening 3  Black Rover.mp3"; // Active l'audio
    // Ajoutez d'autres actions ici si nécessaire
  });