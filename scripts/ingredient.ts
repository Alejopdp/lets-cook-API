import { Ingredient } from "../src/bounded_contexts/operations/domain/ingredient/ingredient";
import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale";
import { mongooseIngredientRepository } from "../src/bounded_contexts/operations/infra/repositories/ingredient";

const baseIngredients = [
    {
        es: "Pechuga de pollo",
        en: "Chicken breast",
        ca: "Pit de pollastre",
    },
    {
        es: "Pollo filete",
        en: "Chicken fillet",
        ca: "Filet de pollastre",
    },
    {
        es: "Carne de ternera",
        en: "Beef",
        ca: "Carn de vedella",
    },
    {
        es: "Salmón (Pescado)",
        en: "Salmon (Fish)",
        ca: "Salmó (Peix)",
    },
    {
        es: "Solomillo",
        en: "Pork tenderloin",
        ca: "Filet",
    },
    {
        es: "Entraña de ternera",
        en: "Hanger steak",
        ca: "Comporta de vedella",
    },
    {
        es: "Colita",
        en: "Colita",
        ca: "Colita",
    },
    {
        es: "Medallón de atún (Pescado)",
        en: "Tuna medallion (Fish)",
        ca: "Medalló de tonyina (Peix)",
    },
    {
        es: "Secreto ibérico",
        en: "Iberian secret",
        ca: "Secret ibèric",
    },
    {
        es: "Filete de cerdo",
        en: "Pork steak",
        ca: "Filet de porc",
    },
    {
        es: "Besugo (Pescado)",
        en: "Sea bream (Fish)",
        ca: "Besuc (Peix)",
    },
    {
        es: "Muslos de pollo",
        en: "Chicken thighs",
        ca: "Cuixes de pollastre",
    },
    {
        es: "Chuletón",
        en: "Chuletón",
        ca: "Mitjana de vedella",
    },
    {
        es: "Merluza (Pescado)",
        en: "Hake (Fish)",
        ca: "Lluç (Peix)",
    },
    {
        es: "Aguja de cerdo",
        en: "Pork needle",
        ca: "Agulla de porc",
    },
    {
        es: "Carne de ternera picada",
        en: "Ground beef",
        ca: "Carn de vedella picada",
    },
    {
        es: "Chuletas de cerdo",
        en: "Pork chops",
        ca: "Costelles de porc",
    },
    {
        es: "Trucha (Pescado)",
        en: "Trout (Fish)",
        ca: "Truita (Peix)",
    },
    {
        es: "Caballa (Pescado)",
        en: "Mackerel (Fish)",
        ca: "Verat (Peix)",
    },
    {
        es: "Tapa (crostó)",
        en: "Tapa (crostó)",
        ca: "Crostó de vedella",
    },
    {
        es: "Onglet de ternera",
        en: "Onglet",
        ca: "Onglet de vedella",
    },
    {
        es: "Chorizo",
        en: "Chorizo",
        ca: "Xoriço",
    },
    {
        es: "Chorizo Criollo",
        en: "Creole sausage",
        ca: "Xoriço crioll",
    },
    {
        es: "Morcilla",
        en: "Blood sausage",
        ca: "Botifarra",
    },
    {
        es: "Vacío de ternera",
        en: "Vacío de ternera",
        ca: "Buit de vedella",
    },
    {
        es: "Atún en lata (al natural) (Pescado)",
        en: "Tin tuna (natural) (Fish)",
        ca: "Tonyina en llauna (a l'natural) (Peix)",
    },
    {
        es: "Acelga",
        en: "Chard",
        ca: "Bleda",
    },
    {
        es: "Aguacate",
        en: "Avocado",
        ca: "Alvocat",
    },
    {
        es: "Ajo",
        en: "Garlic",
        ca: "All",
    },
    {
        es: "Albahaca fresca",
        en: "Fresh basil",
        ca: "Alfàbrega fresca",
    },
    {
        es: "Alcachofa",
        en: "Artichoke",
        ca: "Carxofa",
    },
    {
        es: "Apio (Apio)",
        en: "Celery (Celery)",
        ca: "Api (Api)",
    },
    {
        es: "Berenjena",
        en: "Eggplant",
        ca: "Albergínia",
    },
    {
        es: "Boniato",
        en: "Sweet potato",
        ca: "Moniato",
    },
    {
        es: "Brócoli",
        en: "Broccoli",
        ca: "Bròquil",
    },
    {
        es: "Calabacín",
        en: "Zucchini",
        ca: "Carbassó",
    },
    {
        es: "Calabaza",
        en: "Pumpkin",
        ca: "Carbassa",
    },
    {
        es: "Cardo",
        en: "Thistle",
        ca: "Card",
    },
    {
        es: "Cebolla tierna",
        en: "Spring onion",
        ca: "Ceba tendra",
    },
    {
        es: "Cebolla de Figueres",
        en: "Figueres' Onion",
        ca: "Ceba de figueres",
    },
    {
        es: "Chalotas",
        en: "Shallots",
        ca: "Escalunyes",
    },
    {
        es: "Champiñones Portobello",
        en: "Mushroom Portobello",
        ca: "Xampinyons Portobello",
    },
    {
        es: "Col lombarda",
        en: "Red cabbage",
        ca: "Col llombarda",
    },
    {
        es: "Coliflor",
        en: "Cauliflower",
        ca: "Coliflor",
    },
    {
        es: "Endibia",
        en: "Endive",
        ca: "Endívia",
    },
    {
        es: "Escarola",
        en: "Escarola",
        ca: "Escarola",
    },
    {
        es: "Esparrago verde",
        en: "Green asparagus",
        ca: "Espàrrec de marge",
    },
    {
        es: "Espinaca",
        en: "Spinach",
        ca: "Espinacs",
    },
    {
        es: "Guisantes",
        en: "Peas",
        ca: "Pèsols",
    },
    {
        es: "Habas",
        en: "Beans",
        ca: "Faves",
    },
    {
        es: "Judía ancha",
        en: "Green beans",
        ca: "Jueva ampla",
    },
    {
        es: "Lechuga",
        en: "Lettuce",
        ca: "Enciam",
    },
    {
        es: "Nabo",
        en: "Turnip",
        ca: "Nap",
    },
    {
        es: "Patata",
        en: "Potato",
        ca: "Patata",
    },
    {
        es: "Pepino",
        en: "Cucumber",
        ca: "Cogombre",
    },
    {
        es: "Perejil",
        en: "Parsley",
        ca: "Julivert",
    },
    {
        es: "Pimiento rojo",
        en: "Red pepper",
        ca: "Pebrot vermell",
    },
    {
        es: "Pimiento verde",
        en: "Green pepper",
        ca: "Pebrot verd",
    },
    {
        es: "Puerro",
        en: "Leek",
        ca: "Porro",
    },
    {
        es: "Rábano",
        en: "Radish",
        ca: "Rave",
    },
    {
        es: "Remolacha cocida",
        en: "Baked beet",
        ca: "Remolatxa cuita",
    },
    {
        es: "Repollo",
        en: "Cabbage",
        ca: "Col",
    },
    {
        es: "Rúcula",
        en: "Rocket leaves",
        ca: "Ruca",
    },
    {
        es: "Tomate",
        en: "Tomato",
        ca: "Tomàquet",
    },
    {
        es: "Tomates cherry",
        en: "Cherry tomatoes",
        ca: "Tomàquets cherry",
    },
    {
        es: "Zanahoria",
        en: "Carrot",
        ca: "Pastanaga",
    },
    {
        es: "Albahaca",
        en: "Basil",
        ca: "Alfàbrega",
    },
    {
        es: "Cilantro",
        en: "Cilantro",
        ca: "Coriandre",
    },
    {
        es: "Judia verde",
        en: "Green beans",
        ca: "Mongeta verdes",
    },
    {
        es: "Eneldo fresco",
        en: "Fresh dill",
        ca: "Anet fresc",
    },
    {
        es: "Remolacha",
        en: "Beet",
        ca: "Remolatxa",
    },
    {
        es: "Brotes tiernos",
        en: "Mixed greens",
        ca: "Brots",
    },
    {
        es: "Jengibre fresco",
        en: "Fresh ginger",
        ca: "Gingebre fresc",
    },
    {
        es: "Ajo tierno fresco",
        en: "Fresf garlic shoots",
        ca: "Alls tendres frescos",
    },
    {
        es: "Guindilla verde",
        en: "Green chilli",
        ca: "Bitxo verd",
    },
    {
        es: "Tomillo fresco",
        en: "Fresh Thyme",
        ca: "Farigola fresc",
    },
    {
        es: "Bimi",
        en: "Bimi",
        ca: "Bimi",
    },
    {
        es: "Patata mini",
        en: "New potatoes",
        ca: "Patata mini",
    },
    {
        es: "Coles de bruselas",
        en: "Brussels sprouts",
        ca: "Cols de brussel·les",
    },
    {
        es: "Cebollino",
        en: "Chive",
        ca: "Cibulet",
    },
    {
        es: "Cebolla roja",
        en: "Red onion",
        ca: "Ceba vermella",
    },
    {
        es: "Pimiento dulce",
        en: "Sweet pepper",
        ca: "Pebrot dolç",
    },
    {
        es: "Kale",
        en: "Kale",
        ca: "Kale",
    },
    {
        es: "Pimientos de padrón",
        en: "Padrón peppers",
        ca: "Pebrots de padró",
    },
    {
        es: "Canónigos",
        en: "Lamb's lettuce",
        ca: "Canonges",
    },
    {
        es: "Esparragos",
        en: "Asparagus",
        ca: "Espàrrecs",
    },
    {
        es: "Hinojo",
        en: "Fennel",
        ca: "Fonoll",
    },
    {
        es: "Germinado de espárrago",
        en: "Asparagus sprouts ( )",
        ca: "Germinat d'esparrec",
    },
    {
        es: "Pimiento amarillo",
        en: "Yellow pepper",
        ca: "Pebrot groc",
    },
    {
        es: "Tomate Monterosa",
        en: "Monterosa Tomato",
        ca: "Tomàquet Monterosa",
    },
    {
        es: "Achicoria roja",
        en: "Red chicory",
        ca: "Xicoira vermella",
    },
    {
        es: "Hoja de roble",
        en: "Oak Leaf",
        ca: "Full de roure",
    },
    {
        es: "Col blanca",
        en: "White cabbage",
        ca: "Col blanca",
    },
    {
        es: "Cebolleta japonesa",
        en: "Japanese chive",
        ca: "Ceba tendra japonesa",
    },
    {
        es: "Lechuga iceberg",
        en: "Iceberg Lettuce",
        ca: "Enciam iceberg",
    },
    {
        es: "Menta",
        en: "Fresh mint",
        ca: "Menta",
    },
    {
        es: "Pak choi",
        en: "Pak Choi",
        ca: "Pak choi",
    },
    {
        es: "Chili",
        en: "Chili",
        ca: "Chili",
    },
    {
        es: "Maíz",
        en: "Sweet Corn",
        ca: "Blat de moro",
    },
    {
        es: "Salvia fresca",
        en: "Fresh Sage",
        ca: "Salvia fresca",
    },
    {
        es: "Tomate seco",
        en: "Dry tomato",
        ca: "Tomàquet sec",
    },
    {
        es: "Shitake",
        en: "Shitake",
        ca: "Shitake",
    },
    {
        es: "Limón",
        en: "Lemon",
        ca: "Llimona",
    },
    {
        es: "Lima",
        en: "lime",
        ca: "Llima",
    },
    {
        es: "Naranja",
        en: "Orange",
        ca: "Taronja",
    },
    {
        es: "Mandarina",
        en: "Tangerine",
        ca: "Mandarina",
    },
    {
        es: "Fresas",
        en: "Strawberries",
        ca: "Maduixes",
    },
    {
        es: "Arándanos frescos",
        en: "Fresh blueberries",
        ca: "Nabius frescos",
    },
    {
        es: "Melocotón",
        en: "Peach",
        ca: "Préssec",
    },
    {
        es: "Ciruela",
        en: "Plum",
        ca: "Prunes",
    },
    {
        es: "Manzana",
        en: "Apple",
        ca: "Poma",
    },
    {
        es: "Pera",
        en: "Pear",
        ca: "Pera",
    },
    {
        es: "Higo",
        en: "Fig",
        ca: "Figa",
    },
    {
        es: "Manzana verde",
        en: "Green apple",
        ca: "Poma verda",
    },
    {
        es: "Nectarina",
        en: "Nectarine",
        ca: "Nectarina",
    },
    {
        es: "Moras",
        en: "Blackberries",
        ca: "Mores",
    },
    {
        es: "Frutos rojos",
        en: "Red Berries",
        ca: "Fruits vermells",
    },
    {
        es: "Plátano",
        en: "Banana",
        ca: "Plàtan",
    },
    {
        es: "Olivas",
        en: "Olives",
        ca: "Olives",
    },
    {
        es: "Aceitunas negras",
        en: "Black Olives",
        ca: "Negres Olives",
    },
    {
        es: "Aceitunas verdes",
        en: "Green olives",
        ca: "Olives verdes",
    },
    {
        es: "Setas variadas",
        en: "Assorted mushrooms",
        ca: "Boletus variat",
    },
    {
        es: "Trompeta amarilla",
        en: "Yellow foot mushroom",
        ca: "Camagroc",
    },
    {
        es: "Arugula",
        en: "Arugula",
        ca: "Arugula",
    },
    {
        es: "Arroz basmati",
        en: "Basmati rice",
        ca: "Arròs basmati",
    },
    {
        es: "Cuscús (Gluten)",
        en: "Couscous (Gluten)",
        ca: "Cuscús (Gluten)",
    },
    {
        es: "Arroz salvaje",
        en: "Wild rice",
        ca: "Arròs salvatge",
    },
    {
        es: "Arroz arborio",
        en: "Arborio rice",
        ca: "Arròs arborio",
    },
    {
        es: "Lentejas rojas",
        en: "Red lentils",
        ca: "Llenties vermelles",
    },
    {
        es: "Arroz blanco",
        en: "White rice",
        ca: "Arròs blanc",
    },
    {
        es: "Bulgur (Gluten)",
        en: "Bulgur (Gluten)",
        ca: "Bulgur (Gluten)",
    },
    {
        es: "Chía",
        en: "Chia",
        ca: "Chía",
    },
    {
        es: "Arroz jazmin",
        en: "Jazmin rice",
        ca: "Arròs de gessamí",
    },
    {
        es: "Trigo tierno (Gluten)",
        en: "Barley (Gluten)",
        ca: "Blat tendre (Gluten)",
    },
    {
        es: "Quinoa",
        en: "Quinoa",
        ca: "Quinoa",
    },
    {
        es: "Frijoles",
        en: "Black Beans",
        ca: "Fesols",
    },
    {
        es: "Arroz integral",
        en: "Brown rice",
        ca: "Arròs integral",
    },
    {
        es: "Polenta",
        en: "Polenta",
        ca: "Polenta",
    },
    {
        es: "Arroz Largo",
        en: "Long-grain rice",
        ca: "Arròs Llarg",
    },
    {
        es: "Arroz de sushi",
        en: "Sushi rice",
        ca: "Arròs de sushi",
    },
    {
        es: "Lentejas pardina",
        en: "Lentils pardina",
        ca: "Llenties pardina",
    },
    {
        es: "Cuscús israelí (Gluten)",
        en: "Israeli couscous (Gluten)",
        ca: "Cuscús israelià (Gluten)",
    },
    {
        es: "Copos de avena (Gluten)",
        en: "Oatmeal (Gluten)",
        ca: "Flocs de civada (Gluten)",
    },
    {
        es: "Germen de trigo (Gluten)",
        en: "Wheat germ (Gluten)",
        ca: "Germen de blat (Gluten)",
    },
    {
        es: "Salvado de avena (Gluten)",
        en: "Oat bran (Gluten)",
        ca: "Segó de civada (Gluten)",
    },
    {
        es: "Trigo sarraceno (Gluten)",
        en: "Buckwheat (Gluten)",
        ca: "Blat sarraí (Gluten)",
    },
    {
        es: "Mijo",
        en: "Millet",
        ca: "Mill",
    },
    {
        es: "Semillas de lino",
        en: "Linen seeds",
        ca: "Llavors de lli",
    },
    {
        es: "Edamame seco",
        en: "Dry Edamame",
        ca: "Edamame sec",
    },
    {
        es: "Gomasio",
        en: "Gomashio",
        ca: "Sal de sésam",
    },
    {
        es: "Sésamo tostado (Sésamo)",
        en: "Sesame toasted (Sesame)",
        ca: "Sèsam torrat (Sèsam)",
    },
    {
        es: "Semillas de calabaza fritas (Frutos secos)",
        en: "Fried pumpkin seeds (Nuts)",
        ca: "Llavors de carbassa fregides (Fruits secs)",
    },
    {
        es: "Moong dal (Soja)",
        en: "Moong Dal (Soy)",
        ca: "Moong dal (Soja)",
    },
    {
        es: "Amaranto",
        en: "Amaranth",
        ca: "Amarant",
    },
    {
        es: "Semillas de girasol",
        en: "Sunflower seeds",
        ca: "Llavors de gira-sol",
    },
    {
        es: "Almendras (Frutos secos)",
        en: "Almonds (Nuts)",
        ca: "Ametlles (Fruits secs)",
    },
    {
        es: "Nueces (Frutos secos)",
        en: "Walnuts (Nuts)",
        ca: "Nous (Fruits secs)",
    },
    {
        es: "Avellanas (Frutos secos)",
        en: "Hazelnuts (Nuts)",
        ca: "Avellanes (Fruits secs)",
    },
    {
        es: "Anacardos (Frutos secos)",
        en: "Cashews (Nuts)",
        ca: "Anacards (Fruits secs)",
    },
    {
        es: "Cacahuetes (Cachuetes)",
        en: "Peanuts (Peanuts)",
        ca: "Cacauets (Cacauets)",
    },
    {
        es: "Almendras tostadas (Frutos secos)",
        en: "Toasted almonds (Nuts)",
        ca: "Ametlles torrades (Fruits secs)",
    },
    {
        es: "Pasas",
        en: "Raisins",
        ca: "Panses",
    },
    {
        es: "Pistachos (Frutos secos)",
        en: "Pistachios (Nuts)",
        ca: "Festuc (Fruits secs)",
    },
    {
        es: "Anacardos tostados (Frutos secos)",
        en: "Toasted cashews (Nuts)",
        ca: "Anacards torrats (Fruits secs)",
    },
    {
        es: "Dátiles",
        en: "Dates",
        ca: "Dàtils",
    },
    {
        es: "Almendras laminadas (Frutos secos)",
        en: "Laminated almonds (Nuts)",
        ca: "Ametlles laminades (Fruits secs)",
    },
    {
        es: "Arándanos secos",
        en: "Dried cranberries",
        ca: "Nabius secs",
    },
    {
        es: "Agar agar",
        en: "Agar agar",
        ca: "Agar agar",
    },
    {
        es: "Jalapeños picantes",
        en: "Hot Jalapeños pepper",
        ca: "Jalapeños picants",
    },
    {
        es: "Tomate frito",
        en: "Tomato sauce",
        ca: "Tomàquet fregit",
    },
    {
        es: "Tomate troceado",
        en: "Chopped tomato",
        ca: "Tomàquet trossejat",
    },
    {
        es: "Alubia roja",
        en: "Red bean",
        ca: "Mongeta vermella",
    },
    {
        es: "Pan de hamburguesa (Gluten)",
        en: "Burger bun (Gluten)",
        ca: "Pa d'hamburgessa (Gluten)",
    },
    {
        es: "Tortilla de trigo (Gluten)",
        en: "Wheat tortilla (Gluten)",
        ca: "Tortilla de blat blanc (Gluten)",
    },
    {
        es: "Maíz dulce",
        en: "Sweet corn",
        ca: "Blat de moro dolç",
    },
    {
        es: "Papel de arroz",
        en: "Rice paper",
        ca: "Paper d'arròs",
    },
    {
        es: "Fideos de arroz",
        en: "Rice noodles",
        ca: "Fideus d'arròs",
    },
    {
        es: "Tallarín de arroz",
        en: "Rice noodles",
        ca: "Tallarina d'arròs",
    },
    {
        es: "Sin gluten - tortilla",
        en: "Gluten free tortilla",
        ca: "Sense gluten - Tortilla",
    },
    {
        es: "Harina de trigo (Gluten)",
        en: "Wheat flour (Gluten)",
        ca: "Farina de blat (Gluten)",
    },
    {
        es: "Pan rallado (Gluten)",
        en: "Bread crumbs (Gluten)",
        ca: "Pa ratllat (Gluten)",
    },
    {
        es: "Naan (pan hindú) (Gluten)",
        en: "Naan (Indian bread) (Gluten)",
        ca: "Naan (pa hindú) (Gluten)",
    },
    {
        es: "Lentejas",
        en: "Lentils",
        ca: "Llenties",
    },
    {
        es: "Risoni (Gluten)",
        en: "Risoni (Gluten)",
        ca: "Risoni (Gluten)",
    },
    {
        es: "Maicena",
        en: "Cornstarch",
        ca: "Midó de blat de moro",
    },
    {
        es: "Harina (Gluten)",
        en: "Flour (Gluten)",
        ca: "Farina (Gluten)",
    },
    {
        es: "Pasta (Gluten)",
        en: "Pasta (Gluten)",
        ca: "Pasta (Gluten)",
    },
    {
        es: "Picatostes (Gluten)",
        en: "Croutons (Gluten)",
        ca: "Crostons (Gluten)",
    },
    {
        es: "Tallarines yakisoba (Gluten)",
        en: "Noodles Yakisoba (Gluten)",
        ca: "Fideus yakisoba (Gluten)",
    },
    {
        es: "Fusilli (Gluten)",
        en: "Fusilli (Gluten)",
        ca: "Fusilli (Gluten)",
    },
    {
        es: "Panela",
        en: "Panela",
        ca: "Panela",
    },
    {
        es: "Tallarines tomoshiraga somen (Gluten)",
        en: "Tomoshiraga Somenteen noodles (Gluten)",
        ca: "Tallarines tomoshiraga somen (Gluten)",
    },
    {
        es: "Pan de pita (Gluten)",
        en: "Pita bread (Gluten)",
        ca: "Pa de pita (Gluten)",
    },
    {
        es: "Gnocchi (Gluten, Huevos)",
        en: "Gnocchi (Gluten, Eggs)",
        ca: "Gnocchi (Gluten, Ous)",
    },
    {
        es: "Harina de trigo integral (Gluten)",
        en: "Whole wheat flour (Gluten)",
        ca: "Farina de blat integral (Gluten)",
    },
    {
        es: "Pasta sin gluten",
        en: "Gluten-free pasta",
        ca: "Pasta sense gluten",
    },
    {
        es: "Tortilla de maíz",
        en: "Corn tortilla",
        ca: "Tortilla de blat de moro",
    },
    {
        es: "Rigatoni (Gluten)",
        en: "Rigatoni (Gluten)",
        ca: "Rigatoni (Gluten)",
    },
    {
        es: "Harina de avena (Gluten)",
        en: "Oat flour (Gluten)",
        ca: "Farina de civada (Gluten)",
    },
    {
        es: "Harina de garbanzo",
        en: "Chickpea flour",
        ca: "Farina de cigró",
    },
    {
        es: "Tallarines Udon (Gluten)",
        en: "Udon noodles (Gluten)",
        ca: "Tallarines Udon (Gluten)",
    },
    {
        es: "Pan de brioche (Gluten)",
        en: "Brioche bread (Gluten)",
        ca: "Pa de brioix (Gluten)",
    },
    {
        es: "Gnocchi sin gluten ni lactosa",
        en: "Gnocchi without gluten or lactose",
        ca: "Gnocchi sense gluten ni lactosa",
    },
    {
        es: "Harina Pan",
        en: "Corn flour",
        ca: "Farina Pan",
    },
    {
        es: "Macarrones de lentejas",
        en: "Lentil macaroni",
        ca: "Macarrons de llenties",
    },
    {
        es: "Pan hogaza de masa madre (Gluten)",
        en: "Sourdough loaf bread (Gluten)",
        ca: "Pa fogassa de massa mare (Gluten)",
    },
    {
        es: "Pan pita sin gluten",
        en: "Gluten-free bread",
        ca: "Pa de pita sense gluten",
    },
    {
        es: "Panko (Gluten)",
        en: "Panko (Gluten)",
        ca: "Panko (Gluten)",
    },
    {
        es: "Tagliatelle (Gluten)",
        en: "Tagliatelle (Gluten)",
        ca: "Tagliatelle (Gluten)",
    },
    {
        es: "Pasta vegana (Gluten)",
        en: "Vegan pasta (Gluten)",
        ca: "Pasta vegana (Gluten)",
    },
    {
        es: "Picatostes sin gluten",
        en: "Gluten-free croutons",
        ca: "Crostons sense gluten",
    },
    {
        es: "Tomates troceados",
        en: "Tomatoes chopped",
        ca: "Tomàquets trossejats",
    },
    {
        es: "Garbanzos",
        en: "Cooked",
        ca: "Cigrons",
    },
    {
        es: "Alcaparras",
        en: "Capers",
        ca: "Tàperes",
    },
    {
        es: "Soja texturizada (Soja)",
        en: "Dehydrated soy protein (Soy)",
        ca: "Soja texturitzada (Soja)",
    },
    {
        es: "Proteína vegetal (Soja)",
        en: "Vegetable Protein (Soy)",
        ca: "Proteina vegetal (Soja)",
    },
    {
        es: "Harina sin gluten",
        en: "Gluten-free flour",
        ca: "Farina sense gluten",
    },
    {
        es: "Pimientos asados",
        en: "Roasted peppers",
        ca: "Pebrots rostits",
    },
    {
        es: "Alubias blancas",
        en: "White beans",
        ca: "Mongetes blanques",
    },
    {
        es: "Tomates secos en aceite",
        en: "Dry tomatoes in oil",
        ca: "Tomàquets secs en oli",
    },
    {
        es: "Tomate pelado",
        en: "Peeled tomato",
        ca: "Tomàquet pelat",
    },
    {
        es: "Pan Burguer sin gluten",
        en: "Gluten-free Burger bun",
        ca: "Pa d'hamburguessa sense gluten",
    },
    {
        es: "Pan rallado sin gluten",
        en: "Gluten-free bread crums",
        ca: "Pa ratllat sense gluten",
    },
    {
        es: "Piña",
        en: "Pineapple",
        ca: "Pinya",
    },
    {
        es: "Queso Halloumi (Lácteos)",
        en: "Halloumi cheese (Milk)",
        ca: "Formatge Halloumi (Lactis)",
    },
    {
        es: "Queso de cabra (Lácteos)",
        en: "Goat cheese (Milk)",
        ca: "Formatge de cabra (Lactis)",
    },
    {
        es: "Leche (Lácteos)",
        en: "Milk (Milk)",
        ca: "Llet (Lactis)",
    },
    {
        es: "Yogur natural (Lácteos)",
        en: "Natural yogurt (Milk)",
        ca: "Iogurt natural (Lactis)",
    },
    {
        es: "Nata cocina (Lácteos)",
        en: "Cooking cream (Milk)",
        ca: "Nata cuina (Lactis)",
    },
    {
        es: "Queso Parmesano rallado (Lácteos)",
        en: "Grated Parmesan cheese (Milk)",
        ca: "Formatge Parmesà ratllat (Lactis)",
    },
    {
        es: "Queso rallado (Lácteos)",
        en: "Grated cheese (Milk)",
        ca: "Formatge ratllat (Lactis)",
    },
    {
        es: "Queso feta (Lácteos)",
        en: "Feta cheese (Milk)",
        ca: "Formatge feta (Lactis)",
    },
    {
        es: "Mantequilla (Lácteos)",
        en: "Butter (Milk)",
        ca: "Mantega (Lactis)",
    },
    {
        es: "Ghee (Lácteos)",
        en: "Ghee (Milk)",
        ca: "Ghee (Lactis)",
    },
    {
        es: "Yogur griego (Lácteos)",
        en: "Greek yogurt (Milk)",
        ca: "Iogurt grec (Lactis)",
    },
    {
        es: "Queso Parmesano (Lácteos)",
        en: "Parmesan cheese (Milk)",
        ca: "Formatge Parmesà (Lactis)",
    },
    {
        es: "Queso azul (Lácteos)",
        en: "Blue cheese (Milk)",
        ca: "Formatge blau (Lactis)",
    },
    {
        es: "Yogur sin lactosa",
        en: "Lactose-free Yogurt",
        ca: "Iogurt sense lactosa",
    },
    {
        es: "Mozzarella (Lácteos)",
        en: "Mozzarella (Milk)",
        ca: "Mozzarella (Lactis)",
    },
    {
        es: "Ricotta (Lácteos)",
        en: "Ricotta (Milk)",
        ca: "Ricotta (Lactis)",
    },
    {
        es: "Queso cheddar (Lácteos)",
        en: "Cheddar cheese (Milk)",
        ca: "Formatge cheddar (Lactis)",
    },
    {
        es: "Créme fraiche (Lácteos)",
        en: "Creme fraiche (Milk)",
        ca: "Crème fraiche (Lactis)",
    },
    {
        es: "Queso manchego (Lácteos)",
        en: "Manchego cheese (Milk)",
        ca: "Formatge manxec (Lactis)",
    },
    {
        es: "Leche evaporada (Lácteos)",
        en: "Evaporated milk (Milk)",
        ca: "Llet evaporada (Lactis)",
    },
    {
        es: "Queso crema (Lácteos)",
        en: "Cream cheese (Milk)",
        ca: "Formatge crema (Lactis)",
    },
    {
        es: "Queso provolone (Lácteos)",
        en: "Provolone cheese (Milk)",
        ca: "Formatge provolone (Lactis)",
    },
    {
        es: "Cheddar vegano",
        en: "Vegan Cheddar",
        ca: "Formatge cheddar vegà",
    },
    {
        es: "Queso azul vegano",
        en: "Vegan blue cheese",
        ca: "Formatge blau vegà",
    },
    {
        es: "Mozzarella vegana",
        en: "VeganMozzarella",
        ca: "Formatge mozzarella vegana",
    },
    {
        es: "Queso rallado vegano",
        en: "Vegan grated cheese",
        ca: "Formatge ratllat vegà",
    },
    {
        es: "Parmesano vegano",
        en: "Vegan Parmesan",
        ca: "Formatge Parmesà vegà",
    },
    {
        es: "Queso feta vegano",
        en: "Vegan feta cheese",
        ca: "Formatge feta vegà",
    },
    {
        es: "Queso Halloumi vegano",
        en: "Vegan Halloumi cheese",
        ca: "Formatge Halloumi vegà",
    },
    {
        es: "Yogur de soja",
        en: "Soy yogurt",
        ca: "Iogurt de soja",
    },
    {
        es: "Queso sin lactosa",
        en: "Lactose-free cheese",
        ca: "Formatge sense lactosa",
    },
    {
        es: "Queso crema vegano",
        en: "Vegan cream cheese",
        ca: "Formatge crema vegà",
    },
    {
        es: "Queso rallado sin lactosa",
        en: "Lactose-free grated cheese",
        ca: "Formatge ratllat sense lactosa",
    },
    {
        es: "Queso crema sin lactosa",
        en: "Lactose-free cream cheese",
        ca: "Formatge crema sense lactosa",
    },
    {
        es: "Parmesano rallado vegano",
        en: "Vegan grated Parmesano",
        ca: "Formatge Parmesà vegà )ratllat)",
    },
    {
        es: "Levadura",
        en: "Yeast",
        ca: "Llevat",
    },
    {
        es: "Pimienta negra",
        en: "Black pepper",
        ca: "Pebre negre",
    },
    {
        es: "Pimentón dulce",
        en: "Paprika",
        ca: "Pebre vermell dolç",
    },
    {
        es: "Tomillo seco",
        en: "Dry Thyme",
        ca: "Farigola seca",
    },
    {
        es: "Pimentón picante",
        en: "Spicy paprika",
        ca: "Pebre vermell picant",
    },
    {
        es: "Sal",
        en: "Salt",
        ca: "Sal",
    },
    {
        es: "Orégano",
        en: "Oregano",
        ca: "Orenga",
    },
    {
        es: "Cardamomo en grano",
        en: "Cardamom seeds",
        ca: "Cardamom en gra",
    },
    {
        es: "Comino en grano",
        en: "Cumin seeds",
        ca: "Comí en gra",
    },
    {
        es: "Cilantro en grano",
        en: "Coriander seeds",
        ca: "Coriandre en gra",
    },
    {
        es: "Jengibre molido",
        en: "Ground ginger",
        ca: "Gingebre mòlt",
    },
    {
        es: "Caldo vegetal (Apio)",
        en: "Vegetable broth (Celery)",
        ca: "Brou vegetal (Api)",
    },
    {
        es: "Azúcar moreno",
        en: "Brown sugar",
        ca: "Sucre morè",
    },
    {
        es: "Garam masala",
        en: "Garam Masala",
        ca: "Garam masala",
    },
    {
        es: "Comino molido",
        en: "Ground cumin",
        ca: "Comí mòlt",
    },
    {
        es: "Sal gruesa",
        en: "Coarse salt",
        ca: "Sal gruixuda",
    },
    {
        es: "Sal Yodada",
        en: "Iodine salt",
        ca: "Sal iodada",
    },
    {
        es: "Pimienta cayena molida",
        en: "Ground Cayenne pepper",
        ca: "Cayena mòlta",
    },
    {
        es: "Cúrcuma",
        en: "Turmeric",
        ca: "Curcuma",
    },
    {
        es: "Sal pétalos",
        en: "Salt petals",
        ca: "Sal pètals",
    },
    {
        es: "Romero fresco",
        en: "Fresh rosemary",
        ca: "Romaní fresc",
    },
    {
        es: "Salvia",
        en: "Sage",
        ca: "Salvia",
    },
    {
        es: "Guindilla seca",
        en: "Dry Chilli",
        ca: "Bitxo sec",
    },
    {
        es: "Albahaca seca",
        en: "Dry Basil",
        ca: "Alfàbrega seca",
    },
    {
        es: "Canela",
        en: "Cinnamon",
        ca: "Canyella",
    },
    {
        es: "Ras el hanout",
        en: "Ras the Hanout",
        ca: "Ras el hanout",
    },
    {
        es: "Estragón",
        en: "Tarragon",
        ca: "Estragó",
    },
    {
        es: "Ajo en polvo (Ajo)",
        en: "Garlic powder (Garlic)",
        ca: "All en pols (All)",
    },
    {
        es: "Cebolla en polvo",
        en: "Onion powder",
        ca: "Ceba en pols",
    },
    {
        es: "Cayena en rama",
        en: "Dried Cayenne",
        ca: "Cayena (en branca)",
    },
    {
        es: "Katsuobushi (Pescado)",
        en: "Katsuobushi (Fish)",
        ca: "Katsuobushi (Peix)",
    },
    {
        es: "Hierbas italianas",
        en: "Italian herbs",
        ca: "Herbes italianes",
    },
    {
        es: "Clavo",
        en: "Clove",
        ca: "Clau d'especia",
    },
    {
        es: "Nuez moscada",
        en: "Nutmeg",
        ca: "Nou moscada",
    },
    {
        es: "Cilantro molido",
        en: "Ground Coriander",
        ca: "Coriandre mòlt",
    },
    {
        es: "Tandoor masala",
        en: "Tandoor Masala",
        ca: "Tandoor masala",
    },
    {
        es: "Mix Pollo Provenzal",
        en: "Mix Provencal chicken",
        ca: "Mix Pollastre Provençal",
    },
    {
        es: "Semillas de hinojo",
        en: "Fennel seeds",
        ca: "Llavors de fonoll",
    },
    {
        es: "Romero",
        en: "Romero",
        ca: "Romaní",
    },
    {
        es: "Perejil seco",
        en: "Dry Parsley",
        ca: "Julivert",
    },
    {
        es: "Cebolla crujiente frita",
        en: "Fried crunchy onion",
        ca: "Ceba cruixent fregida",
    },
    {
        es: "Chili picante",
        en: "Chili spicy",
        ca: "Chili picant",
    },
    {
        es: "Ñora molida",
        en: "Ground ñora",
        ca: "Nyora mòlta",
    },
    {
        es: "Mix Pollo Indonesio",
        en: "Mix Chicken Indonesian",
        ca: "Mix Pollastre Indonesi",
    },
    {
        es: "Mix Chili de verduras",
        en: "Mix chili of vegetables",
        ca: "Mix Chili de verdures",
    },
    {
        es: "Mix Masoor Dhal",
        en: "Mix Masoor Dhal",
        ca: "Mix Masoor Dhal",
    },
    {
        es: "Mix Solomillo con Kale",
        en: "Mix Sirloin with Kale",
        ca: "Mix Filet amb Kale",
    },
    {
        es: "Mix Boniato y espinaca",
        en: "Mix Boniato and spinach",
        ca: "Mix Moniato i espinacs",
    },
    {
        es: "Mix Tacos (Ajo)",
        en: "Mix tacos (Garlic)",
        ca: "Mix Tacs (All)",
    },
    {
        es: "Mix Masala de garbanzos",
        en: "Mix Masala de Chickpeas",
        ca: "Mix Masala de cigrons",
    },
    {
        es: "Mix Moussaka berenjena",
        en: "Mix Moussaka Eggplanta",
        ca: "Mix Moussaka albergínia",
    },
    {
        es: "Mix Souvlaki de calabaza",
        en: "Mix Souvlaki of Pumpkin",
        ca: "Mix Souvlaki de carbassa",
    },
    {
        es: "Mix Chili alubias blancas",
        en: "Mix Chili White Beans",
        ca: "Mix Chili mongetes blanques",
    },
    {
        es: "Mix Pollo provenzal",
        en: "Mix Provencal chicken",
        ca: "Mix Pollastre provençal",
    },
    {
        es: "Mix Barbacoa Argentina",
        en: "Mix Barbecue Argentina",
        ca: "Mix Barbacoa Argentina",
    },
    {
        es: "Tikka masala",
        en: "Tikka Masala",
        ca: "Tikka masala",
    },
    {
        es: "Sumac",
        en: "Sumac",
        ca: "Sumac",
    },
    {
        es: "Acai",
        en: "Acai",
        ca: "Acai",
    },
    {
        es: "Curry en polvo",
        en: "Curry powder",
        ca: "Curri en pols",
    },
    {
        es: "Nibs de cacao",
        en: "Cacao Nibs",
        ca: "Nibs de cacau",
    },
    {
        es: "Semillas de apio (Apio)",
        en: "Celery seeds (Celery)",
        ca: "Llavors d'api (Api)",
    },
    {
        es: "Levadura nutricional",
        en: "Nutritional yeast",
        ca: "Llevat nutricional",
    },
    {
        es: "Mostaza en grano (Mostaza)",
        en: "Mustard seeds (Mustard)",
        ca: "Mostassa en gra (Mostassa)",
    },
    {
        es: "Mostaza dijon en grano (Mostaza)",
        en: "Dijon Mustard seeds (Mustard)",
        ca: "Mostassa dijon en gra (Mostassa)",
    },
    {
        es: "Anís estrellado",
        en: "Star anise",
        ca: "Anís estrellat",
    },
    {
        es: "Salsa holandesa",
        en: "Hollandese sauce",
        ca: "Salsa holandesa",
    },
    {
        es: "Azúcar avainillada",
        en: "Avanillada sugar",
        ca: "Sucre avainillat",
    },
    {
        es: "Azúcar glas",
        en: "Powdered sugar",
        ca: "Sucre glas",
    },
    {
        es: "Cacao",
        en: "Cocoa",
        ca: "Cacau",
    },
    {
        es: "Azúcar blanca",
        en: "White sugar",
        ca: "Sucre blanc",
    },
    {
        es: "Bicarbonato de sodio",
        en: "Sodium bicarbonate",
        ca: "Bicarbonat de sodi",
    },
    {
        es: "Mostaza Dijon (Mostaza)",
        en: "Dijon Mustard (Mustard)",
        ca: "Mostassa Dijon (Mostassa)",
    },
    {
        es: "Leche de coco",
        en: "Coconut milk",
        ca: "Llet de coco",
    },
    {
        es: "Tahini (Sésamo)",
        en: "Tahini (Sesame)",
        ca: "Tahini (Sèsam)",
    },
    {
        es: "Crema de arroz",
        en: "Rice cream",
        ca: "Crema d'arròs",
    },
    {
        es: "Crema de avena (Gluten)",
        en: "Oatmeal cream (Gluten)",
        ca: "Crema de civada (Gluten)",
    },
    {
        es: "Pesto vegano",
        en: "Vegan pesto",
        ca: "Pesto vegà",
    },
    {
        es: "Crema de soja (Soja)",
        en: "Soy cream (Soy)",
        ca: "Crema de soja (Soja)",
    },
    {
        es: "Sambal oelek",
        en: "Sambal oelek",
        ca: "Sambal oelek",
    },
    {
        es: "Caldo de pollo (Gluten, Apio)",
        en: "Chicken broth (Gluten, Celery)",
        ca: "Caldo pollastre (Gluten, Api)",
    },
    {
        es: "Mostaza (Mostaza)",
        en: "Mustard (Mustard)",
        ca: "Mostassa (Mostassa)",
    },
    {
        es: "Mirin",
        en: "Mirin",
        ca: "Mirin",
    },
    {
        es: "Sriracha",
        en: "Sriracha",
        ca: "Sriracha",
    },
    {
        es: "Crema de cacahuetes (Cacahuetes)",
        en: "Peanut butter (Peanuts)",
        ca: "Crema de cacauets (Cacauets)",
    },
    {
        es: "Miel",
        en: "Honey",
        ca: "Mel",
    },
    {
        es: "Mayonesa (Huevos)",
        en: "Mayonnaise (Eggs)",
        ca: "Maionesa (Ous)",
    },
    {
        es: "Pesto (Lácteos, Frutos secos)",
        en: "Pesto (Dairy, Nuts)",
        ca: "Pesto (Lactis, Fruits secs)",
    },
    {
        es: "Curry rojo",
        en: "Red curry",
        ca: "Curri vermell",
    },
    {
        es: "Salsa de pescado (Pescado)",
        en: "Fish sauce (Fish)",
        ca: "Salsa de peix (Peix)",
    },
    {
        es: "Jerez",
        en: "Sherry",
        ca: "Jerez",
    },
    {
        es: "Ketchup (Apio)",
        en: "Ketchup (Celery)",
        ca: "Ketchup (Api)",
    },
    {
        es: "Salsa ponzu",
        en: "Salsa Ponzu",
        ca: "Salsa ponzu",
    },
    {
        es: "Salsa yakisoba (Soja, Gluten)",
        en: "Salsa Yakisoba (Soy, Gluten)",
        ca: "Salsa yakisoba (Soja, Gluten)",
    },
    {
        es: "Ketjap manis (Soja, Gluten)",
        en: "Ketjap Manis (Soy, Gluten)",
        ca: "Ketjap manis (Soja, Gluten)",
    },
    {
        es: "Pasta de gamba (Crustáceos)",
        en: "Gamba pasta (Crustaceans)",
        ca: "Pasta de gamba (Crustacis)",
    },
    {
        es: "Carne de ñoras",
        en: "Ñora paste",
        ca: "Carn de nyores",
    },
    {
        es: "Salsa Teriyaki (Soja, Gluten)",
        en: "Teriyaki sauce (Soy, Gluten)",
        ca: "Salsa Teriyaki (Soja, Gluten)",
    },
    {
        es: "Pasta de miso (Soja)",
        en: "Miso pasta (Soy)",
        ca: "Pasta de miso (Soja)",
    },
    {
        es: "Salsa hoisin (Gluten, Cacahuetes, Soja, Sésamo)",
        en: "Hoisin sauce (Gluten, Peanuts, Soy, Sesame)",
        ca: "Salsa hoisin (Gluten, Cacauets, Soja, Sèsam)",
    },
    {
        es: "Salsa Worcestershire (Gluten, Pescado)",
        en: "Worcestershire Sauce (Gluten, Fish)",
        ca: "Salsa Worcestershire (Gluten, Peix)",
    },
    {
        es: "Chimichurri",
        en: "Chimichurri",
        ca: "Chimichurri",
    },
    {
        es: "Salsa bbq (Mostaza, Apio)",
        en: "BBQ sauce (Mustard, celery)",
        ca: "Salsa barbacoa (Mostassa, Api)",
    },
    {
        es: "Harissa",
        en: "Harissa",
        ca: "Harissa",
    },
    {
        es: "Sirope de arce",
        en: "Arce Syrape",
        ca: "Xarop d'auró",
    },
    {
        es: "Wasabi",
        en: "Wasabi",
        ca: "Wasabi",
    },
    {
        es: "Salsa gochujang (Gluten)",
        en: "Gochujang sauce (Gluten)",
        ca: "Salsa gochujang (Gluten)",
    },
    {
        es: "Chipotle",
        en: "Chipotle",
        ca: "Chipotle",
    },
    {
        es: "Laurel",
        en: "Bay",
        ca: "Llorer",
    },
    {
        es: "Salsa sweet chili",
        en: "Sweet Chili sauce",
        ca: "Salsa sweet chili",
    },
    {
        es: "Mermelada de naranja",
        en: "Orange marmalade",
        ca: "Melmelada de taronja",
    },
    {
        es: "Chermoula",
        en: "Chermoula",
        ca: "Chermoula",
    },
    {
        es: "Vinagre de jerez",
        en: "Sherry vinager",
        ca: "Vinagre de xerès",
    },
    {
        es: "Salsa HP (Gluten)",
        en: "HP Sauce (Gluten)",
        ca: "Salsa HP (Gluten)",
    },
    {
        es: "Brandy",
        en: "Brandy",
        ca: "Brandy",
    },
    {
        es: "Pasta de dátil",
        en: "Date paste",
        ca: "Pasta de dàtil",
    },
    {
        es: "Sirope de dátil",
        en: "Date Syrape",
        ca: "Xarop de dàtil",
    },
    {
        es: "Sirope de agave",
        en: "Agave Syrape",
        ca: "Xarop d'atzavara",
    },
    {
        es: "Salsa Teriyaki sin gluten",
        en: "Gluten-free Teriyaki sauce",
        ca: "Salsa Teriyaki sense gluten",
    },
    {
        es: "Vinagre de vino tinto",
        en: "Red wine vinegar",
        ca: "Vinagre de vi negre",
    },
    {
        es: "Mayonesa vegana",
        en: "Vegan Mayonnaise",
        ca: "Maionesa vegana",
    },
    {
        es: "Extracto de vainilla",
        en: "Vanilla extract",
        ca: "Extracte de vainilla",
    },
    {
        es: "Curry amarillo",
        en: "Yellow curry",
        ca: "Curri groc",
    },
    {
        es: "Salsa hoisin sin gluten (Cacahuetes, Soja, Sésamo)",
        en: "Gluten-free hoisin sauce (Peanuts, Soy, Sesame)",
        ca: "Salsa hoisin sense gluten (Cacauets, Soja, Sèsam)",
    },
    {
        es: "Canela en rama",
        en: "Cinnamon stick",
        ca: "Canyella en branca",
    },
    {
        es: "Aceite de oliva",
        en: "Olive oil",
        ca: "Oli d'oliva",
    },
    {
        es: "Vinagre",
        en: "Vinegar",
        ca: "Vinagre",
    },
    {
        es: "Aceite de sésamo (Sésamo)",
        en: "Sesame oil (Sesame)",
        ca: "Oli de sèsam (Sèsam)",
    },
    {
        es: "Vinagre Blanco",
        en: "White vinegar",
        ca: "Vinagre Blanc",
    },
    {
        es: "Salsa de soja (Soja, Gluten, Sulfitos)",
        en: "Soy sauce (Soy, Gluten, Sulfites)",
        ca: "Salsa de soja (Soja, Gluten, Sulfits)",
    },
    {
        es: "Vinagre Balsámico",
        en: "Balsamic Vinegar",
        ca: "Vinagre Balsàmic",
    },
    {
        es: "Balsámico caramelizado",
        en: "Balsamic caramelized",
        ca: "Balsàmic caramelitzat",
    },
    {
        es: "Vinagre de arroz",
        en: "Rice vinegar",
        ca: "Vinagre d'arròs",
    },
    {
        es: "Vinagre de manzana",
        en: "Apple cider vinager",
        ca: "Vinagre de poma",
    },
    {
        es: "Balsámico blanco",
        en: "White balsamic",
        ca: "Balsàmic blanc",
    },
    {
        es: "Compota de manzana",
        en: "Applesauce",
        ca: "Compota de poma",
    },
    {
        es: "Vino blanco sauvignon blanc (Sulfitos)",
        en: "White wine Sauvignon Blanc (Sulfites)",
        ca: "Vi blanc sauvignon blanc (Sulfits)",
    },
    {
        es: "Vino blanco (Sulfitos)",
        en: "White wine (Sulfites)",
        ca: "Vi blanc (Sulfits)",
    },
    {
        es: "Tomate triturado",
        en: "Chopped tomato",
        ca: "Tomàquet triturat",
    },
    {
        es: "Salsa de soja sin gluten (Soja)",
        en: "Gluten-free soy sauce (Soy)",
        ca: "Salsa de soja sense gluten (Soja)",
    },
    {
        es: "Vino tinto (Sulfitos)",
        en: "Red wine (Sulfites)",
        ca: "Vi negre (Sulfits)",
    },
    {
        es: "Bebida de avena (Gluten)",
        en: "Oat drink (Gluten)",
        ca: "Beguda de civada (Gluten)",
    },
    {
        es: "Pasta de tomate",
        en: "Tomato paste",
        ca: "Pasta de tomàquet",
    },
    {
        es: "Pasta de tamarindo",
        en: "Tamarind paste",
        ca: "Pasta de tamarinde",
    },
    {
        es: "Seitán (Gluten)",
        en: "Seitan (Gluten)",
        ca: "Seitan (Gluten)",
    },
    {
        es: "Huevos (Huevos)",
        en: "Eggs (Eggs)",
        ca: "Ous (Ous)",
    },
    {
        es: "Tofu (Soja)",
        en: "Tofu (Soy)",
        ca: "Tofu (Soja)",
    },
    {
        es: "Tempeh (Soja)",
        en: "Tempeh (Soy)",
        ca: "Tempeh (Soja)",
    },
    {
        es: "Alga nori",
        en: "Nori seweed",
        ca: "Alga nori",
    },
    {
        es: "Tofu ahumado (Soja)",
        en: "Smoked Tofu (Soy)",
        ca: "Tofu fumat (Soja)",
    },
    {
        es: "Guindilla roja",
        en: "Red chilli",
        ca: "Bitxo vermell",
    },
    {
        es: "Tomate concentrado",
        en: "Concentrated tomato",
        ca: "Concentrat de tomàquet",
    },
    {
        es: "Heura (Soja)",
        en: "Heura (Soy)",
        ca: "Heura (Soja)",
    },
    { es: "Mix de especias", en: "Spice mix", ca: "Mix d'espècies" },
    { es: "Chirivia", en: "Parsnip", ca: "Xirivia" },
    { es: "Pollo campero", en: "Free-range chicken", ca: "Pollastre de pagès" },
    { es: "Pechuga de pavo", en: "Turkey breast fillet", ca: "Pit de gall dindi" },
    { es: "Pan de molde (Gluten)", en: "Bread (Gluten)", ca: "Pa de motlle (Gluten)" },
    { es: "Galletas digestive (Gluten)", en: "Digestive biscuits (Gluten)", ca: "Galetes digestive (Gluten)" },
    { es: "Galletas de jengibre (Gluten)", en: "Ginger bread (Gluten)", ca: "Galetes de gingebre (Gluten)" },
    { es: "Nata para montar (Lácteos)", en: "Wipping cream (Milk)", ca: "Nata per a muntar (Làctics)" },
    { es: "Dulce de leche (Lácteos)", en: "Dulce de leche (Milk)", ca: "Almívar de llet (Làctics)" },
    { es: "Queso brie (Lácteos)", en: "Brie cheese (Milk)", ca: "Formatge brie (Làctics)" },
    { es: "Chocolate negro", en: "Dark chocolate", ca: "Xocolata negra" },
    { es: "Carne de cerdo picada", en: "Minced pork", ca: "Carn de porc picada" },
    { es: "Jamón serrano", en: "Serrano ham", ca: "Pernil salat" },
    { es: "Placas de lasaña (Gluten)", en: "Lasagna sheets (Gluten)", ca: "Làmina de lasanya (Gluten)" },
    { es: "Salsa de tomate", en: "Tomatos sauce", ca: "Salsa de tomàquet" },
    { es: "Ciruelas pasas", en: "Prunes", ca: "Prunes panses" },
    { es: "Queso Gorgonzola (Lácteos)", en: "Gorgonzola cheese (Milk)", ca: "Formatge Gorgonzola (Làctics)" },
    { es: "Queso Emmental (Lácteos)", en: "Emmental cheese (Milk)", ca: "Formatge Emmental (Làctics)" },
    { es: "Kimchi", en: "Kimchi", ca: "Kimchi" },
    { es: "Huevos de codorniz (Huevo)", en: "Quail eggs (Eggs)", ca: "Ous de guatlla (Ous)" },
];

