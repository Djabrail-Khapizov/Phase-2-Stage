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
    
        // Vérifier si la ligne "Total Quincaillerie" existe déjà
        if (totalQuincaillerie.children.length > 0) {
            return; // Ne rien faire si la ligne existe déjà
        }
    
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
    
        const cmdButton = document.createElement("button");
        cmdButton.textContent = "CMD";
        cmdButton.classList.add("cmd-button"); // Ajouter une classe au bouton CMD
        cmdButton.addEventListener("click", generateXLS); // Ajouter l'événement de clic pour générer le fichier XLS

        totalLine.appendChild(totalLabel);
        totalLine.appendChild(totalQuantities);
        totalLine.appendChild(totalPrices);
        totalLine.appendChild(cmdButton); // Ajouter le bouton CMD à la ligne de totaux
    
        totalQuincaillerie.appendChild(totalLine);
    
        return { totalQuantities, totalPrices };
    };
    
    
    // Fonction pour générer le fichier XLS
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

    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    rectangle.style.width = "75%";
    rectangle.style.height = "20px";
    rectangle.style.border = "2px solid black";
    rectangle.style.marginRight = "10px";

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
        rectangle.setAttribute('data-index', currentRectIndex.toString());
    });

    const specialCharsDiv = document.createElement("div");
    specialCharsDiv.classList.add("special-chars-div"); // Ajouter une classe identifiable
    specialCharsDiv.style.cursor = "pointer";

    const specialCharacters = ["\u204e", "\u21ae", "\u2195"];
    let currentCharIndex = 0;
    specialCharsDiv.textContent = specialCharacters[currentCharIndex];

    specialCharsDiv.addEventListener("click", () => {
        currentCharIndex = (currentCharIndex + 1) % specialCharacters.length;
        specialCharsDiv.textContent = specialCharacters[currentCharIndex];
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "\ud83d\uddd1";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
        const typeBois = selectBois.value;
        ligneBois.removeChild(nouvelleLigne);
        updateTotalValues(); // Update totals when a row is deleted
        checkAndRemoveTotalBoisLine(typeBois); // Check if we need to remove the total line
    });

    boisData.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.typeBois;
        selectBois.appendChild(option);
    });

    const areAllFieldsFilled = () => {
        return boisRef.value.trim() !== "" &&
            longBois.value.trim() !== "" &&
            largBois.value.trim() !== "" &&
            qteBois.value.trim() !== "";
    };

    const updateTotalLabel = () => {
        const selectedTypeBois = selectBois.value;
        if (areAllFieldsFilled()) {
            createOrUpdateTotalBoisLine(selectedTypeBois);
            updateTotalValues(); // Update totals when selection changes
        }
    };

    selectBois.addEventListener("change", () => {
        const selectedTypeBois = selectBois.value;
        const selectedBois = boisData.find(item => item.typeBois === selectedTypeBois);
        if (selectedBois) {
            boisRef.value = selectedBois.ref;
            prixMBois.value = selectedBois.prixBois;
        }
        updateTotalLabel();
    });

    boisRef.addEventListener("input", () => {
        const enteredRef = boisRef.value.trim();
        const matchingItem = boisData.find(item => item.ref === enteredRef);
        if (matchingItem) {
            const option = document.createElement("option");
            option.textContent = matchingItem.typeBois;
            selectBois.innerHTML = '';
            selectBois.appendChild(option);
            updateTotalLabel();
        }
    });

    const updateSurfaceAndPrice = () => {
        const longueur = parseFloat(longBois.value) / 1000 || 0; // Conversion de mm en m
        const largeur = parseFloat(largBois.value) / 1000 || 0; // Conversion de mm en m
        const quantite = parseFloat(qteBois.value) || 0;
        const prixM2 = parseFloat(prixMBois.value) || 0;

        const surface = longueur * largeur * quantite;
        surfaceBois.value = surface.toFixed(2) + " m²";

        const prixTotal = prixM2 * surface;
        prixTotalBois.value = prixTotal.toFixed(2) + " €"; // Supposons que le prix soit en euros

        if (areAllFieldsFilled()) {
            updateTotalLabel();
        }
        updateTotalValues(); // Update totals when values change
    };

    longBois.addEventListener("input", updateSurfaceAndPrice);
    largBois.addEventListener("input", updateSurfaceAndPrice);
    qteBois.addEventListener("input", updateSurfaceAndPrice);
    prixMBois.addEventListener("input", updateSurfaceAndPrice);

    nouvelleLigne.appendChild(selectBois);
    nouvelleLigne.appendChild(boisRef);
    nouvelleLigne.appendChild(longBois);
    nouvelleLigne.appendChild(largBois);
    nouvelleLigne.appendChild(qteBois);
    nouvelleLigne.appendChild(libelleBois);
    nouvelleLigne.appendChild(surfaceBois);
    nouvelleLigne.appendChild(prixTotalBois);
    nouvelleLigne.appendChild(rectangle);
    nouvelleLigne.appendChild(specialCharsDiv);
    nouvelleLigne.appendChild(deleteButton);

    ligneBois.appendChild(nouvelleLigne);
}

