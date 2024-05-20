const PRIX_BOIS = {
    ref123: { nom: "Bois A", prix: 35 },
    ref456: { nom: "Bois B", prix: 22 }
    // Ajoutez d'autres références de bois ici...
};

const PRIX_QUINCALLERIES = {
    ref1: {
        libelleQuin: "Quincallerie 1",
        lienQuin: "lien",
        quantQuin: 14
    },
    ref2: {
        libelleQuin: "Quincallerie 2",
        lienQuin: "lien",
        quantQuin: 40
    },
    // Ajoutez d'autres références de quincailleries ici...
};

// Fonction pour créer une nouvelle ligne pour le type de bois sélectionné
/*function ajouterLigneBois() {
    const ligneBois = document.getElementById("ligneBois");

    // Créer les éléments de la ligne
    const nouvelleLigne = document.createElement("div");
    nouvelleLigne.classList.add("ligne");

    // Champs pour sélectionner le type de bois
    const selectBois = document.createElement("select");
    selectBois.name = "choixBois";
    selectBois.id = "choixBois";

    // Option par défaut
    const optionDefault = document.createElement("option");
    optionDefault.text = "Choisir...";
    selectBois.appendChild(optionDefault);

    // Ajouter les options pour chaque type de bois
    for (const ref in PRIX_BOIS) {
        const bois = PRIX_BOIS[ref];
        const option = document.createElement("option");
        option.value = ref;
        option.text = bois.nom;
        selectBois.appendChild(option);
    }

    // Champ pour afficher le prix total du bois sélectionné
    const prixTotalBois = document.createElement("span");
    prixTotalBois.id = "prixTotalBois";

    // Ajout d'un gestionnaire d'événements pour détecter le changement de sélection
    selectBois.addEventListener("change", function() {
        const selectedRef = selectBois.value;
        const boisSelectionne = PRIX_BOIS[selectedRef];

        // Mettre à jour le prix total affiché
        refInput.value = selectedRef;
        prixTotalBois.textContent = `Prix total : ${boisSelectionne.prix} €`;
    });

    // Créer une fonction utilitaire pour générer les champs d'entrée
    function createInput(type, placeholder) {
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        return input;
    }

    // Champ pour saisir la référence
    const refInput = createInput("text", "Référence");

    // Ajouter les éléments à la ligne
    nouvelleLigne.appendChild(selectBois);
    nouvelleLigne.appendChild(refInput);
    nouvelleLigne.appendChild(createInput("text", "LONG (mm)"));
    nouvelleLigne.appendChild(createInput("text", "LARG (mm)"));
    nouvelleLigne.appendChild(createInput("number", "Qté"));
    nouvelleLigne.appendChild(createInput("text", "Libellé"));
    nouvelleLigne.appendChild(prixTotalBois);

    // Ajouter la nouvelle ligne au conteneurs
    ligneBois.appendChild(nouvelleLigne);
}*/




// Écouter le clic sur le bouton "BOIS" et ajouter une ligne de bois
//document.getElementById("btnBois").addEventListener("click", ajouterLigneBois);


document.addEventListener('DOMContentLoaded', () => {
    const sheetId = '1a39C65ikaCFhSmVf35am3M9iNqSCtXGAWsFylsGxXdg';
    const feuilleQuin = '770910738';
    const feuilleBois = '1478504250';

    const getUrl = (feuilleId) => `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${feuilleId}`;

    // Tableaux pour stocker les données
    let quincaillerieData = [];
    let boisData = [];

    const fetchQuincaillerie = (url, quincaillerieData) => {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
    
                // Parcourir chaque ligne de la feuille CSV
                for (let i = 1; i < rows.length; i++) {
                    const columns = parseCSVRow(rows[i]);
    
                    if (columns.length >= 8) {
                        const libelle = columns[1].trim().replace(/^"(.*)"$/, '$1'); // Retire les guillemets
                        const ref = columns[5].trim().replace(/^"(.*)"$/, '$1'); // Retire les guillemets
                        const lien = columns[6].trim().replace(/^"(.*)"$/, '$1'); // Retire les guillemets
                        const prixUWithEuro = columns[7].trim(); // Prix avec le symbole Euro
                        const prixU = parsePrice(prixUWithEuro); // Convertir en nombre sans symbole Euro
    
                        // Ajouter les données à quincaillerieData avec le prix converti
                        quincaillerieData.push({ libelle, ref, lien, prixU });
                    }
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données de la feuille "Quincaillerie":', error);
            });
    };
    
    // Fonction pour extraire la valeur numérique du prix en retirant uniquement le symbole Euro
    const parsePrice = (priceWithEuro) => {
        const numericValue = parseFloat(priceWithEuro.replace(/[^\d,.]/g, '').replace(',', '.')); // Remplacer les virgules par des points pour la conversion en nombre
        return isNaN(numericValue) ? 0 : numericValue; // Retourner 0 si la conversion échoue
    };
    
    // Fonction pour diviser une ligne CSV en colonnes en tenant compte des virgules dans les valeurs monétaires
    const parseCSVRow = (row) => {
        const columns = [];
        let current = '';
        let inQuotes = false;
    
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
    
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                columns.push(current);
                current = '';
            } else {
                current += char;
            }
        }
    
        columns.push(current); // Ajouter la dernière colonne
    
        return columns;
    };
    
    

   // Fonction pour récupérer les données de la feuille "Bois"
