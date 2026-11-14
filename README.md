🎮 Game:bit

Une console de jeux rétro pour micro:bit V2 : 16 jeux, un menu, une animation de démarrage et un mode veille, le tout sur l’écran 5×5 de la carte.

Programmé en MakeCode (JavaScript), dans un seul fichier.

📋 Sommaire
Matériel requis
Installation
Menu principal
Sous-menu A
Les jeux
Pause
Fin de partie
Son et veille
Réglages
Structure du code
Limites connues
🔧 Matériel requis
Une micro:bit V2 (le logo tactile, le haut-parleur et le micro n’existent que sur la V2)
Un câble USB, ou un boîtier de piles pour jouer en autonomie
Aucun autre composant

⚠️ Sur une micro:bit V1, le logo tactile n’existe pas : le Dino, la pause et le retour dans les sous-menus ne seront pas accessibles.

🚀 Installation
Ouvre makecode.microbit.org et crée un nouveau projet.
Passe en mode JavaScript (bouton en haut de l’éditeur).
Remplace tout le contenu par le code de main.ts.
Clique sur Télécharger et copie le fichier .hex sur ta micro:bit (elle apparaît comme une clé USB).

Au démarrage, une animation s’affiche : le point du milieu s’allume, puis ses voisins jusqu’à remplir l’écran, qui s’éteint avant d’afficher Game:bit.

🏠 Menu principal

L’écran alterne entre plusieurs images. Chaque geste lance un jeu ou ouvre le sous-menu.

Geste	Action
A	Ouvre le sous-menu
B	Flappy Bird
Logo tactile	Chrome Dino
Secouer	Pong
A+B	Snake
📂 Sous-menu A
Touche	Action
A	Option suivante
B	Valider
Logo	Retour au menu principal

Les 13 options, dans l’ordre : Space Invaders, Tetris, Geometry Dash, Flèche, Simon, Labyrinthe, Plus ou moins, Stack, Pêche, Pierre-feuille-ciseaux, Edge Surf, Son, Veille.

🕹️ Les jeux
Jeu	A	B	A+B
Space Invaders	Gauche	Droite	Tirer
Flappy Bird	Monter	Monter	—
Chrome Dino	Sauter	Sauter	—
Pong	Raquette à gauche	Raquette à droite	—
Snake	Tourner à gauche	Tourner à droite	—
Tetris	Pièce à gauche	Pièce à droite	Rotation
Geometry Dash	Sauter	Sauter	Sauter
Flèche	←	→	↑
Simon	Pavé gauche	Pavé droit	Colonne centrale
Plus ou moins	Nombre −1	Nombre +1	Valider
Stack	Poser la barre	Poser la barre	Poser la barre
Pêche	Attraper	Attraper	Attraper
Pierre-feuille-ciseaux	Pierre	Feuille	Ciseaux
Labyrinthe	voir ci-dessous	voir ci-dessous	voir ci-dessous
Edge Surf	Case à gauche	Case à droite	—
Détails par jeu
Space Invaders : plusieurs invaders avancent en groupe. À partir de la vague 3, une deuxième rangée apparaît. Tes vies clignotent en haut à gauche (une LED par vie).
Flappy Bird : passe dans l’ouverture des tuyaux. Toucher un tuyau ou le sol met fin à la partie.
Chrome Dino : version facile. Un bip retentit quand un cactus approche.
Pong : raquette de 2 LED. Selon la LED qui touche la balle, elle repart à gauche ou à droite.
Snake : le serpent traverse les bords de l’écran. Il faut éviter de se mordre. Remplir l’écran = victoire.
Tetris : grille 5×5 avec 4 pièces (domino, ligne de 3, coin, carré). Une ligne complète rapporte 5 points.
Geometry Dash : saute par-dessus les piques et les trous du sol.
Flèche : une flèche apparaît, appuie sur le bon bouton avant la fin du délai. Le délai diminue à chaque réussite.
Simon : reproduis la suite de pavés lumineux et sonores.
Plus ou moins : devine un nombre de 1 à 25 en 6 essais. Le nombre est affiché sous forme de point (lecture ligne par ligne). Une flèche vers le haut veut dire « plus », vers le bas « moins ». Maintiens A ou B pour accélérer.
Stack : empile les barres. Seule la partie qui chevauche la rangée du dessous est conservée.
Pêche : appuie quand le curseur est entre les deux repères.
Pierre-feuille-ciseaux : contre la carte. Victoire = 1 point, égalité = on rejoue, défaite = fin.
Labyrinthe

Après validation, un écran te fait choisir le mode : A change de mode, B valide, logo revient.

2 points en bas = mode boutons
diagonale = mode inclinaison

À l’écran : les points fixes sont les murs, un point clignotant moyennement vite c’est toi, un point clignotant lentement est la sortie.

Mode boutons : A tourne la direction visée vers la droite, A+B vers la gauche, B avance. La case visée clignote très vite.
Mode inclinaison : incline la carte dans la direction voulue.

