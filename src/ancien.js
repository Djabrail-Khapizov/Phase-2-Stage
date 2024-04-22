// Références de types de bois avec leurs détails
const PRIX_BOIS = {
    ref123: { nom: "Bois A", prix: 35},
    ref456: { nom: "Bois B", prix: 22}
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

    const prixTotalBois = document.createElement("text");
    prixTotalBois.text = PRIX_BOIS.prixTotalBois;


    // Ajouter les options pour chaque type de bois
    for (const ref in PRIX_BOIS) {
        const bois = PRIX_BOIS[ref];
        const option = document.createElement("option");
        option.value = ref;
        option.text = bois.nom;
        selectBois.appendChild(option);
    }

    // Ajout d'un gestionnaire d'événements pour détecter le changement de sélection
    selectBois.addEventListener("change", function() {
        const selectedRef = selectBois.value;
        const boisSelectionne = PRIX_BOIS[selectedRef];

        // Remplir les autres champs avec les données du bois sélectionné
        refInput.value = selectedRef;
    });

    // Champ pour saisir la référence
    const refInput = createInput("text", "REF");
    refInput.addEventListener("input", function() {
        const enteredRef = refInput.value.trim();

        // Vérifier si la référence saisie est valide
        const isValidRef = enteredRef in PRIX_BOIS;


        // Si la référence est valide, sélectionner l'option correspondante dans selectBois
        if (isValidRef) {
            const options = selectBois.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === enteredRef) {
                    options[i].selected = true;
                    break;
                }
            }
        } else {
            // Réinitialiser le champ selectBois à l'option par défaut si la référence est invalide
            selectBois.selectedIndex = 0;
        }
    });

    // Créer une fonction utilitaire pour générer les champs d'entrée
    function createInput(type, placeholder) {
        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        return input;
    }

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