const fetchBois = (url, boisData) => {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');

            // Parcourir chaque ligne de la feuille CSV
            for (let i = 1; i < rows.length; i++) {
                const columns = parseCSVRow(rows[i]);

                if (columns.length >= 3) {
                    const typeBois = columns[0].trim().replace(/^"(.*)"$/, '$1');
                    const ref = columns[1].trim().replace(/^"(.*)"$/, '$1');
                    const prixBoisWithEuro = columns[2].trim(); // Prix avec le symbole Euro
                    const prixBois = parsePrice(prixBoisWithEuro); // Convertir en nombre sans symbole Euro

                    // Ajouter les données à boisData avec le prix converti
                    boisData.push({ typeBois, ref, prixBois });
                }
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de la feuille "Bois":', error);
        });
};

    fetchBois(getUrl(feuilleBois), boisData)
        .then(() => {
            // Une fois les données de la feuille "Bois" récupérées et traitées, vous pouvez effectuer d'autres opérations ici
            document.getElementById("btnBois").addEventListener("click", () => {
                ajouterLigneBois(boisData);
            })
        });


    // Appeler les fonctions pour récupérer les données des feuilles
    fetchQuincaillerie(getUrl(feuilleQuin), quincaillerieData)
    .then(() => {
        // Une fois les données de la feuille "Quincaillerie" récupérées et traitées, vous pouvez appeler ajouterQuincallerieLine
        document.getElementById("btnQuincallerie").addEventListener("click", () => {
            ajouterQuincallerieLine(quincaillerieData);
        });
        });
    })


    const createTotalQuincaillerieLine = () => {
        const totalQuincaillerie = document.getElementById("totalQuincaillerie");
    
        const totalLine = document.createElement("div");
        totalLine.classList.add("total-quincaillerie-line");
    
        // Texte fixe "Total Quincaillerie"
        const totalLabel = document.createElement("span");
        totalLabel.textContent = "Total Quincaillerie";
    
        // Champ pour la quantité totale avec le texte "Items"
        const totalQuantities = document.createElement("input");
        totalQuantities.type = "text";
        totalQuantities.disabled = true;
    
        // Champ pour le prix total
        const totalPrices = document.createElement("input");
        totalPrices.type = "text";
        totalPrices.disabled = true;
    
        // Bouton "CMD"
        const cmdButton = document.createElement("button");
        cmdButton.textContent = "Liste CMD";
        cmdButton.classList.add("cmd-button");
        cmdButton.addEventListener("click", generateXLS); // Ajouter l'événement de clic pour générer le fichier XLS
    
        totalLine.appendChild(totalLabel);
        totalLine.appendChild(totalQuantities);
        totalLine.appendChild(totalPrices);
        totalLine.appendChild(cmdButton); // Ajouter le bouton CMD à la ligne de totaux
    
        totalQuincaillerie.appendChild(totalLine);
    
        return { totalQuantities, totalPrices };
    };
    
    const generateXLS = () => {
        const quincaillerieLines = document.querySelectorAll('.quincaillerie-line');
        const data = [];
    
        // Ajouter les en-têtes de colonne
        data.push(["Libellé", "Référence", "Fournisseur", "Lien", "Prix Unitaire", "Quantité", "Endroit", "Total"]);
    
        // Ajouter les données des lignes de quincaillerie
        quincaillerieLines.forEach(line => {
            const libelle = line.querySelector('select').value;
            const ref = line.querySelector('input[type="text"][placeholder="Référence"]').value;
            const lien = line.querySelector('input[type="text"][placeholder="Lien"]').value;
            const prixUnitaire = line.querySelector('input[type="text"][placeholder="Prix U"]').value;
            const quantite = line.querySelector('input[type="number"]').value;
            const endroit = line.querySelector('input[type="text"][placeholder="Endroit"]').value;
            const total = line.querySelector('input[type="text"][placeholder="Résultat"]').value;
    
            data.push([libelle, ref, "Fournisseur", lien, prixUnitaire, quantite, endroit, total]);
        });
    
        // Créer un nouveau classeur
        const wb = XLSX.utils.book_new();
        // Convertir les données en une feuille de calcul
        const ws = XLSX.utils.aoa_to_sheet(data);
        // Ajouter la feuille de calcul au classeur
        XLSX.utils.book_append_sheet(wb, ws, "Quincaillerie");
        // Générer le fichier XLSX et le télécharger
        XLSX.writeFile(wb, "Quincaillerie.xlsx");
    };
    
    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        const { totalQuantities, totalPrices } = createTotalQuincaillerieLine();
    
        // Écouter les événements de changement sur les quantités et les prix
        document.getElementById('ligneQuincallerie').addEventListener('input', () => {
            updateTotals(totalQuantities, totalPrices);
        });
    });
    
    
    // Fonction pour mettre à jour les totaux
    const updateTotals = (totalQuantities, totalPrices) => {
        const quincaillerieLines = document.querySelectorAll('.quincaillerie-line');
        let totalQuant = 0;
        let totalPrice = 0;
    
        quincaillerieLines.forEach(line => {
            const quantityInput = line.querySelector('input[type="number"]');
            const priceInput = line.querySelector('input[placeholder="Prix U"]');
            if (quantityInput && priceInput) {
                const quantity = parseFloat(quantityInput.value) || 0;
                const price = parseFloat(priceInput.value.replace(' €/U', '').replace(',', '.')) || 0;
                totalQuant += quantity;
                totalPrice += quantity * price;
            }
        });
    
        // Mettre à jour les champs avec les totaux
        totalQuantities.value = `${totalQuant} Items`;
        totalPrices.value = `${totalPrice.toFixed(2)} €`;
    };
    

   // Fonction pour ajouter une nouvelle ligne de quincaillerie
