# Winter is coming !


### But du jeu :

- Les aliens venus de Pluton veulent attraper tous les moutons de la terre pour récupérer de la laine et ainsi se préparer à l’hiver rude qui les attends.
Les terriens ne se laisse pas faire et ripostent à l’aide de missiles car ils veulent sauver leurs moutons et conserver leurs laines.

### Disposition des écrans :

- Ecran doit (JS) :
Déplacement du curseur de haut en bas et de droite à gauche
On voit les moutons vus du haut ->GoogleEarth

-	Ecran gauche (Flash) :
Soucoupe volante fixe et les moutons arrivent au niveau de la soucoupe en fonction des déplacements du radar.
Mise en place d’un système de paralaxe pour le décor afin de simuler une notion de déplacement.
Avec la touche espace enfoncée, la soucoupe s’abaisse pour aspirer le mouton. La touche espace relâchée, la soucoupe remonte à sa position initiale. 
Il faut éviter les missiles pour que la soucoupe n’explose pas.

### Règles : 

*	Différents niveaux
*	Un nombre fixe de moutons sur la terre
*	Temps imparti. De plus en plus réduit 
*	Une quantité de moutons à attraper. De plus en plus grand
*	Des téléporteurs pour envoyer les moutons sur Pluton
*	La soucoupe supporte un nombre maximum de mouton. Elle s’alourdi avec le poids des moutons et devient de plus en plus lente
*	La soucoupe s’écrase si elle s’approche trop près du sol
*	Lorsque la soucoupe est touchée par un missile, plusieurs possibilités : 
*	Si la soucoupe est vide : elle explose (missile rouge)
*	Si la soucoupe possède des moutons : les moutons  se dispersent sur la terre (missile bleu)
*	Possibilité d’écouter la radio dans le cockpit
*	Les moutons attrapés en plus à la fin d’un niveau restent capturés au niveau suivant

### Score : 

-	Un mouton téléporté = 10 points
-	Temps restant => 1sec = 1 point
-	Rocket => -5 points par moutons attrapés

### GamePlay : 

- Flèche du clavier : déplacement de la soucoupe (x et y)
Espace : Faire monter la soucoupe. La gravité la fait redescendre.
 
##### Interface écran de droite :

-	temps imparti
-	Nombre de moutons à attraper 
-	Nombre de moutons attrapés
-	Score
-	Poids de la soucoupe
-	Hauteur de la soucoupe 
