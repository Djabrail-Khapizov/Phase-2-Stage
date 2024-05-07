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

    // Fonction pour récupérer les données de la feuille "Quincaillerie"
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
                        const prixU = columns[7].trim();
                        // Ajouter les données à quincaillerieData sans conversion de prixU
                        quincaillerieData.push({ libelle, ref, lien, prixU});
                    }
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données de la feuille "Quincaillerie":', error);
            });
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
                        const prixBois = columns[2].trim();
    
                        // Ajouter les données à boisData telles quelles
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
        });

    // Événement pour mettre à jour le résultat lors de la modification de la quantité
    qteQuincaillerie.addEventListener("input", () => {
        const quantite = parseFloat(qteQuincaillerie.value) || 0;
        const prixUnitaire = parseFloat(prixUniteQuincaillerie.value) || 0;
        const resultat = quantite * prixUnitaire;

        if (!isNaN(resultat) && resultat !== 0) {
            resultatQuincaillerie.value = resultat.toFixed(2);
            console.log("Ca marche pas")
        }
    });

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
            prixUniteQuincaillerie.value = selectedQuincaillerie.prixU;
        }
    });

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
        longBois.type = "text";
        longBois.placeholder = "LONG (mm)";

        const largBois = document.createElement("input");
        largBois.type = "text";
        largBois.placeholder = "LARG (mm)";

        const qteBois = document.createElement("input");
        qteBois.type = "number";
        qteBois.placeholder = "Qté";

        const libelleBois = document.createElement("input");
        libelleBois.type = "text";
        libelleBois.placeholder = "Libellé";

        const prixMBois = document.createElement("input");
        prixMBois.type = "text";
        prixMBois.placeholder = "Prix m2";
        prixMBois.disabled = true; // Désactiver le champ texte lien

        // Div pour afficher les caractères spéciaux
        const specialCharsDiv = document.createElement("div");
        specialCharsDiv.style.cursor = "pointer";
        specialCharsDiv.textContent = "\u204e"; // Afficher le premier caractère par défaut

    // Tableau des caractères spéciaux à afficher
        const specialCharacters = ["\u204e", "\u21ae", "\u2195"];
        let currentCharIndex = 0; // Indice du caractère actuellement affiché

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "\ud83d\uddd1";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
        // Supprimer la ligne parente lors du clic sur le bouton Supprimer
            ligneBois.removeChild(nouvelleLigne);
        });
         // Gestionnaire d'événements pour basculer entre les caractères spéciaux
         specialCharsDiv.addEventListener("click", () => {
            currentCharIndex = (currentCharIndex + 1) % specialCharacters.length;
            specialCharsDiv.textContent = specialCharacters[currentCharIndex];
        });

        boisData.forEach(item => {
            const option = document.createElement("option");
            option.textContent = item.typeBois;
            selectBois.appendChild(option);
        })

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


    nouvelleLigne.appendChild(selectBois);
    nouvelleLigne.appendChild(boisRef);
    nouvelleLigne.appendChild(longBois);
    nouvelleLigne.appendChild(largBois);
    nouvelleLigne.appendChild(qteBois);
    nouvelleLigne.appendChild(libelleBois);
    nouvelleLigne.appendChild(specialCharsDiv); // Ajout de la zone des caractères spéciaux
    nouvelleLigne.appendChild(prixMBois);
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