const updateTotalValues = () => {
    const ligneBois = document.querySelectorAll(".bois-line");
    const totalBois = document.getElementById("totalBois");

    const totalMap = new Map();

    ligneBois.forEach(line => {
        const selectBois = line.querySelector("select").value;
        const surface = parseFloat(line.querySelector('input[placeholder="Surface (m²)"]').value) || 0;
        const price = parseFloat(line.querySelector('input[placeholder="Total"]').value) || 0;

        if (!totalMap.has(selectBois)) {
            totalMap.set(selectBois, { surface: 0, price: 0 });
        }

        const total = totalMap.get(selectBois);
        total.surface += surface;
        total.price += price;
        totalMap.set(selectBois, total);
    });

    totalMap.forEach((value, key) => {
        const totalBoisLine = totalBois.querySelector(`.total-bois-line[data-type="${key}"]`);
        if (totalBoisLine) {
            totalBoisLine.querySelector('input[placeholder="Surface (m²)"]').value = value.surface.toFixed(2) + " m²";
            totalBoisLine.querySelector('input[placeholder="Total"]').value = value.price.toFixed(2) + " €";
        }
    });
};

function createTotalBoisLine(typeBois) {
    const totalBois = document.getElementById("totalBois");

    let existingLine = document.querySelector(`.total-bois-line[data-type="${typeBois}"]`);
    if (existingLine) {
        return;
    }

    const totalBoisLine = document.createElement("div");
    totalBoisLine.classList.add("total-bois-line");
    totalBoisLine.setAttribute("data-type", typeBois);

    const totalBoisLabel = document.createElement("span");
    totalBoisLabel.textContent = `Total Bois ${typeBois}`;

    const totalSurface = document.createElement("input");
    totalSurface.type = "text";
    totalSurface.placeholder = "Surface (m²)";
    totalSurface.disabled = true;

    const totalBoisPrice = document.createElement("input");
    totalBoisPrice.type = "text";
    totalBoisPrice.placeholder = "Total";
    totalBoisPrice.disabled = true;

    const csvButton = document.createElement("button");
    csvButton.textContent = "CSV CUTLIST";
    csvButton.classList.add("csv-button");

    const ficheButton = document.createElement("button");
    ficheButton.textContent = "FICHE DEBIT";
    ficheButton.classList.add("fiche-button");

    totalBoisLine.appendChild(totalBoisLabel);
    totalBoisLine.appendChild(totalSurface);
    totalBoisLine.appendChild(totalBoisPrice);
    totalBoisLine.appendChild(csvButton);
    totalBoisLine.appendChild(ficheButton);

    totalBois.appendChild(totalBoisLine);

    // Ajouter un gestionnaire d'événements au nouveau bouton "CSV CUTLIST"
    csvButton.addEventListener('click', () => {
        generateCsvForTypeBois(typeBois);
    });

    // Ajouter un gestionnaire d'événements au nouveau bouton "FICHE DEBIT"
    ficheButton.addEventListener('click', () => {
        generateFicheDebForTypeBois(typeBois);
    });

    return { totalSurface, totalBoisPrice };
}

const createOrUpdateTotalBoisLine = (typeBois) => {
    const totalBois = document.getElementById("totalBois");

    let existingLine = document.querySelector(`.total-bois-line[data-type="${typeBois}"]`);
    if (!existingLine) {
        createTotalBoisLine(typeBois);
    }

    updateTotalValues(); // Mettre à jour les valeurs des champs de la ligne totale
};

const checkAndRemoveTotalBoisLine = (typeBois) => {
    const ligneBois = document.querySelectorAll(".bois-line");
    let count = 0;

    // Parcourir toutes les lignes de bois normales pour compter le nombre de lignes du même type de bois
    ligneBois.forEach(line => {
        if (line.querySelector("select").value === typeBois) {
            count++;
        }
    });

    // S'il n'y a aucune ligne de bois normale avec ce type de bois, supprimer la ligne Total Bois correspondante
    if (count === 0) {
        const totalBoisLine = document.querySelector(`.total-bois-line[data-type="${typeBois}"]`);
        if (totalBoisLine) {
            totalBoisLine.remove();
        }
    }
};