export const ingredientListEn: string[] = baseIngredients.map((ingredient) => ingredient.en);
export const ingredientListCa: string[] = baseIngredients.map((ingredient) => ingredient.ca);

export const getIngredients = (): Ingredient[] => {
    const ingredientListEs: string[] = baseIngredients.map((ingredient) => ingredient.es);

    return ingredientListEs.map((ing) => new Ingredient(ing));
};

export const saveIngredients = async () => {
    const domainIngredientsToSave = getIngredients();
    const ingredientEsMap: { [ingredientEsName: string]: string } = {};
    const ingredientMap: { [ingredientId: string]: Ingredient } = {};
    await mongooseIngredientRepository.bulkSave(domainIngredientsToSave);

    const savedIngredients = await mongooseIngredientRepository.findAll();

    for (let ingredient of savedIngredients) {
        ingredientEsMap[ingredient.name] = ingredient.id.toString();
        ingredientMap[ingredient.id.toString()] = ingredient;
    }

    for (let ingredient of baseIngredients) {
        const ingredientId = ingredientEsMap[ingredient.es];
        const domainIngredient = ingredientMap[ingredientId];

        domainIngredient.name = ingredient.en;
        await mongooseIngredientRepository.save(domainIngredient, Locale.en);
        domainIngredient.name = ingredient.ca;
        await mongooseIngredientRepository.save(domainIngredient, Locale.ca);
    }
};
