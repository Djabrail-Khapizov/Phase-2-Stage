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
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

    // Tableau pour stocker les libellés et leurs références associées
    let quincaillerieData = [];

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');

            // Récupérer les libellés et références de chaque quincaillerie
            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(',');
                const libelle = columns[1].trim(); // Colonne libelle (index 1)
                const ref = columns[5].trim(); // Colonne ref (index 5)
                const lien = columns[6].trim(); // Colonne lien (index 6)
                quincaillerieData.push({ libelle, ref, lien });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        });

    // Fonction pour ajouter une nouvelle ligne de quincaillerie
    function ajouterQuincallerieLine() {
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

        // Remplissage du menu déroulant avec les libellés disponibles
        quincaillerieData.forEach(item => {
            const option = document.createElement("option");
            option.value = item.libelle;
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
            }
        });

        // Ajout des éléments à la nouvelle ligne
        nouvelleLigne.appendChild(selectLibelle);
        nouvelleLigne.appendChild(inputRef);
        nouvelleLigne.appendChild(inputLien);

        // Ajout de la nouvelle ligne au conteneur
        ligneQuincallerie.appendChild(nouvelleLigne);
    }

    // Ajouter une ligne de quincaillerie lors du clic sur le bouton
    document.getElementById("btnQuincallerie").addEventListener("click", () => {
        ajouterQuincallerieLine();
    });
});



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