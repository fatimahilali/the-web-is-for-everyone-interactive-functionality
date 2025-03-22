    // Bronnen:
    // developer.mozilla.org
    // https://stackoverflow.com/
    // https://codingnomads.com/handle-multiple-fetch-requests-javascript-promise-all
    // vorige jaar backend project 
    // squad page team 
    // debuggin: Chatgpt
    // Dion,Justus
    // https://docs.directus.io/reference/query.html  



// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')



// Route-handler voor de hoofdpagina ('/')
app.get('/', async function (request, response) {
  // Haal de data op van de Directus API
  const apiResponse = await fetch('https://fdnd-agency.directus.app/items/fabrique_art_objects');
  const apiResponseJSON = await apiResponse.json();

  // Render de Liquid-template en geef de data mee
  response.render('index.liquid', { artworks: apiResponseJSON.data });
});



// Route voor het weergeven van het admin-dashboard
app.get("/admin-dashboard", async (req, res) => {
  try {
    //  Haal het aantal likes per kunstwerk op met een API-aanvraag
    const likesRes = await fetch(
      "https://fdnd-agency.directus.app/items/fabrique_messages?aggregate[count]=id&groupBy=for"
    );
    const likesData = await likesRes.json(); // Zet de response om naar JSON

    //  Controleer of er data aanwezig is
    if (!likesData.data) {
      // Als er geen data is, render de pagina met een lege lijst van kunstwerken
      return res.render("admin-dashboard.liquid", { liked_artworks: [] });
    }

  

    // Haal de kunstwerken op en voeg het aantal likes toe
    const liked_artworks = await Promise.all(
      likesData.data.map(async ({ for: artworkId, count }) => {
        // Haal de gegevens van het specifieke kunstwerk op
        const artworkRes = await fetch(
          `https://fdnd-agency.directus.app/items/fabrique_art_objects/${artworkId}`
        );
        const artworkData = await artworkRes.json();

        // Controleer of er data is en voeg het aantal likes toe
        return artworkData.data ? { ...artworkData.data, likes: count.id || 0 } : null;
      })
    );

    // Render de admin-dashboard pagina met de kunstwerken en hun likes
    res.render("admin-dashboard.liquid", {
      liked_artworks: liked_artworks.filter(Boolean), // Verwijder null-waardes
    });
  } catch {
    //  Foutafhandeling - geef een foutmelding als er iets misgaat
    res.status(500).send("Er is een fout opgetreden bij het laden van de pagina.");
  }
});



// Route voor het liken van een kunstwerk
app.post("/like", async (req, res) => {
  // Stuur een POST-verzoek naar de Directus API om de like op te slaan
    let postresult = await fetch("https://fdnd-agency.directus.app/items/fabrique_messages/", {
      method: "POST",  // Nieuw bericht toevoegen
      headers: { "Content-Type": "application/json" }, // De data wordt als JSON verstuurd
      body: JSON.stringify({ 
          text: "like",          // De inhoud van het bericht is "like"
          for: req.body.artworkId, // ID van het gelikete kunstwerk
          from: "1"                 // Fake user-ID omdat er geen inlog is
      }),
  });
  //  Stuur de gebruiker terug naar de vorige pagina na het liken
  res.redirect('/admin-dashboard');
});




//  Detailpagina route voor  kunstwerk
app.get('/detail/:id', async function (request, response) {
    //  Haal het ID op uit de URL (bijv. /detail/42 → id = 42)
  const artworkId = request.params.id;

  //  Vraag gegevens op van het kunstwerk via de Directus API
  // Alleen de velden die er staan  worden opgehaald 
  const apiResponse = await fetch(`https://fdnd-agency.directus.app/items/fabrique_art_objects/${artworkId}?fields=title,titleAR,image,slug,summary,summaryAR`);
  const artworkData = await apiResponse.json();
  
  //  Render de detailpagina en geef het object door aan de template
  response.render('detail.liquid', {
    artwork: artworkData.data //in de template heet dit dus "artwork"
  });
});



// Stel het poortnummer in waar Express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})