function ajouterQuincallerieLine(quincaillerieData) {
    const ligneQuincallerie = document.getElementById("ligneQuincallerie");

    // Création des éléments HTML pour la nouvelle ligne
    const nouvelleLigne = document.createElement("div");
    nouvelleLigne.classList.add("quincaillerie-line");

    const selectLibelle = document.createElement("select");
    const inputRef = document.createElement("input");
    inputRef.type = "text";
    inputRef.placeholder = "Référence";

    const inputLien = document.createElement("input");
    inputLien.type = "text";
    inputLien.placeholder = "Lien";
    inputLien.disabled = true; // Désactiver le champ texte lien

    const qteQuincaillerie = document.createElement("input");
    qteQuincaillerie.type = "number";
    qteQuincaillerie.placeholder = "Qté";

    const endroitQuincaillerie = document.createElement("input");
    endroitQuincaillerie.type = "text";
    endroitQuincaillerie.placeholder = "Endroit";

    const prixUniteQuincaillerie = document.createElement("input");
    prixUniteQuincaillerie.type = "text";
    prixUniteQuincaillerie.placeholder = "Prix U";
    prixUniteQuincaillerie.disabled = true; // Désactiver le champ texte lien

    const resultatQuincaillerie = document.createElement("input");
    resultatQuincaillerie.type = "text";
    resultatQuincaillerie.placeholder = "Résultat";
    resultatQuincaillerie.disabled = true; // Rendre le champ de résultat non modifiable

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "\ud83d\uddd1";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
        // Supprimer la ligne parente lors du clic sur le bouton Supprimer
            ligneQuincallerie.removeChild(nouvelleLigne);
            updateTotalQuincaillerie();
        });

    // Événement pour mettre à jour le résultat lors de la modification de la quantité
    qteQuincaillerie.addEventListener("input", () => {
        const quantite = parseFloat(qteQuincaillerie.value) || 0;
        const prixUnitaire = parseFloat(prixUniteQuincaillerie.value) || 0;
        const resultat = quantite * prixUnitaire;

        if (!isNaN(resultat) && resultat !== 0) {
            resultatQuincaillerie.value = formatCurrency(resultat);
        } else {
            resultatQuincaillerie.value = "";
        }
        
        updateTotalQuincaillerie();
    });

    

    // Fonction pour formater le résultat avec le symbole Euro
    const formatCurrency = (value) => {
        const formattedValue = value.toFixed(2); // Formatage avec deux décimales
        return `${formattedValue} €`; // Ajouter le symbole Euro à la fin
    };

    // Remplissage du menu déroulant avec les libellés disponibles
    quincaillerieData.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.libelle;
        selectLibelle.appendChild(option);
    });

   // Ajout d'un écouteur d'événements pour gérer la sélection dans le menu déroulant
