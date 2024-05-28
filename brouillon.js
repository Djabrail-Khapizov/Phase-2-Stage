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
    });

    const specialCharsDiv = document.createElement("div");
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

// Function to update the total surface and price
const updateTotalValues = () => {
    const ligneBois = document.querySelectorAll(".bois-line");
    const totalBois = document.getElementById("totalBois");

    // Réinitialiser les totaux
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

    // Mettre à jour les lignes de total
    totalMap.forEach((value, key) => {
        const totalBoisLine = totalBois.querySelector(`.total-bois-line[data-type="${key}"]`);
        if (totalBoisLine) {
            totalBoisLine.querySelector('input[placeholder="Surface (m²)"]').value = value.surface.toFixed(2) + " m²";
            totalBoisLine.querySelector('input[placeholder="Total"]').value = value.price.toFixed(2) + " €";
        }
    });
};




const createTotalBoisLine = (typeBois) => {
    const totalBois = document.getElementById("totalBois");

    // Vérifier si une ligne pour ce type de bois existe déjà
    let existingLine = document.querySelector(`.total-bois-line[data-type="${typeBois}"]`);
    if (existingLine) {
        return; // La ligne existe déjà, pas besoin de la recréer
    }

    const totalBoisLine = document.createElement("div");
    totalBoisLine.classList.add("total-bois-line");
    totalBoisLine.setAttribute("data-type", typeBois); // Ajoute un attribut pour identifier le type de bois

    const totalBoisLabel = document.createElement("span");
    totalBoisLabel.textContent = `Total Bois ${typeBois}`;

    // Champ pour la surface totale
    const totalSurface = document.createElement("input");
    totalSurface.type = "text";
    totalSurface.placeholder = "Surface (m²)";
    totalSurface.disabled = true;

    // Champ pour le prix total
    const totalBoisPrice = document.createElement("input");
    totalBoisPrice.type = "text";
    totalBoisPrice.placeholder = "Total";
    totalBoisPrice.disabled = true;

    // Bouton CSV
    const csvButton = document.createElement("button");
    csvButton.textContent = "CSV CUTLIST";
    csvButton.classList.add("csv-button");

    totalBoisLine.appendChild(totalBoisLabel);
    totalBoisLine.appendChild(totalSurface);
    totalBoisLine.appendChild(totalBoisPrice);
    totalBoisLine.appendChild(csvButton);

    totalBois.appendChild(totalBoisLine);

    return { totalSurface, totalBoisPrice };
};

