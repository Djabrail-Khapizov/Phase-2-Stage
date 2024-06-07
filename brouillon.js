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
    rectangle.setAttribute('data-index', '0');

    const rectangleStates = [
        { border: "2px solid black" },
        { border: "2px solid black", borderLeft: "4px solid blue" },
        { border: "2px solid black", borderBottom: "4px solid blue" },
        { border: "4px solid blue" }
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
        ligneBois.removeChild(nouvelleLigne);
        updateTotalValues(); // Update totals when a row is deleted
        checkAndRemoveTotalBoisLine(selectBois.value); // Check if the total line should be removed
    });

    boisData.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.typeBois;
        selectBois.appendChild(option);
    });

    const updateTotalLabel = () => {
        const selectedTypeBois = selectBois.value;
        createTotalBoisLine(selectedTypeBois);
        updateTotalValues(); // Update totals when selection changes
    };

    selectBois.addEventListener("change", () => {
        const selectedTypeBois = selectBois.value;
        const selectedBois = boisData.find(item => item.typeBois === selectedTypeBois);
        if (selectedBois) {
            boisRef.value = selectedBois.ref;
            prixMBois.value = selectedBois.prixBois;
        }
        updateTotalLabel(); // Update the total label when the selection changes
    });

    boisRef.addEventListener("input", () => {
        const enteredRef = boisRef.value.trim();
        const matchingItem = boisData.find(item => item.ref === enteredRef);
        if (matchingItem) {
            const option = document.createElement("option");
            option.textContent = matchingItem.typeBois;
            selectBois.innerHTML = '';
            selectBois.appendChild(option);
            updateTotalLabel(); // Update the total label when the reference changes
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

    updateTotalLabel();
}