selectLibelle.addEventListener("change", () => {
    const selectedLibelle = selectLibelle.value;
    const selectedQuincaillerie = quincaillerieData.find(item => item.libelle === selectedLibelle);
    if (selectedQuincaillerie) {
        inputRef.value = selectedQuincaillerie.ref;
        inputLien.value = selectedQuincaillerie.lien;

        // Formatage du prix unitaire avec le symbole Euro et le suffixe "/U"
        prixUniteQuincaillerie.value = formatCurrency2(selectedQuincaillerie.prixU);
    }
});

inputRef.addEventListener("input", () => {
        const enteredRef = inputRef.value;
        const selectedQuincaillerie = quincaillerieData.find(item => item.ref === enteredRef);
        if (selectedQuincaillerie) {
            selectLibelle.value = selectedQuincaillerie.libelle;
            inputLien.value = selectedQuincaillerie.lien;
            prixUniteQuincaillerie.value = formatCurrency2(selectedQuincaillerie.prixU);
        }
    });

// Fonction pour formater le prix unitaire avec le symbole Euro et le suffixe "/U"
const formatCurrency2 = (value) => {
    const formattedValue = value.toFixed(2); // Formatage avec deux décimales
    return `${formattedValue} €/U`; // Ajouter le symbole Euro suivi de "/U" à la fin
};


    // Ajout des éléments à la nouvelle ligne
    nouvelleLigne.appendChild(selectLibelle);
    nouvelleLigne.appendChild(inputRef);
    nouvelleLigne.appendChild(inputLien);
    nouvelleLigne.appendChild(qteQuincaillerie);
    nouvelleLigne.appendChild(endroitQuincaillerie);
    nouvelleLigne.appendChild(prixUniteQuincaillerie);
    nouvelleLigne.appendChild(resultatQuincaillerie);
    nouvelleLigne.appendChild(deleteButton);

    // Ajout de la nouvelle ligne au conteneur
    ligneQuincallerie.appendChild(nouvelleLigne);
}