// Fonction pour collecter les données des lignes d'articles pour un type de bois donné et générer un fichier XLSX
function generateFicheDebForTypeBois(typeBois) {
    const articles = [];
    const boisLines = document.querySelectorAll('.bois-line'); // Assurez-vous que les lignes de bois ont la classe "bois-line"

    boisLines.forEach(line => {
        const selectedTypeBois = line.querySelector('select').value; // Assurez-vous que le type de bois est sélectionné dans un <select>
        if (selectedTypeBois === typeBois) { // Filtrer par type de bois
            const longueur = line.querySelector('input[placeholder="LONG (mm)"]').value;
            const largeur = line.querySelector('input[placeholder="LARG (mm)"]').value;
            const quantite = line.querySelector('input[placeholder="Qté"]').value;
            const etiquette = line.querySelector('input[placeholder="Libellé"]').value;
            const commentaire = ""; // Laisser vide

            articles.push({ longueur, largeur, quantite, etiquette, commentaire });
        }
    });

    generateExcel(articles, typeBois);
}

// Fonction pour générer et télécharger le fichier XLSX
function generateExcel(articles, typeBois) {
    const data = [];
    data.push(["LONGUEUR", "LARGEUR", "QUANTITE", "ETIQUETTE", "COMMENTAIRE"]); // En-têtes des colonnes

    articles.forEach(article => {
        data.push([
            article.longueur,
            article.largeur,
            article.quantite,
            article.etiquette,
            article.commentaire
        ]);
    });

    const wb = XLSX.utils.book_new();
    const sheetName = `Fiche Débit ${typeBois}`.substring(0, 31); // Tronquer le nom de la feuille à 31 caractères
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `Fiche_Debit_${typeBois}.xlsx`);
}

// Fonction pour ajouter des gestionnaires d'événements aux boutons "FICHE DEBIT"
function addFicheDebEventListeners() {
    const ficheButtons = document.querySelectorAll('.fiche-button');
    
    ficheButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const typeBois = event.target.closest('.total-bois-line').getAttribute('data-type');
            generateFicheDebForTypeBois(typeBois);
        });
    });
}

function generateCsvForTypeBois(typeBois) {
    const articles = [];
    const boisLines = document.querySelectorAll('.bois-line');

    boisLines.forEach(line => {
        const selectedTypeBois = line.querySelector('select').value;
        if (selectedTypeBois === typeBois) {
            const longueur = line.querySelector('input[placeholder="LONG (mm)"]').value;
            const largeur = line.querySelector('input[placeholder="LARG (mm)"]').value;
            const quantite = line.querySelector('input[placeholder="Qté"]').value;
            const libelle = line.querySelector('input[placeholder="Libellé"]').value;
            const enabled = "TRUE";

            // Obtenir la direction du grain
            const specialCharsDiv = line.querySelector('.special-chars-div');
            let grainDirection = "";
            if (specialCharsDiv) {
                const currentChar = specialCharsDiv.textContent;
                if (currentChar === "\u21ae") {
                    grainDirection = 'h';
                } else if (currentChar === "\u2195") {
                    grainDirection = 'v';
                }
            }

            // Obtenir les bandes
            const rectangle = line.querySelector('.rectangle');
            let topBand = "";
            let leftBand = "";
            let bottomBand = "";
            let rightBand = "";

            if (rectangle) {
                const currentRectIndex = parseInt(rectangle.getAttribute('data-index'), 10);
                switch (currentRectIndex) {
                    case 1:
                        leftBand = "X";
                        break;
                    case 2:
                        bottomBand = "X";
                        break;
                    case 3:
                        topBand = "X";
                        leftBand = "X";
                        bottomBand = "X";
                        rightBand = "X";
                        break;
                    default:
                        break;
                }
            }

            articles.push({ longueur, largeur, quantite, libelle, enabled, grainDirection, topBand, leftBand, bottomBand, rightBand });
        }
    });

    generateCsv(articles, typeBois);
}

// Fonction pour générer et télécharger le fichier CSV
function generateCsv(articles, typeBois) {
    const data = [];
    data.push(["LONGUEUR", "LARGEUR", "QUANTITE", "LIBELLE", "ENABLED", "GRAIN DIRECTION", "TOP BAND", "LEFT BAND", "BOTTOM BAND", "RIGHT BAND"]); // En-têtes des colonnes

    articles.forEach(article => {
        data.push([
            article.longueur,
            article.largeur,
            article.quantite,
            article.libelle,
            article.enabled,
            article.grainDirection,
            article.topBand,
            article.leftBand,
            article.bottomBand,
            article.rightBand
        ]);
    });

    const csvContent = data.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `Cutlist_${typeBois}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fonction pour ajouter des gestionnaires d'événements aux boutons "CSV CUTLIST"
function addCsvCutlistEventListeners() {
    const csvButtons = document.querySelectorAll('.csv-button');
    
    csvButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const typeBois = event.target.closest('.total-bois-line').getAttribute('data-type');
            generateCsvForTypeBois(typeBois);
        });
    });
}

// Appeler la fonction pour ajouter les gestionnaires d'événements aux boutons "CSV CUTLIST"
addCsvCutlistEventListeners();









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