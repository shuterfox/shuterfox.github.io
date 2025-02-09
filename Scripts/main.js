var NightState = false;

const context = cast.framework.CastReceiverContext.getInstance();

context.addCustomMessageListener("urn:x-cast:com.werewolvesCompanion.changeState", (event) => {
    console.log("Received Change StateEvent")
    changerImage();
});

context.start();

function changerImage() {
    var background = document.getElementById("background");
    var overlay = document.getElementById("overlay");
    var newImage = GetDayNightImage(NightState);

    // Active l'overlay noir (fondu vers le noir)
    overlay.style.opacity = 1;

    // Après 1 seconde (durée du fondu), change l’image et refait apparaître en douceur
    setTimeout(() => {
        background.style.backgroundImage = `url('${newImage}')`;
        overlay.style.opacity = 0; // Dissipation du noir
        NightState = !NightState;
    }, 1000);
}

function GetDayNightImage(val) {
    return val ? 'includes/VillageJour.webp' : 'includes/VillageNuit.webp';
}