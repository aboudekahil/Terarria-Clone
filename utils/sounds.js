// Initialize the soundtrack and soundEffect variables
let soundtrack = null;

function initSoundtrack(sound) {
    // Create a new audio object and set it to loop
    soundtrack = new Audio(`sounds/${sound}.mp3`);
    soundtrack.loop = true;

    // Play the soundtrack silently
    soundtrack.volume = 0;
    soundtrack.play()
        .then(() => {
            // Ready to play, set volume back
            soundtrack.volume = 0.15;
        })
        .catch(error => {
            console.error('Error initializing soundtrack:', error);
        });
}

function changeSoundtrack(sound) {
    if (soundtrack) {
        soundtrack.pause();
        soundtrack.src = `sounds/${sound}.mp3`;
        soundtrack.play().catch(error => console.error('Error changing soundtrack:', error));
    }
}
