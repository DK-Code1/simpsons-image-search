import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { LanguageContext } from "../contexts/LanguageContext.jsx";

const translations = {
  title: {
    es: "Búsqueda por imagen",
    en: "Search by image",
    fr: "Recherche par image",
    pt: "Busca por imagem",
    it: "Ricerca per immagine",
    tr: "Görselle arama",
    ru: "Поиск по изображению",
    de: "Bildersuche",
    no: "Søk etter bilde" 
  },
  title_description: {
    es: "Encuentra episodios o escenas a partir de capturas de pantalla, con soporte de <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> y <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>",
    en: "Find episodes or scenes by screenshots, with <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> and <a href='https://frinkiac.com' target='_blank'>frinkiac.</a> support.",
    fr: "Trouvez des épisodes ou des scènes à partir de captures d'écran, avec le support de <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> et <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>.",
    pt: "Encontre episódios ou cenas a partir de screenshots, com suporte do <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> e <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>.",
    it: "Trova episodi o scene da screenshot, con supporto di <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> e <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>.",
    tr: "Ekran görüntülerinden bölüm veya sahneler bulun, <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> ve <a href='https://frinkiac.com' target='_blank'>frinkiac.</a> desteğiyle.",
    ru: "Находите эпизоды или сцены по скриншотам, с поддержкой <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> и <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>.",
    de: "Finde Episoden oder Szenen anhand von Screenshots, mit Unterstützung von <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> und <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>.",
    no: "Finn episoder eller scener ved hjelp av skjermbilder, med støtte for <a href='https://buscasimpsons.com/' target='_blank'' >buscasimpsons</a> og <a href='https://frinkiac.com' target='_blank'>frinkiac.</a>."
},
  how: {
    es: "¿Cómo funciona?",
    en: "How does it work?",
    fr: "Comment ça marche ?",
    pt: "Como funciona?",
    it: "Come funziona?",
    tr: "Nasıl çalışır?",
    ru: "Как это работает?",
    de: "Wie funktioniert es?",
    no: "Hvordan fungerer det?"
  },
  selectbackend: {
    es: "Seleccionar backend (fuente de imágenes):",
    en: "Select backend (image source):",
    fr: "Sélectionner le backend (source d'images) :",
    pt: "Selecionar backend (fonte de imagens):",
    it: "Seleziona backend (fonte immagini):",
    tr: "Backend seç (görsel kaynağı):",
    ru: "Выбрать бэкенд (источник изображений):",
    de: "Backend auswählen (Bildquelle):",
    no: "Velg backend (bildekilde):"
  },
  drop: {
    es: "Arrastra tu imagen aquí",
    en: "Drag your image here",
    fr: "Glissez votre image ici",
    pt: "Arraste sua imagem aqui",
    it: "Trascina la tua immagine qui",
    tr: "Görselinizi buraya sürükleyin",
    ru: "Перетащите ваше изображение сюда",
    de: "Ziehen Sie Ihr Bild hierher",
    no: "Dra bildet ditt hit"
  },
  click: {
    es: "O haz click para seleccionar",
    en: "Or click to select",
    fr: "Ou cliquez pour sélectionner",
    pt: "Ou clique para selecionar",
    it: "O clicca per selezionare",
    tr: "Veya seçmek için tıklayın",
    ru: "Или нажмите для выбора",
    de: "Oder klicken Sie zum Auswählen",
    no: "Eller klikk for å velge"
  },
  select_file: {
    es: "Seleccionar imagen",
    en: "Select image",
    fr: "Sélectionner une image",
    pt: "Selecionar imagem",
    it: "Seleziona immagine",
    tr: "Görsel seç",
    ru: "Выбрать изображение",
    de: "Bild auswählen",
    no: "Velg bilde"
  },
  file_limit: {
    es: "PNG, JPG, GIF hasta 50MB",
    en: "PNG, JPG, GIF up to 50MB",
    fr: "PNG, JPG, GIF jusqu'à 50MB",
    pt: "PNG, JPG, GIF até 50MB",
    it: "PNG, JPG, GIF fino a 50MB",
    tr: "PNG, JPG, GIF 50MB'a kadar",
    ru: "PNG, JPG, GIF до 50MB",
    de: "PNG, JPG, GIF bis zu 50MB",
    no: "PNG, JPG, GIF opp til 50MB"
  },
  or: {
    es: "O usa una URL:",
    en: "Or use an URL:",
    fr: "Ou utiliser une URL :",
    pt: "Ou use uma URL:",
    it: "O usa un URL:",
    tr: "Veya bir URL kullan:",
    ru: "Или используйте URL:",
    de: "Oder verwenden Sie eine URL:",
    no: "Eller bruk en URL:"
  },
  paste_url: {
    es: "Pega la URL de una imagen",
    en: "Paste URL of an image",
    fr: "Collez l'URL d'une image",
    pt: "Cole a URL de uma imagem",
    it: "Incolla l'URL di un'immagine",
    tr: "Bir görselin URL'sini yapıştırın",
    ru: "Вставьте URL изображения",
    de: "URL eines Bildes einfügen",
    no: "Lim inn URL til et bilde"
  },
  use_original: {
    es: "↺ Usar original",
    en: "↺ Use original",
    fr: "↺ Utiliser l'original",
    pt: "↺ Usar original",
    it: "↺ Usa originale",
    tr: "↺ Orijinali kullan",
    ru: "↺ Использовать оригинал",
    de: "↺ Original verwenden",
    no: "↺ Bruk original"
  },
  crop: {
    es: "✂️ Recortar",
    en: "✂️ Crop",
    fr: "✂️ Recadrer",
    pt: "✂️ Recortar",
    it: "✂️ Ritaglia",
    tr: "✂️ Kırp",
    ru: "✂️ Обрезать",
    de: "✂️ Zuschneiden",
    no: "✂️ Beskjær"
  },
  delete: {
    es: "✕ Eliminar",
    en: "✕ Delete",
    fr: "✕ Supprimer",
    pt: "✕ Excluir",
    it: "✕ Elimina",
    tr: "✕ Sil",
    ru: "✕ Удалить",
    de: "✕ Löschen",
    no: "✕ Slett"
  },
  search: {
    es: "🔍 Buscar",
    en: "🔍 Search",
    fr: "🔍 Rechercher",
    pt: "🔍 Buscar",
    it: "🔍 Cerca",
    tr: "🔍 Ara",
    ru: "🔍 Поиск",
    de: "🔍 Suchen",
    no: "🔍 Søk"
  },
  searching: {
    es: "Buscando...",
    en: "Searching...",
    fr: "Recherche en cours...",
    pt: "Buscando...",
    it: "Ricerca in corso...",
    tr: "Aranıyor...",
    ru: "Поиск...",
    de: "Suche läuft...",
    no: "Søker..."
  },
  results: {
    es: "Escenas encontradas",
    en: "Found scenes",
    fr: "Scènes trouvées",
    pt: "Cenas encontradas",
    it: "Scene trovate",
    tr: "Bulunan sahneler",
    ru: "Найденные сцены",
    de: "Gefundene Szenen",
    no: "Funnet scener"
  },
  results_images: {
    es: "Haz click en cualquier imagen para ver la imagen en ",
    en: "Click any image to see details in ",
    fr: "Cliquez sur n'importe quelle image pour voir les détails sur ",
    pt: "Clique em qualquer imagem para ver detalhes em ",
    it: "Clicca su qualsiasi immagine per vedere i dettagli su ",
    tr: "Detayları görmek için herhangi bir görsele tıklayın ",
    ru: "Нажмите на любое изображение, чтобы увидеть детали на ",
    de: "Klicken Sie auf ein beliebiges Bild, um Details auf ",
    no: "Klikk på et bilde for å se detaljer i "
  },
  card_upload_title: {
    es: "Sube una captura",
    en: "Upload a screenshot",
    fr: "Téléchargez une capture",
    pt: "Envie um screenshot",
    it: "Carica uno screenshot",
    tr: "Ekran görüntüsü yükle",
    ru: "Загрузите скриншот",
    de: "Screenshot hochladen",
    no: "Last opp et skjermbilde"
  },
  card_upload_description: {
    es: "De cualquier episodio de las primeras 20 temporadas",
    en: "From any episode of the first 20 seasons",
    fr: "De n'importe quel épisode des 20 premières saisons",
    pt: "De qualquer episódio das primeiras 20 temporadas",
    it: "Da qualsiasi episodio delle prime 20 stagioni",
    tr: "İlk 20 sezonun herhangi bir bölümünden",
    ru: "Из любого эпизода первых 20 сезонов",
    de: "Aus jeder Episode der ersten 20 Staffeln",
    no: "Fra hvilken som helst episode av de første 20 sesongene"
  },
  card_api_title: {
    es: "La API la analiza",
    en: "API analyzes it",
    fr: "L'API l'analyse",
    pt: "API analisa",
    it: "API lo analizza",
    tr: "API analiz eder",
    ru: "API анализирует его",
    de: "API analysiert es",
    no: "API analyserer det"
  },
  card_api_description: {
    es: "Utilizamos FAISS para encontrar coincidencias de tu imagen",
    en: "We use FAISS to find frames that matches your image",
    fr: "Nous utilisons FAISS pour trouver des images correspondantes",
    pt: "Usamos FAISS para encontrar quadros que correspondem à sua imagem",
    it: "Usiamo FAISS per trovare frame che corrispondono alla tua immagine",
    tr: "Görselinizle eşleşen kareleri bulmak için FAISS kullanıyoruz",
    ru: "Мы используем FAISS для поиска кадров, соответствующих вашему изображению",
    de: "Wir verwenden FAISS, um Bilder zu finden, die mit Ihrem Bild übereinstimmen",
    no: "Vi bruker FAISS for å finne bilder som matcher ditt bilde" 
  },
  card_results_title: {
    es: "Obtén resultados",
    en: "Get results",
    fr: "Obtenez des résultats",
    pt: "Obtenha resultados",
    it: "Ottieni risultati",
    tr: "Sonuçları al",
    ru: "Получите результаты",
    de: "Ergebnisse erhalten",
    no: "Få resultater"
  },
  card_results_description: {
    es: "Encuentra el episodio de tu captura y crea contenido",
    en: "Find the episode of your screenshot and make content",
    fr: "Trouvez l'épisode de votre capture et créez du contenu",
    pt: "Encontre o episódio do seu screenshot e crie conteúdo",
    it: "Trova l'episodio del tuo screenshot e crea contenuti",
    tr: "Ekran görüntünüzün bölümünü bulun ve içerik oluşturun",
    ru: "Найдите эпизод вашего скриншота и создавайте контент",
    de: "Finden Sie die Episode Ihres Screenshots und erstellen Sie Inhalte",
    no: "Finn episoden til skjermbildet ditt og lag innhold"
  },
  how_main_title: {
    es: "Cómo usar la búsqueda por imagen",
    en: "How to use the search by image",
    fr: "Comment utiliser la recherche par image",
    pt: "Como usar a busca por imagem",
    it: "Come usare la ricerca per immagine",
    tr: "Görselle arama nasıl kullanılır",
    ru: "Как использовать поиск по изображению",
    de: "Wie man die Bildersuche verwendet",
    no: "Hvordan bruke søk etter bilde"
  },
  how_upload_title: {
    es: "Subir imagen",
    en: "Upload image",
    fr: "Télécharger une image",
    pt: "Enviar imagem",
    it: "Carica immagine",
    tr: "Görsel yükle",
    ru: "Загрузить изображение",
    de: "Bild hochladen",
    no: "Last opp bilde" 
  },
  how_upload_description: {
    es: `<ul> <li>Se aceptan imágenes en cualquier formato (jpg, png, gif, webp, etc.)</li> <li>Arrastra y suelta una imagen</li> <li>O haz clic para seleccionar desde tu dispositivo</li> <li>También puedes pegar una URL de imagen</li> <li>Usa el editor de recorte para ajustar la imagen</li> </ul>`,
    en: `<ul> <li>We accept images in any format (jpg, png, gif, webp, etc.)</li> <li>Drag and drop an image</li> <li>Or click to select an image from your device</li> <li>You can also paste an image URL</li> <li>Use the image crop tool to adjust your image</li> </ul>`,
    fr: `<ul> <li>Nous acceptons les images dans tous les formats (jpg, png, gif, webp, etc.)</li> <li>Glissez-déposez une image</li> <li>Ou cliquez pour sélectionner une image depuis votre appareil</li> <li>Vous pouvez également coller une URL d'image</li> <li>Utilisez l'outil de recadrage pour ajuster votre image</li> </ul>`,
    pt: `<ul> <li>Aceitamos imagens em qualquer formato (jpg, png, gif, webp, etc.)</li> <li>Arraste e solte uma imagem</li> <li>Ou clique para selecionar uma imagem do seu dispositivo</li> <li>Você também pode colar uma URL de imagem</li> <li>Use a ferramenta de recorte para ajustar sua imagem</li> </ul>`,
    it: `<ul> <li>Accettiamo immagini in qualsiasi formato (jpg, png, gif, webp, ecc.)</li> <li>Trascina e rilascia un'immagine</li> <li>O clicca per selezionare un'immagine dal tuo dispositivo</li> <li>Puoi anche incollare un URL di un'immagine</li> <li>Usa lo strumento di ritaglio per regolare la tua immagine</li> </ul>`,
    tr: `<ul> <li>Tüm formatlarda görselleri kabul ediyoruz (jpg, png, gif, webp, vb.)</li> <li>Bir görseli sürükleyip bırakın</li> <li>Veya cihazınızdan bir görsel seçmek için tıklayın</li> <li>Ayrıca bir görsel URL'si yapıştırabilirsiniz</li> <li>Görselinizi ayarlamak için kırpma aracını kullanın</li> </ul>`,
    ru: `<ul> <li>Мы принимаем изображения в любом формате (jpg, png, gif, webp и т.д.)</li> <li>Перетащите и отпустите изображение</li> <li>Или нажмите, чтобы выбрать изображение с вашего устройства</li> <li>Вы также можете вставить URL изображения</li> <li>Используйте инструмент обрезки для настройки вашего изображения</li> </ul>`,
    de: `<ul> <li>Wir akzeptieren Bilder in jedem Format (jpg, png, gif, webp, etc.)</li> <li>Ziehen Sie ein Bild per Drag & Drop</li> <li>Oder klicken Sie, um ein Bild von Ihrem Gerät auszuwählen</li> <li>Sie können auch eine Bild-URL einfügen</li> <li>Verwenden Sie das Zuschneidewerkzeug, um Ihr Bild anzupassen</li> </ul>`,
    no: "<ul> <li>Vi aksepterer bilder i alle formater (jpg, png, gif, webp, osv.)</li> <li>Dra og slipp et bilde</li> <li>Eller klikk for å velge et bilde fra enheten din</li> <li>Du kan også lime inn en bilde-URL</li> <li>Bruk beskjæringsverktøyet for å justere bildet ditt</li> </ul>"
  },
  how_betterresults_title: {
    es: "Para mejores resultados",
    en: "For better results",
    fr: "Pour de meilleurs résultats",
    pt: "Para melhores resultados",
    it: "Per risultati migliori",
    tr: "Daha iyi sonuçlar için",
    ru: "Для лучших результатов",
    de: "Für bessere Ergebnisse",
    no: "For bedre resultater"
  },
  how_betterresults_description: {
    es: `<ul> <li>Usa capturas claras y sin editar</li> <li>Solo funciona con temporadas 1-20</li> <li>Evita imágenes muy pixeladas o recortadas</li> <li>NO agregues texto, memes o marcas de agua</li> <li>Si tu imagen tiene texto encima, recórtalo primero</li> <li>Si recortas, deja suficiente contexto visual</li> </ul>`,
    en: `<ul> <li>Use clear screenshots, without editing</li> <li>It only works for seasons 1 to 20</li> <li>Avoid too pixelated images or cropped</li> <li>Try not to use images with text, memes or watermarks</li> <li>If your image has too much text, try to crop it with the tool</li> <li>If you crop it, try to leave a clear frame of the scene</li> </ul>`,
    fr: `<ul> <li>Utilisez des captures d'écran claires, sans modification</li> <li>Cela ne fonctionne que pour les saisons 1 à 20</li> <li>Évitez les images trop pixelisées ou recadrées</li> <li>Évitez d'utiliser des images avec du texte, des mèmes ou des filigranes</li> <li>Si votre image a trop de texte, essayez de la recadrer avec l'outil</li> <li>Si vous recadrez, essayez de laisser un cadre clair de la scène</li> </ul>`,
    pt: `<ul> <li>Use screenshots claros, sem edição</li> <li>Funciona apenas para as temporadas 1 a 20</li> <li>Evite imagens muito pixeladas ou recortadas</li> <li>Tente não usar imagens com texto, memes ou marcas d'água</li> <li>Se sua imagem tiver muito texto, tente recortá-la com a ferramenta</li> <li>Se recortar, tente deixar um quadro claro da cena</li> </ul>`,
    it: `<ul> <li>Usa screenshot chiari, senza modifiche</li> <li>Funziona solo per le stagioni dalla 1 alla 20</li> <li>Evita immagini troppo pixelate o ritagliate</li> <li>Cerca di non usare immagini con testo, meme o watermark</li> <li>Se la tua immagine ha troppo testo, prova a ritagliarla con lo strumento</li> <li>Se la ritagli, cerca di lasciare un frame chiaro della scena</li> </ul>`,
    tr: `<ul> <li>Düzenlenmemiş, net ekran görüntüleri kullanın</li> <li>Sadece 1-20 sezonlar için çalışır</li> <li>Çok pikselleşmiş veya kırpılmış görsellerden kaçının</li> <li>Metin, meme veya filigran içeren görseller kullanmamaya çalışın</li> <li>Görselinizde çok fazla metin varsa, araçla kırpmayı deneyin</li> <li>Kırparsanız, sahnenin net bir çerçevesini bırakmaya çalışın</li> </ul>`,
    ru: `<ul> <li>Используйте четкие скриншоты без редактирования</li> <li>Работает только для сезонов 1-20</li> <li>Избегайте слишком пикселизированных или обрезанных изображений</li> <li>Старайтесь не использовать изображения с текстом, мемами или водяными знаками</li> <li>Если на вашем изображении слишком много текста, попробуйте обрезать его с помощью инструмента</li> <li>Если вы обрезаете, постарайтесь оставить четкий кадр сцены</li> </ul>`,
    de: `<ul> <li>Verwenden Sie klare Screenshots ohne Bearbeitung</li> <li>Es funktioniert nur für Staffeln 1 bis 20</li> <li>Vermeiden Sie zu verpixelte oder beschnittene Bilder</li> <li>Versuchen Sie, keine Bilder mit Text, Memes oder Wasserzeichen zu verwenden</li> <li>Wenn Ihr Bild zu viel Text hat, versuchen Sie es mit dem Zuschneidewerkzeug zu beschneiden</li> <li>Wenn Sie zuschneiden, versuchen Sie, einen klaren Rahmen der Szene zu belassen</li> </ul>`,
    no: "<ul> <li>Bruk klare skjermbilder uten redigering</li> <li>Det fungerer bare for sesong 1 til 20</li> <li>Unngå for pixelert eller beskåret bilder</li> <li>Prøv å ikke bruke bilder med tekst, memes eller vannmerker</li> <li>Hvis bildet ditt har for mye tekst, prøv å beskjære det med verktøyet</li> <li>Hvis du beskjærer det, prøv å la et klart bilde av scenen være igjen</li> </ul>" 
},
  how_tech_title: {
    es: "Tecnología",
    en: "Technology",
    fr: "Technologie",
    pt: "Tecnologia",
    it: "Tecnologia",
    tr: "Teknoloji",
    ru: "Технология",
    de: "Technologie",
    no: "Teknologi"
  },
  how_tech_description: {
    es: "Utilizamos FAISS (Facebook AI Similarity Search) para indexar y buscar fotogramas. Cuando subes una imagen, extraemos sus características visuales y las comparamos con nuestra base de datos de más de 100,000 fotogramas.",
    en: "We use FAISS (Facebook AI Similarity Search) to index and search frames. When you upload an image, the API extracts its visual features and compares it to the database of features with more than 100,000 frames.",
    fr: "Nous utilisons FAISS (Facebook AI Similarity Search) pour indexer et rechercher des images. Lorsque vous téléchargez une image, l'API extrait ses caractéristiques visuelles et les compare à la base de données de plus de 100 000 images.",
    pt: "Usamos FAISS (Facebook AI Similarity Search) para indexar e buscar quadros. Quando você envia uma imagem, a API extrai suas características visuais e as compara com o banco de dados de mais de 100.000 quadros.",
    it: "Usiamo FAISS (Facebook AI Similarity Search) per indicizzare e cercare frame. Quando carichi un'immagine, l'API estrae le sue caratteristiche visive e le confronta con il database di oltre 100.000 frame.",
    tr: "Kareleri indekslemek ve aramak için FAISS (Facebook AI Similarity Search) kullanıyoruz. Bir görsel yüklediğinizde, API görsel özelliklerini çıkarır ve 100.000'den fazla kareden oluşan veritabanıyla karşılaştırır.",
    ru: "Мы используем FAISS (Facebook AI Similarity Search) для индексации и поиска кадров. Когда вы загружаете изображение, API извлекает его визуальные особенности и сравнивает их с базой данных из более чем 100 000 кадров.",
    de: "Wir verwenden FAISS (Facebook AI Similarity Search) zum Indizieren und Suchen von Bildern. Wenn Sie ein Bild hochladen, extrahiert die API seine visuellen Merkmale und vergleicht sie mit der Datenbank von über 100.000 Bildern.",
    no: "Vi bruker FAISS (Facebook AI Similarity Search) for å indeksere og søke etter bilder. Når du laster opp et bilde, trekker API-en ut dens visuelle funksjoner og sammenligner dem med databasen med mer enn 100 000 bilder."
},
  how_cannotfind_title: {
    es: "¿No encuentras tu imagen?",
    en: "Can't find your image?",
    fr: "Vous ne trouvez pas votre image ?",
    pt: "Não encontrou sua imagem?",
    it: "Non trovi la tua immagine?",
    tr: "Görselinizi bulamıyor musunuz?",
    ru: "Не можете найти ваше изображение?",
    de: "Finden Sie Ihr Bild nicht?",
    no: "Finner du ikke bildet ditt?"
  },
  how_cannotfind_description: {
    es: `<ul> <li>Verifica que sea de las temporadas 1-20</li> <li>Intenta con una captura diferente del mismo episodio</li> <li>Asegúrate de que la imagen no esté muy editada</li> <li>Prueba buscar sin recortar la imagen</li> </ul>`,
    en: `<ul> <li>Verify that the image belong to the season 1-20, maybe it doesn't</li> <li>Try with a cleaner screenshot</li> <li>Make sure that the image is not heavily edited</li> <li>Try the cropping tool</li> </ul>`,
    fr: `<ul> <li>Vérifiez que l'image provient des saisons 1 à 20</li> <li>Essayez avec une capture d'écran différente du même épisode</li> <li>Assurez-vous que l'image n'est pas trop modifiée</li> <li>Essayez de rechercher sans recadrer l'image</li> </ul>`,
    pt: `<ul> <li>Verifique se a imagem é das temporadas 1-20</li> <li>Tente com um screenshot diferente do mesmo episódio</li> <li>Certifique-se de que a imagem não esteja muito editada</li> <li>Tente buscar sem recortar a imagem</li> </ul>`,
    it: `<ul> <li>Verifica che l'immagine appartenga alle stagioni 1-20</li> <li>Prova con uno screenshot diverso dello stesso episodio</li> <li>Assicurati che l'immagine non sia troppo modificata</li> <li>Prova a cercare senza ritagliare l'immagine</li> </ul>`,
    tr: `<ul> <li>Görselin 1-20 sezonlarına ait olduğunu doğrulayın</li> <li>Aynı bölümden farklı bir ekran görüntüsü deneyin</li> <li>Görselin aşırı düzenlenmediğinden emin olun</li> <li>Görseli kırpmadan aramayı deneyin</li> </ul>`,
    ru: `<ul> <li>Убедитесь, что изображение относится к сезонам 1-20</li> <li>Попробуйте другой скриншот из того же эпизода</li> <li>Убедитесь, что изображение не сильно отредактировано</li> <li>Попробуйте поискать без обрезки изображения</li> </ul>`,
    de: `<ul> <li>Stellen Sie sicher, dass das Bild aus den Staffeln 1-20 stammt</li> <li>Versuchen Sie es mit einem anderen Screenshot derselben Episode</li> <li>Stellen Sie sicher, dass das Bild nicht stark bearbeitet ist</li> <li>Versuchen Sie, das Bild ohne Zuschneiden zu suchen</li> </ul>`,
    no: "<ul> <li>Bekreft at bildet tilhører sesong 1-20</li> <li>Prøv med et klarere skjermbilde</li> <li>Sørg for at bildet ikke er tungt redigert</li> <li>Prøv beskjæringsverktøyet</li> </ul>"
},
  uploading: {
    es: "Subiendo imagen",
    en: "Uploading image",
    fr: "Téléchargement de l'image",
    pt: "Enviando imagem",
    it: "Caricamento immagine",
    tr: "Görsel yükleniyor",
    ru: "Загрузка изображения",
    de: "Bild wird hochgeladen",
    no: "Laster opp bilde"
  },
  uploading_info: {
    es: "Esto puede tomar unos segundos...",
    en: "This may take a few seconds...",
    fr: "Cela peut prendre quelques secondes...",
    pt: "Isso pode levar alguns segundos...",
    it: "Potrebbe richiedere alcuni secondi...",
    tr: "Bu birkaç saniye sürebilir...",
    ru: "Это может занять несколько секунд...",
    de: "Dies kann einige Sekunden dauern...",
    no: "Dette kan ta noen sekunder..."
  },
  error_header: {
    es: "Error...",
    en: "Error...",
    fr: "Erreur...",
    pt: "Erro...",
    it: "Errore...",
    tr: "Hata...",
    ru: "Ошибка...",
    de: "Fehler...",
    no: "Feil..."
  },
  error_message: {
    es: "Vuelve a intentarlo más tarde",
    en: "Try again later",
    fr: "Réessayez plus tard",
    pt: "Tente novamente mais tarde",
    it: "Riprova più tardi",
    tr: "Daha sonra tekrar deneyin",
    ru: "Попробуйте позже",
    de: "Versuchen Sie es später erneut",
    no: "Prøv igjen senere"
  },
  load_more: {
    es: "Scroll para cargar más resultados...",
    en: "Scroll to load more",
    fr: "Faites défiler pour charger plus de résultats...",
    pt: "Role para cargar mais resultados...",
    it: "Scorri per caricare più risultati...",
    tr: "Daha fazla sonuç yüklemek için kaydırın...",
    ru: "Прокрутите, чтобы загрузить больше результатов...",
    de: "Scrollen Sie, um mehr Ergebnisse zu laden...",
    no: "Rull for å laste flere resultater..."
  },
  crop_message: {
    es: "Arrastra el área para moverla o las esquinas para redimensionarla",
    en: "Drag the crop area to move it around the image, use the corners to resize",
    fr: "Faites glisser la zone de recadrage pour la déplacer ou les coins pour la redimensionner",
    pt: "Arraste a área de recorte para movê-la ou os cantos para redimensionar",
    it: "Trascina l'area di ritaglio per spostarla o gli angoli per ridimensionarla",
    tr: "Kırpma alanını taşımak için sürükleyin veya yeniden boyutlandırmak için köşeleri kullanın",
    ru: "Перетащите область обрезки, чтобы переместить ее, или углы, чтобы изменить размер",
    de: "Ziehen Sie den Zuschneidebereich, um ihn zu bewegen, oder verwenden Sie die Ecken, um die Größe zu ändern",
    no: "Dra beskjæringsområdet for å flytte det rundt på bildet, bruk hjørnene for å endre størrelse"
},
  crop_error: {
    es: "No se puede recortar esta imagen URL, intenta descargarla.",
    en: "Cannot crop this image (web permissions), try downloading it",
    fr: "Impossible de recadrer cette image URL, essayez de la télécharger.",
    pt: "Não é possível recortar esta imagem URL, tente baixá-la.",
    it: "Impossibile ritagliare questa immagine URL, prova a scaricarla.",
    tr: "Bu URL görseli kırpılamıyor, indirmeyi deneyin.",
    ru: "Невозможно обрезать это изображение URL, попробуйте загрузить его.",
    de: "Dieses URL-Bild kann nicht zugeschnitten werden, versuchen Sie es herunterzuladen.",
    no: "Kan ikke beskjære dette bildet (web-tillatelser), prøv å laste det ned" 
},
  crop_cancel: {
    es: "Cancelar",
    en: "Cancel",
    fr: "Annuler",
    pt: "Cancelar",
    it: "Annulla",
    tr: "İptal",
    ru: "Отмена",
    de: "Abbrechen",
    no: "Avbryt"
  },
  crop_apply: {
    es: "Aplicar recorte",
    en: "Apply crop",
    fr: "Appliquer le recadrage",
    pt: "Aplicar recorte",
    it: "Applica ritaglio",
    tr: "Kırpmayı uygula",
    ru: "Применить обрезку",
    de: "Zuschneiden anwenden",
    no: "Bruk beskjæring"
  }
};

const availableLanguages = ["en", "es", "fr", "pt", "it", "tr", "ru", "de", "no"];



export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("en");

    useEffect(() => {

        var mainLanguage = navigator.language

        if (mainLanguage.includes("-")) {
            mainLanguage = mainLanguage.split("-")[0]
        }

        if (availableLanguages.includes(mainLanguage)) {
            setLanguage(mainLanguage)
        }

    }, [])

    const text = useMemo(
        () => (key) => translations[key][language]
    );



    return (
        <LanguageContext.Provider value={{ language, setLanguage, text }}>
            {children}
        </LanguageContext.Provider>
    );
}