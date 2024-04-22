const PRIX_BOIS = {
    ref123: { nom: "Bois A", prix: 35 },
    ref456: { nom: "Bois B", prix: 22 }
    // Ajoutez d'autres références de bois ici...
};

const PRIX_QUINCALLERIES = {
    ref1: {
        libelleQuin: "Quincallerie 1",
        lienQuin: "https://example.com",
        quantQuin: 14
    },
    ref2: {
        libelleQuin: "Quincallerie 2",
        lienQuin: "https://example.com",
        quantQuin: 40
    },
    // Ajoutez d'autres références de quincailleries ici...
};

// Fonction pour créer une nouvelle ligne pour le type de bois sélectionné
function ajouterLigneBois() {
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

    // Ajouter la nouvelle ligne au conteneur
    ligneBois.appendChild(nouvelleLigne);
}




// Écouter le clic sur le bouton "BOIS" et ajouter une ligne de bois
document.getElementById("btnBois").addEventListener("click", ajouterLigneBois);

function ajouterQuincallerie() {
    const ligneQuincallerie = document.getElementById("ligneQuincallerie");

    // Créer les éléments de la ligne
    const nouvelleLigne = document.createElement("div");
    nouvelleLigne.classList.add("ligne");

    // Champs pour sélectionner le type de quincallerie
    const selectQuincallerie = document.createElement("select");
    selectQuincallerie.name = "choixQuincallerie";
    selectQuincallerie.id = "choixQuincallerie";

    // Option par défaut
    const optionDefault = document.createElement("option");
    optionDefault.text = "Choisir...";
    selectQuincallerie.appendChild(optionDefault);

    // Ajouter les options pour chaque type de quincallerie
    for (const ref in PRIX_QUINCALLERIES) {
        const quincallerie = PRIX_QUINCALLERIES[ref];
        const option = document.createElement("option");
        option.value = ref;
        option.text = quincallerie.libelleQuin;
        selectQuincallerie.appendChild(option);
    }

    // Ajout d'un gestionnaire d'événements pour détecter le changement de sélection
    selectQuincallerie.addEventListener("change", function() {
        const selectedRef = selectQuincallerie.value;
        const quincallerieSelectionnee = PRIX_QUINCALLERIES[selectedRef];

        // Remplir les autres champs avec les données de la quincallerie sélectionnée
        refInput.value = selectedRef;
        libelleQuin.value = quincallerieSelectionnee.libelleQuin;
        lienInput.value = quincallerieSelectionnee.lienQuin;
        quantQuin.value = quincallerieSelectionnee.quantQuin;
    });

    // Champ pour saisir la référence de quincallerie
    const refInput = createInput("text", "REF");
    refInput.addEventListener("input", function() {
        const enteredRef = refInput.value.trim();

        // Vérifier si la référence saisie est valide
        const isValidRef = enteredRef in PRIX_QUINCALLERIES;

        // Si la référence est valide, sélectionner l'option correspondante dans selectQuincallerie
        if (isValidRef) {
            const options = selectQuincallerie.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === enteredRef) {
                    options[i].selected = true;
                    selectQuincallerie.dispatchEvent(new Event('change')); // Déclencher l'événement change manuellement
                    break;
                }
            }
        } else {
            // Réinitialiser les champs si la référence est invalide
            libelleQuin.value = "";
            lienInput.value = "";
            quantQuin.value = "";
        }
    });

    // Créer une fonction utilitaire pour générer les champs d'entrée
    function createInput(type, placeholder) {
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        return input;
    }

    // Champ pour le libellé de la quincallerie
    const libelleQuin = createInput("text", "Libellé");
    // Champ pour le lien de la quincallerie
    const lienInput = createInput("text", "Lien");
    // Champ pour la quantité de la quincallerie
    const quantQuin = createInput("number", "Qté");

    // Ajouter les éléments à la ligne
    nouvelleLigne.appendChild(selectQuincallerie);
    nouvelleLigne.appendChild(refInput);
    nouvelleLigne.appendChild(libelleQuin);
    nouvelleLigne.appendChild(lienInput);
    nouvelleLigne.appendChild(quantQuin);

    // Ajouter la nouvelle ligne au conteneur de quincallerie
    ligneQuincallerie.appendChild(nouvelleLigne);
}



document.getElementById("btnQuincallerie").addEventListener("click", ajouterQuincallerie);