function ajouterLigneBois(boisData) {
    const ligneBois = document.getElementById("ligneBois");

    const nouvelleLigne = document.createElement("div");
    nouvelleLigne.classList.add("bois-line");

    const selectBois = document.createElement("select");
    const boisRef = document.createElement("input");
    boisRef.type = "text";
    boisRef.placeholder = "Référence";

    const longBois = document.createElement("input");
    longBois.type = "number";
    longBois.placeholder = "LONG (mm)";

    const largBois = document.createElement("input");
    largBois.type = "number";
    largBois.placeholder = "LARG (mm)";

    const qteBois = document.createElement("input");
    qteBois.type = "number";
    qteBois.placeholder = "Qté";

    const libelleBois = document.createElement("input");
    libelleBois.type = "text";
    libelleBois.placeholder = "Libellé";

    const prixMBois = document.createElement("input");
    prixMBois.type = "number";
    prixMBois.placeholder = "Prix/m²";
    prixMBois.disabled = true;

    const surfaceBois = document.createElement("input");
    surfaceBois.type = "text";
    surfaceBois.placeholder = "Surface (m²)";
    surfaceBois.disabled = true;

    const prixTotalBois = document.createElement("input");
    prixTotalBois.type = "text";
    prixTotalBois.placeholder = "Total";
    prixTotalBois.disabled = true;

    // Création du rectangle avec différents états
    const rectangle = document.createElement("div");
    rectangle.style.width = "75%"; // Largeur du rectangle
    rectangle.style.height = "20px"; // Hauteur du rectangle
    rectangle.style.border = "2px solid black"; // Bordure noire par défaut
    rectangle.style.marginRight = "10px"; // Marge pour espacer le rectangle des autres éléments

    const rectangleStates = [
        { border: "2px solid black" },
        { border: "2px solid black", borderLeft: "4px solid blue" },
        { border: "2px solid black", borderBottom: "4px solid blue" },
        { border: "3px solid blue" }
        
    ];
    let currentRectIndex = 0;

    rectangle.addEventListener("click", () => {
        currentRectIndex = (currentRectIndex + 1) % rectangleStates.length;
        Object.assign(rectangle.style, rectangleStates[currentRectIndex]);
    });

    const specialCharsDiv = document.createElement("div");
    specialCharsDiv.style.cursor = "pointer";

    // Initialiser avec le premier caractère
    const specialCharacters = ["\u204e", "\u21ae", "\u2195"];
    let currentCharIndex = 0; // Indice du caractère actuellement affiché
    specialCharsDiv.textContent = specialCharacters[currentCharIndex];

    specialCharsDiv.addEventListener("click", () => {
        // Incrémenter l'indice du caractère
        currentCharIndex = (currentCharIndex + 1) % specialCharacters.length;
        // Mettre à jour le texte du div avec le caractère suivant
        specialCharsDiv.textContent = specialCharacters[currentCharIndex];
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "\ud83d\uddd1";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
        ligneBois.removeChild(nouvelleLigne);
    });

    // Ajout des options de bois au menu déroulant
    boisData.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.typeBois;
        selectBois.appendChild(option);
    });

    selectBois.addEventListener("change", () => {
        const selectedTypeBois = selectBois.value;
        const selectedBois = boisData.find(item => item.typeBois === selectedTypeBois);
        if (selectedBois) {
            boisRef.value = selectedBois.ref;
            prixMBois.value = selectedBois.prixBois;
        }
    });

    boisRef.addEventListener("input", () => {
        const enteredRef = boisRef.value.trim();
        const matchingItem = boisData.find(item => item.ref === enteredRef);
        if (matchingItem) {
            // Mettre à jour le menu déroulant avec le type de bois correspondant
            const option = document.createElement("option");
            option.textContent = matchingItem.typeBois;
            selectBois.innerHTML = ''; // Réinitialiser les options
            selectBois.appendChild(option);
        }
    });

    // Gestionnaire d'événements pour calculer la surface et le prix total lorsque les valeurs sont modifiées
    const updateSurfaceAndPrice = () => {
        const longueur = parseFloat(longBois.value) / 1000 || 0; // Conversion de mm en m
        const largeur = parseFloat(largBois.value) / 1000 || 0; // Conversion de mm en m
        const quantite = parseFloat(qteBois.value) || 0;
        const prixM2 = parseFloat(prixMBois.value) || 0;

        const surface = longueur * largeur * quantite;
        surfaceBois.value = surface.toFixed(2) + " m²";

        const prixTotal = prixM2 * surface;
        prixTotalBois.value = prixTotal.toFixed(2) + " €"; // Supposons que le prix soit en euros
    };

    // Écouteurs d'événements pour mettre à jour la surface et le prix total
    longBois.addEventListener("input", updateSurfaceAndPrice);
    largBois.addEventListener("input", updateSurfaceAndPrice);
    qteBois.addEventListener("input", updateSurfaceAndPrice);
    prixMBois.addEventListener("input", updateSurfaceAndPrice);

    // Ajout des éléments à la nouvelle ligne
    nouvelleLigne.appendChild(selectBois);
    nouvelleLigne.appendChild(boisRef);
    nouvelleLigne.appendChild(longBois);
    nouvelleLigne.appendChild(largBois);
    nouvelleLigne.appendChild(qteBois);
    nouvelleLigne.appendChild(libelleBois);
    nouvelleLigne.appendChild(surfaceBois); // Ajout du champ de surface
    nouvelleLigne.appendChild(prixTotalBois); // Ajout du champ de prix total
    nouvelleLigne.appendChild(rectangle); // Ajout du rectangle avant les caractères spéciaux
    nouvelleLigne.appendChild(specialCharsDiv); // Ajout de la zone des caractères spéciaux
    nouvelleLigne.appendChild(deleteButton);

    ligneBois.appendChild(nouvelleLigne);
}






/* PRIX M2 * SURFACE

SURFACE = LONG * LARG * QTE*/














/*document.addEventListener('DOMContentLoaded', () => {
    // Charger le fichier Excel automatiquement
    fetch('./src/donnees.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });

            // Lire la première feuille de calcul
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convertir en JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Afficher les données dans la console
            console.log(jsonData);
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier Excel :', error);
        });
});*/

/*document.addEventListener('DOMContentLoaded', () => {
    const sheetId = '1a39C65ikaCFhSmVf35am3M9iNqSCtXGAWsFylsGxXdg';
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');

            // Parcourir les lignes de données (en sautant la première ligne qui contient les en-têtes)
            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(',');

                // Récupérer les valeurs pertinentes de chaque colonne
                const libelle = columns[1]; // Colonne libelle (index 1)
                const ref = columns[5]; // Colonne ref (index 5)
                const lien = columns[6]; // Colonne lien (index 6)

                // Appeler la fonction pour ajouter une quincaillerie avec les valeurs récupérées
                ajouterQuincallerie(libelle, ref, lien);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        });
});*/