Tu as 30 s au départ, chaque sortie atteinte donne +1 point et +10 s.

Edge Surf

Même choix de mode que le Labyrinthe (boutons ou inclinaison).

Toi : le point qui clignote vite, en bas de l’écran
Obstacles : les points fixes (les toucher = fin de partie)
Bonus : les points qui clignotent lentement (+1 point)
Mode boutons : A déplace d’une case à gauche, B d’une case à droite
Mode inclinaison : incline la carte pour glisser, remets-la à plat pour t’arrêter
⏸️ Pause

Disponible dans tous les jeux (sauf pendant le décompte et la révélation des choix de Pierre-feuille-ciseaux). Tous les chronomètres sont gelés.

Geste	Action
Logo	Pause / reprise
A (en pause)	Coupe ou remet le son
B (en pause)	Quitte la partie
🔁 Fin de partie

Après le visage triste (ou content) et le score, un menu alterne entre quatre images :

Touche	Action
A (écran : A, puis maison)	Retour au menu principal
B (écran : B, puis flèche circulaire)	Rejouer le même jeu
🔊 Son et veille
Son : option « note de musique » du sous-menu A (la croix indique que le son est coupé). On peut aussi le couper en pause avec A.
Veille : option « lune » du sous-menu A. L’écran s’éteint. A, B, A+B, le logo ou une secousse réveillent la carte (le premier geste ne fait que réveiller).
⚙️ Réglages

Quelques valeurs à modifier dans le code pour ajuster la difficulté :

Jeu	Valeur	Effet
Dino	350 dans Math.max(200, 350 - score * 5)	Vitesse des cactus
Pong	450 dans Math.max(150, 450 - score * 15)	Vitesse de la balle
Stack	320 dans Math.max(90, 320 - score * 8)	Vitesse de la barre
Pêche	200 dans Math.max(60, 200 - score * 8)	Vitesse du curseur
Geometry Dash	220 dans Math.max(110, 220 - score * 4)	Vitesse des obstacles
Flèche	rLimit = 1500	Délai de réponse initial (ms)
Labyrinthe	30000 / += 10000	Temps de départ / bonus (ms)
Labyrinthe	invY = -1	Inverse l’inclinaison avant/arrière
Edge Surf	300 (inclinaison)	Sensibilité de l’inclinaison
Animation	basic.pause(250)	Vitesse de l’animation d’ouverture
🧱 Structure du code

Tout est dans un seul fichier, organisé autour d’une machine à états : la variable mode indique l’écran courant.

mode	État
0	Menu principal
1	Space Invaders
2	Flappy Bird
3	Décompte / animation d’ouverture
4	Dino
5	Pong
6	Snake
7	Sous-menu A
8	Tetris
9	Flèche
10	Geometry Dash
11	Simon
12	Labyrinthe
13	Plus ou moins
14	Stack
15	Pêche
16	Pierre-feuille-ciseaux
17	Choix du mode du Labyrinthe
18	Menu de fin de partie
19	Choix du mode d’Edge Surf
20	Edge Surf
21	Veille

Principes de conception :

Pas de sprites MakeCode : l’écran est un tableau 5×5 (buf) redessiné en entier à chaque image, ce qui évite les pixels « fantômes ».
Une seule boucle de jeu : tous les jeux partagent la même boucle basic.forever, pilotée par mode.
Horloge de jeu : la fonction temps() remplace control.millis() et s’arrête pendant la pause.
Gestionnaires uniques : chaque bouton a un seul gestionnaire qui dépend de mode.
Ajouter un jeu
Réserve un numéro de mode et ajoute les variables du jeu.
Écris une fonction lancerMonJeu() : mode = 3, score = 0, decompte(), initialisation, puis mode = <ton numéro>.
Ajoute un bloc else if (mode == <ton numéro>) dans la boucle de jeu unique (logique + dessin dans buf).
Ajoute les actions des boutons dans les gestionnaires A, B et A+B.
Ajoute le numéro dans enJeu(), dans rejouer() et une entrée dans le sous-menu (afficherSous(), validation avec B, modulo de A).
Appelle finPartie() pour terminer la partie.
⚠️ Limites connues
Le code n’a pas été testé sur toutes les cartes : en cas d’erreur de compilation dans MakeCode, ouvre une issue.
L’écran des jeux est en tout ou rien : les LED ne sont pas atténuées, donc les « points faibles » sont représentés par un clignotement lent.
Dans le menu principal, A+B doit être pressé presque en même temps, sinon la carte peut lancer le Flappy Bird ou ouvrir le sous-menu.
Le logo tactile peut se déclencher par accident pendant une partie (cela met en pause).
📄 Licence : MIT

À ajouter selon ton choix (par exemple MIT).

Fait avec une micro:bit, 25 LED et beaucoup de patience. 🕹️
