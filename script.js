//SCROLL VIDEO
const video = document.getElementById("scrollVideo");

//usuario baja
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight * window.innerHeight;
  const scrollFraction = scrollTop / docHeight;

  if (video.duration) {
    video.currentTime = video.duration = scrollFraction;
  }
});

// Cuando el video esté listo
video.addEventListener('loadedmetadata', () => {
  video.currentTime = 0;
  //video.play();
  video.pause();
});

//  MODO CLARO / OSCURO 
//const toggle = document.getElementById('bw');
//const body = document.body;

// Detecta modo del sistema
// if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//   body.classList.add('dark-mode');
// }

// toggle.addEventListener('click', () => {
//   body.classList.toggle('dark-mode');
// });

// Obtener valor del oro en USD y COP usando exchangerate.host
async function obtenerValorOro() {
  const elemento = document.getElementById("oro-valor");
  if (!elemento) return;

  const API_KEY = "3lZ_YagpxwsPY3HfhhHxxgQWtzUYoAz2vb0haDBFbVk";

  try {
    // 1) Oro XAU -> USD (precio de 1 onza en USD)
    const resOro = await fetch(
      `https://api.exchangerate.host/convert?access_key=${API_KEY}&from=XAU&to=USD`
    );
    const dataOro = await resOro.json();

    if (!dataOro.success || typeof dataOro.result !== "number") {
      console.error("Error oro:", dataOro);
      throw new Error(dataOro.error?.info || "Error API oro");
    }

    const precioUSD = dataOro.result;

    // 2) Tasa USD -> COP
    const resTasa = await fetch(
      `https://api.exchangerate.host/latest?access_key=${API_KEY}&base=USD&symbols=COP`
    );
    const dataTasa = await resTasa.json();

    if (!dataTasa.success || !dataTasa.rates?.COP) {
      console.error("Error tasa:", dataTasa);
      throw new Error(dataTasa.error?.info || "Error API tasa");
    }

    const tasaCOP = dataTasa.rates.COP;

    // 3) Calcular y mostrar
    const precioCOP = (precioUSD * tasaCOP).toFixed(0);
    elemento.textContent = `Oro: $${precioUSD.toFixed(2)} USD / $${precioCOP} COP`;
  } catch (error) {
    console.error("Error total:", error);
    elemento.textContent = "Error al cargar valor";
  }
}

obtenerValorOro();
setInterval(obtenerValorOro, 600000);