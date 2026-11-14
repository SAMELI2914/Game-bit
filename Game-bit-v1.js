// 0 = menu, 1 = Space Invaders, 2 = Flappy Bird, 3 = décompte / animation d'ouverture, 4 = Dino,
// 5 = Pong, 6 = Snake, 7 = sous-menu A, 8 = Tetris, 9 = Flèche, 10 = Geometry Dash, 11 = Simon,
// 12 = Labyrinthe, 13 = Plus ou moins, 14 = Stack, 15 = Pêche, 16 = Pierre-feuille-ciseaux,
// 17 = choix du mode du labyrinthe, 18 = menu de fin de partie,
// 19 = choix du mode d'Edge Surf, 20 = Edge Surf, 21 = veille
let mode = 3
let score = 0
let vies = 3
let infoFin = -1 // nombre à afficher après le visage triste (-1 = rien)
let dernierJeu = 0 // dernier jeu joué (pour rejouer)

// ---------- SON : muet / activé ----------
let son = true

function basculerSon() {
    if (son) {
        music.playTone(Note.C, 100)
        son = false
        music.setVolume(0)
    } else {
        son = true
        music.setVolume(128)
        music.playTone(Note.G, 100)
    }
}

// ---------- MODE VEILLE ----------
function mettreEnVeille() {
    mode = 21
    music.stopAllSounds()
    basic.clearScreen()
}

function reveiller() {
    mode = 0
    basic.clearScreen()
    music.playTone(Note.G, 80)
}

// ---------- ANIMATION D'OUVERTURE ----------
function animationOuverture() {
    mode = 3
    basic.clearScreen()
    // Le point du milieu, puis les voisins, jusqu'à remplir l'écran
    for (let r = 0; r <= 4; r++) {
        for (let y = 0; y <= 4; y++) {
            for (let x = 0; x <= 4; x++) {
                if (Math.abs(x - 2) + Math.abs(y - 2) <= r) {
                    led.plot(x, y)
                }
            }
        }
        music.playTone(262 + r * 80, 80)
        basic.pause(250)
    }
    basic.pause(500)
    basic.clearScreen()
    basic.pause(300)
    basic.showString("Game:bit")
    basic.clearScreen()
    basic.pause(200)
    mode = 0
}

// ---------- AFFICHAGE (tableau 5x5 redessiné à chaque image) ----------
let buf: boolean[] = []
for (let i = 0; i < 25; i++) {
    buf.push(false)
}
function effacer() {
    for (let i = 0; i < 25; i++) {
        buf[i] = false
    }
}
function pt(x: number, y: number) {
    if (x >= 0 && x <= 4 && y >= 0 && y <= 4) {
        buf[y * 5 + x] = true
    }
}

// Vrai si une partie est en cours (pas menu, décompte, sous-menus, fin de partie ou veille)
function enJeu(): boolean {
    return mode == 1 || mode == 2 || (mode >= 4 && mode <= 6) || (mode >= 8 && mode <= 16) || mode == 20
}

// Anti-rebond pour les jeux où un seul appui compte
let dernierAppui = 0
function antiRebond(): boolean {
    let n = control.millis()
    if (n - dernierAppui < 200) {
        return false
    }
    dernierAppui = n
    return true
}

// ---------- PAUSE : horloge de jeu ----------
let enPause = false
let pauseDebut = 0
let decalage = 0

// Horloge de jeu : elle s'arrête pendant la pause
function temps(): number {
    if (enPause) {
        return pauseDebut - decalage
    }
    return control.millis() - decalage
}

// ---------- SOUS-MENU ----------
// 0 Space Invaders, 1 Tetris, 2 Geometry Dash, 3 Flèche, 4 Simon, 5 Labyrinthe,
// 6 Plus ou moins, 7 Stack, 8 Pêche, 9 Pierre-feuille-ciseaux, 10 Edge Surf, 11 son, 12 veille
let sousChoix = 0

function afficherSous() {
    if (sousChoix == 0) {
        basic.showLeds(`
            . # . # .
            # # # # #
            # . # . #
            # # # # #
            . # . # .
            `)
    } else if (sousChoix == 1) {
        basic.showLeds(`
            . . . . .
            . # . . .
            . # # . .
            . # # # .
            # # # # #
            `)
    } else if (sousChoix == 2) {
        basic.showLeds(`
            . . . . .
            . . . . .
            # # . # .
            # # # # #
            . . . . .
            `)
    } else if (sousChoix == 3) {
        basic.showLeds(`
            . . # . .
            . . . # .
            # # # # #
            . . . # .
            . . # . .
            `)
    } else if (sousChoix == 4) {
        basic.showLeds(`
            # # . # #
            # # . # #
            . . . . .
            # # . # #
            # # . # #
            `)
    } else if (sousChoix == 5) {
        basic.showLeds(`
            # # # # #
            # . . . .
            # . # # #
            # . . . #
            # # # . #
            `)
    } else if (sousChoix == 6) {
        basic.showLeds(`
            . # # # .
            # . . . #
            . . # # .
            . . . . .
            . . # . .
            `)
    } else if (sousChoix == 7) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . # # # .
            # # # # .
            # # # # #
            `)
    } else if (sousChoix == 8) {
        basic.showLeds(`
            . . # . .
            . . # . .
            # # # # #
            . . # . .
            . . # . .
            `)
    } else if (sousChoix == 9) {
        basic.showIcon(IconNames.Scissors)
    } else if (sousChoix == 10) {
        // Edge Surf : points qui descendent
        basic.showLeds(`
            . . # . .
            . . . . .
            # . . . #
            . . . . .
            . . # . .
            `)
    } else if (sousChoix == 12) {
        // Veille : une lune
        basic.showLeds(`
            . # # . .
            # # . . .
            # # . . .
            # # . . .
            . # # . .
            `)
    } else if (son) {
        basic.showIcon(IconNames.EigthNote)
    } else {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    }
}

// ---------- VARIABLES SPACE INVADERS ----------
let ex: number[] = []
let ey: number[] = []
let px = 2
let tx = 0
let ty = -1
let direction = 1
let vague = 1
let nextInv = 0
let nextTir = 0

// ---------- VARIABLES FLAPPY BIRD ----------
let by = 2
let pipeX = 4
let trou = 0
let nextGrav = 0
let nextPipe = 0

// ---------- VARIABLES DINO ----------
let jt = 0
let cacX: number[] = []
let cacH: number[] = []
let gapDino = 6
let nextCac = 0

// ---------- VARIABLES PONG ----------
let ppx = 1
let pbx = 2
let pby = 0
let pdx = 1
let pdy = 1
let nextBall = 0

// ---------- VARIABLES SNAKE ----------
let sx: number[] = []
let sy: number[] = []
let sd = 1          // 0 = haut, 1 = droite, 2 = bas, 3 = gauche
let snd = 1         // direction demandée
let aTourne = false // un seul virage par déplacement
let ax = 0
let ay = 0
let nextSnake = 0
let dirX = [0, 1, 0, -1]
let dirY = [-1, 0, 1, 0]

// ---------- VARIABLES TETRIS ----------
let tb: boolean[] = []
for (let i = 0; i < 25; i++) {
    tb.push(false)
}
let tcx: number[] = []
let tcy: number[] = []
let tpx = 0
let tpy = 0
let nextTet = 0
// 4 pièces : domino, ligne de 3, coin de 3, carré
let piecesX = [[0, 1], [0, 1, 2], [0, 0, 1], [0, 1, 0, 1]]
let piecesY = [[0, 0], [0, 0, 0], [0, 1, 1], [0, 0, 1, 1]]

// ---------- VARIABLES FLÈCHE ----------
let rTarget = 0      // 0 = A, 1 = B, 2 = A+B
let rShown = false
let rNext = 0
let rDeadline = 0
let rLimit = 1500

// ---------- VARIABLES GEOMETRY DASH ----------
let gjt = 0
let gx: number[] = []
let gk: number[] = []   // 0 = pique, 1 = trou dans le sol
let gGap = 4
let nextGD = 0

// ---------- VARIABLES SIMON ----------
let seq: number[] = []
let simPhase = 0     // 0 = la carte joue la suite, 1 = c'est à toi
let simIdx = 0
let simLit = false
let simNext = 0
let simK = 0
let simUntil = 0

// ---------- VARIABLES LABYRINTHE ----------
let mazes = [
    ["..#..", "#.#.#", ".....", ".###.", "...#."],
    [".#...", ".#.#.", "...#.", "##.#.", "...#."],
    ["...#.", "##.#.", ".....", ".####", "....."],
    ["..#..", ".###.", "...#.", "##.#.", "....."],
    [".#...", "...#.", "##.#.", "...#.", ".###."]
]
let mw: boolean[] = []
for (let i = 0; i < 25; i++) {
    mw.push(false)
}
let mx = 0
let my = 0
let mexX = 4
let mexY = 4
let mCtl = 0          // 0 = boutons, 1 = inclinaison
let mDir = 1
let mDeadline = 0
let mTick = -1
let mNext = 0
let invY = 1          // mets -1 si l'inclinaison avant/arrière est inversée

// ---------- VARIABLES PLUS OU MOINS ----------
let sec = 1
let guess = 13
let essais = 0
let pPhase = 0        // 0 = tu choisis, 1 = indice affiché, 2 = gagné, 3 = perdu
let pHaut = false
let pUntil = 0
let holdT = 0
let repT = 0

// ---------- VARIABLES STACK ----------
let st: boolean[] = []
for (let i = 0; i < 25; i++) {
    st.push(false)
}
let stCy = 4
let stBx = 0
let stBw = 3
let stBd = 1
let stPx = 0
let stPw = 0
let stFirst = true
let nextStack = 0

// ---------- VARIABLES PÊCHE ----------
let fc = 0
let fd = 1
let fz = 0
let fzh = 2
let nextFish = 0

// ---------- VARIABLES PIERRE-FEUILLE-CISEAUX ----------
let pfcChoix = -1
let pfcPret = false
let pfcBusy = false

// ---------- VARIABLES EDGE SURF ----------
let es: number[] = []   // 25 cases : 0 = vide, 1 = obstacle, 2 = bonus
for (let i = 0; i < 25; i++) {
    es.push(0)
}
let esx = 2             // colonne du joueur (il est toujours sur la ligne du bas)
let esDir = 0           // -1 = gauche, 0 = tout droit, 1 = droite (inclinaison)
let esCtl = 0           // 0 = boutons, 1 = inclinaison
let esStep = 0
let esNextMove = 0
let esNextScroll = 0

// ---------- PAUSE : fonctions ----------
function basculerPause() {
    if (!enPause) {
        // Pas de pause pendant la révélation de Pierre-feuille-ciseaux
        if (mode == 16 && (pfcChoix >= 0 || pfcBusy)) {
            return
        }
        pauseDebut = control.millis()
        enPause = true
        music.stopAllSounds()
        basic.showLeds(`
            . # . # .
            . # . # .
            . # . # .
            . # . # .
            . # . # .
            `)
    } else {
        decalage += control.millis() - pauseDebut
        enPause = false
        pfcPret = false
    }
}

// Pendant la pause, B quitte la partie et retourne au menu
function quitterPartie() {
    decalage += control.millis() - pauseDebut
    enPause = false
    mode = 0
    basic.clearScreen()
}

// ---------- DÉCOMPTE ----------
function decompte() {
    for (let i = 3; i >= 1; i--) {
        basic.showNumber(i)
        music.playTone(Note.C, 150)
        basic.pause(700)
    }
    basic.showIcon(IconNames.Yes)
    music.playTone(Note.C5, 300)
    basic.pause(300)
    basic.clearScreen()
    effacer()
}

// ---------- FIN DE PARTIE ----------
function finPartie() {
    if (!enJeu()) {
        return
    }
    dernierJeu = mode
    mode = -1
    ex = []
    ey = []
    cacX = []
    cacH = []
    sx = []
    sy = []
    gx = []
    gk = []
    ty = -1
    music.stopAllSounds()
    music.playTone(Note.C, 400)
    basic.showIcon(IconNames.Sad)
    basic.pause(1000)
    if (infoFin >= 0) {
        basic.showNumber(infoFin)
        basic.pause(800)
        infoFin = -1
    }
    basic.showNumber(score)
    basic.pause(1500)
    basic.clearScreen()
    // Menu de fin de partie : A = menu principal, B = rejouer
    mode = 18
}

// ---------- VICTOIRE ----------
function victoire() {
    if (!enJeu()) {
        return
    }
    dernierJeu = mode
    mode = -1
    music.playTone(Note.C5, 150)
    music.playTone(Note.E5, 150)
    music.playTone(Note.G5, 300)
    basic.showIcon(IconNames.Happy)
    basic.pause(1000)
    basic.showNumber(score)
    basic.pause(1500)
    basic.clearScreen()
    mode = 18
}

// ---------- SPACE INVADERS ----------
function creerVague() {
    ex = []
    ey = []
    direction = 1
    ty = -1
    // Les invaders commencent à la ligne 1 : la ligne 0 est réservée aux vies
    for (let x = 0; x <= 2; x++) {
        ex.push(x)
        ey.push(1)
    }
    // À partir de la vague 3 : une 2e rangée
    if (vague >= 3) {
        for (let x = 0; x <= 2; x++) {
            ex.push(x)
            ey.push(2)
        }
    }
}

function verifierTir() {
    if (ty < 0) {
        return
    }
    for (let i = ex.length - 1; i >= 0; i--) {
        if (ex[i] == tx && ey[i] == ty) {
            ex.removeAt(i)
            ey.removeAt(i)
            ty = -1
            score += 1
            music.playTone(Note.G, 100)
            break
        }
    }
    if (ex.length == 0 && mode == 1) {
        vague += 1
        music.playTone(Note.E5, 200)
        creerVague()
    }
}

function lancerInvaders() {
    mode = 3
    score = 0
    vies = 3
    vague = 1
    px = 2
    ty = -1
    decompte()
    creerVague()
    nextInv = temps() + 700
    nextTir = temps()
    mode = 1
}

// ---------- FLAPPY BIRD ----------
function nouveauTuyau() {
    pipeX = 4
    trou = randint(0, 2)
}

function verifierFlappy() {
    if (mode != 2) {
        return
    }
    if (by >= 4) {
        finPartie()
        return
    }
    if (pipeX == 1 && by != trou && by != trou + 1) {
        finPartie()
    }
}

function lancerFlappy() {
    mode = 3
    score = 0
    by = 2
    decompte()
    nouveauTuyau()
    nextGrav = temps() + 600
    nextPipe = temps() + 700
    mode = 2
}

// ---------- CHROME DINO (version facile) ----------
function dinoY(): number {
    if (jt > 13) {
        return 3
    } else if (jt > 2) {
        return 2
    } else if (jt > 0) {
        return 3
    }
    return 4
}

function lancerDino() {
    mode = 3
    score = 0
    jt = 0
    cacX = []
    cacH = []
    gapDino = 6
    decompte()
    nextCac = temps() + 600
    mode = 4
}

function verifierDino() {
    let y = dinoY()
    for (let i = 0; i < cacX.length; i++) {
        // Le dino est en x = 1. Un cactus de hauteur h occupe les lignes 5-h à 4
        if (cacX[i] == 1 && y >= 5 - cacH[i]) {
            finPartie()
            return
        }
    }
}

// ---------- PONG (version normale) ----------
function lancerPong() {
    mode = 3
    score = 0
    ppx = 1
    pbx = randint(0, 4)
    pby = 0
    pdx = randint(0, 1) * 2 - 1
    pdy = 1
    decompte()
    nextBall = temps() + 500
    mode = 5
}

// ---------- SNAKE ----------
function placerPomme() {
    let ok = false
    while (!ok) {
        ax = randint(0, 4)
        ay = randint(0, 4)
        ok = true
        for (let i = 0; i < sx.length; i++) {
            if (sx[i] == ax && sy[i] == ay) {
                ok = false
            }
        }
    }
}

function lancerSnake() {
    mode = 3
    score = 0
    sx = [2, 1, 0]
    sy = [2, 2, 2]
    sd = 1
    snd = 1
    aTourne = false
    decompte()
    placerPomme()
    nextSnake = temps() + 600
    mode = 6
}

// ---------- TETRIS ----------
function tetCollision(nx: number, ny: number, cx: number[], cy: number[]): boolean {
    for (let i = 0; i < cx.length; i++) {
        let x = nx + cx[i]
        let y = ny + cy[i]
        if (x < 0 || x > 4 || y > 4) {
            return true
        }
        if (y >= 0 && tb[y * 5 + x]) {
            return true
        }
    }
    return false
}

function nouvellePiece() {
    let k = randint(0, 3)
    tcx = []
    tcy = []
    let w = 0
    for (let i = 0; i < piecesX[k].length; i++) {
        tcx.push(piecesX[k][i])
        tcy.push(piecesY[k][i])
        w = Math.max(w, piecesX[k][i] + 1)
    }
    tpx = Math.idiv(5 - w, 2)
    tpy = 0
    if (tetCollision(tpx, tpy, tcx, tcy)) {
        finPartie()
    }
}

function effacerLignes() {
    let y = 4
    while (y >= 0) {
        let pleine = true
        for (let x = 0; x <= 4; x++) {
            if (!tb[y * 5 + x]) {
                pleine = false
            }
        }
        if (pleine) {
            for (let r = y; r >= 1; r--) {
                for (let x = 0; x <= 4; x++) {
                    tb[r * 5 + x] = tb[(r - 1) * 5 + x]
                }
            }
            for (let x = 0; x <= 4; x++) {
                tb[x] = false
            }
            score += 5
            music.playTone(Note.E5, 150)
        } else {
            y += -1
        }
    }
}

function fixerPiece() {
    for (let i = 0; i < tcx.length; i++) {
        tb[(tpy + tcy[i]) * 5 + tpx + tcx[i]] = true
    }
    score += 1
    music.playTone(Note.G, 60)
    effacerLignes()
    nouvellePiece()
}

function tourner() {
    let rx: number[] = []
    let ry: number[] = []
    let minX = 99
    let minY = 99
    for (let i = 0; i < tcx.length; i++) {
        let nx = 0 - tcy[i]
        let ny = tcx[i]
        rx.push(nx)
        ry.push(ny)
        minX = Math.min(minX, nx)
        minY = Math.min(minY, ny)
    }
    for (let i = 0; i < rx.length; i++) {
        rx[i] = rx[i] - minX
        ry[i] = ry[i] - minY
    }
    let decalages = [0, -1, -2, 1]
    for (let d of decalages) {
        if (!tetCollision(tpx + d, tpy, rx, ry)) {
            tcx = rx
            tcy = ry
            tpx += d
            return
        }
    }
}

function lancerTetris() {
    mode = 3
    score = 0
    for (let i = 0; i < 25; i++) {
        tb[i] = false
    }
    decompte()
    nouvellePiece()
    nextTet = temps() + 700
    mode = 8
}

// ---------- FLÈCHE (réflexes) ----------
function dessinerFleche(k: number) {
    if (k == 2) {
        // Flèche vers le haut = A+B
        let ux = [2, 1, 2, 3, 0, 2, 4, 2, 2]
        let uy = [0, 1, 1, 1, 2, 2, 2, 3, 4]
        for (let i = 0; i < ux.length; i++) {
            pt(ux[i], uy[i])
        }
    } else {
        let fx = [2, 1, 0, 1, 2, 3, 4, 1, 2]
        let fy = [0, 1, 2, 2, 2, 2, 2, 3, 4]
        for (let i = 0; i < fx.length; i++) {
            if (k == 0) {
                // Flèche vers la gauche = A
                pt(fx[i], fy[i])
            } else {
                // Flèche vers la droite = B
                pt(4 - fx[i], fy[i])
            }
        }
    }
}

function lancerFleche() {
    mode = 3
    score = 0
    rLimit = 1500
    rShown = false
    decompte()
    rNext = temps() + 800
    mode = 9
}

function repondre(k: number) {
    if (mode != 9 || !rShown) {
        return
    }
    if (k == rTarget) {
        score += 1
        rShown = false
        rLimit = Math.max(450, rLimit - 50)
        rNext = temps() + randint(400, 1000)
        music.playTone(Note.G, 40)
    } else if (rTarget == 2) {
        // A+B demandé : A ou B pressé juste avant l'autre, on attend
    } else {
        finPartie()
    }
}

// ---------- GEOMETRY DASH ----------
function gdY(): number {
    if (gjt > 12) {
        return 2
    } else if (gjt > 2) {
        return 1
    } else if (gjt > 0) {
        return 2
    }
    return 3
}

function lancerGD() {
    mode = 3
    score = 0
    gjt = 0
    gx = []
    gk = []
    gGap = 4
    decompte()
    nextGD = temps() + 300
    mode = 10
}

function verifierGD() {
    let y = gdY()
    for (let i = 0; i < gx.length; i++) {
        // Pique ou trou en x = 1 alors que le cube est au sol
        if (gx[i] == 1 && y == 3) {
            finPartie()
            return
        }
    }
}

// ---------- SIMON ----------
function notePad(k: number): number {
    if (k == 0) {
        return Note.C
    } else if (k == 1) {
        return Note.E
    }
    return Note.G
}

function dessinerPad(k: number) {
    for (let y = 0; y <= 4; y++) {
        if (k == 0) {
            pt(0, y)
            pt(1, y)
        } else if (k == 1) {
            pt(3, y)
            pt(4, y)
        } else {
            pt(2, y)
        }
    }
}

function lancerSimon() {
    mode = 3
    score = 0
    seq = [randint(0, 2)]
    simPhase = 0
    simIdx = 0
    simLit = false
    simK = 0
    simUntil = 0
    decompte()
    simNext = temps() + 600
    mode = 11
}

function repondreSimon(k: number) {
    if (mode != 11 || simPhase != 1) {
        return
    }
    // A+B demandé : un A ou B isolé juste avant est ignoré
    if (seq[simIdx] == 2 && k != 2) {
        return
    }
    simK = k
    simUntil = temps() + 250
    if (k == seq[simIdx]) {
        music.playTone(notePad(k), 120)
        simIdx += 1
        if (simIdx >= seq.length) {
            score += 1
            seq.push(randint(0, 2))
            simPhase = 0
            simIdx = 0
            simLit = false
            simNext = temps() + 900
        }
    } else {
        finPartie()
    }
}

// ---------- LABYRINTHE ----------
function afficherLab() {
    if (mCtl == 0) {
        // Boutons
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # . . . #
            `)
    } else {
        // Inclinaison
        basic.showLeds(`
            . . . . #
            . . . # .
            . . # . .
            . # . . .
            # . . . .
            `)
    }
}

function chargerMaze() {
    let k = randint(0, mazes.length - 1)
    let fx = randint(0, 1)
    let fy = randint(0, 1)
    for (let y = 0; y <= 4; y++) {
        for (let x = 0; x <= 4; x++) {
            let sx2 = x
            let sy2 = y
            if (fx == 1) {
                sx2 = 4 - x
            }
            if (fy == 1) {
                sy2 = 4 - y
            }
            mw[y * 5 + x] = mazes[k][sy2].charAt(sx2) == "#"
        }
    }
    mx = fx * 4
    my = fy * 4
    mexX = 4 - mx
    mexY = 4 - my
}

function bougerMaze(dx: number, dy: number) {
    let nx = mx + dx
    let ny = my + dy
    if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
        return
    }
    if (mw[ny * 5 + nx]) {
        return
    }
    mx = nx
    my = ny
    if (mx == mexX && my == mexY) {
        score += 1
        music.playTone(Note.E5, 150)
        mDeadline += 10000
        chargerMaze()
    }
}

function lancerMaze() {
    mode = 3
    score = 0
    mDir = 1
    mTick = -1
    mNext = 0
    chargerMaze()
    decompte()
    mDeadline = temps() + 30000
    mode = 12
}

// ---------- PLUS OU MOINS ----------
function dessinerFlecheV(haut: boolean) {
    let ux = [2, 1, 2, 3, 0, 2, 4, 2, 2]
    let uy = [0, 1, 1, 1, 2, 2, 2, 3, 4]
    for (let i = 0; i < ux.length; i++) {
        if (haut) {
            pt(ux[i], uy[i])
        } else {
            pt(ux[i], 4 - uy[i])
        }
    }
}

function lancerPOM() {
    mode = 3
    score = 0
    sec = randint(1, 25)
    guess = 13
    essais = 0
    pPhase = 0
    holdT = 0
    repT = 0
    decompte()
    mode = 13
}

function validerPOM() {
    if (mode != 13 || pPhase != 0) {
        return
    }
    essais += 1
    if (guess == sec) {
        pPhase = 2
        return
    }
    pHaut = sec > guess
    pPhase = 1
    pUntil = temps() + 900
    music.playTone(Note.A, 60)
}

// ---------- STACK ----------
function nouvelleBarre() {
    if (randint(0, 1) == 0) {
        stBx = 0
        stBd = 1
    } else {
        stBx = 5 - stBw
        stBd = -1
    }
}

function lancerStack() {
    mode = 3
    score = 0
    for (let i = 0; i < 25; i++) {
        st[i] = false
    }
    stCy = 4
    stBw = 3
    stFirst = true
    stPx = 0
    stPw = 0
    nouvelleBarre()
    decompte()
    nextStack = temps() + 400
    mode = 14
}

function poserStack() {
    if (mode != 14 || !antiRebond()) {
        return
    }
    let lo = stBx
    let hi = stBx + stBw - 1
    if (!stFirst) {
        lo = Math.max(stBx, stPx)
        hi = Math.min(stBx + stBw - 1, stPx + stPw - 1)
    }
    if (hi < lo) {
        finPartie()
        return
    }
    for (let x = lo; x <= hi; x++) {
        st[stCy * 5 + x] = true
    }
    stFirst = false
    stPx = lo
    stPw = hi - lo + 1
    stBw = stPw
    score += 1
    music.playTone(Note.G, 60)
    if (stCy > 0) {
        stCy += -1
    } else {
        // Tout en haut : la tour descend d'un cran
        for (let r = 4; r >= 1; r--) {
            for (let x = 0; x <= 4; x++) {
                st[r * 5 + x] = st[(r - 1) * 5 + x]
            }
        }
        for (let x = 0; x <= 4; x++) {
            st[x] = false
        }
    }
    nouvelleBarre()
}

// ---------- PÊCHE ----------
function nouvelleZone() {
    fzh = 2
    if (score >= 5) {
        fzh = 1
    }
    fz = randint(0, 5 - fzh)
}

function lancerPeche() {
    mode = 3
    score = 0
    fc = 0
    fd = 1
    nouvelleZone()
    decompte()
    nextFish = temps() + 300
    mode = 15
}

function attraperPeche() {
    if (mode != 15 || !antiRebond()) {
        return
    }
    if (fc >= fz && fc <= fz + fzh - 1) {
        score += 1
        music.playTone(Note.G, 80)
        nouvelleZone()
    } else {
        finPartie()
    }
}

// ---------- PIERRE-FEUILLE-CISEAUX ----------
function afficherPFC(k: number) {
    if (k == 0) {
        // Pierre
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . . . . .
            `)
    } else if (k == 1) {
        // Feuille
        basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else {
        // Ciseaux
        basic.showIcon(IconNames.Scissors)
    }
}

function lancerPFC() {
    mode = 3
    score = 0
    pfcChoix = -1
    pfcPret = false
    pfcBusy = false
    decompte()
    mode = 16
}

function jouerPFC(k: number) {
    if (mode == 16 && pfcChoix < 0 && !pfcBusy) {
        pfcChoix = k
    }
}

// ---------- EDGE SURF ----------
// Choix du mode : 2 points en bas = boutons, diagonale = inclinaison
function afficherES() {
    if (esCtl == 0) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # . . . #
            `)
    } else {
        basic.showLeds(`
            . . . . #
            . . . # .
            . . # . .
            . # . . .
            # . . . .
            `)
    }
}

// Fait descendre tout d'un cran et crée une nouvelle ligne une fois sur deux
function defilerES() {
    for (let r = 4; r >= 1; r--) {
        for (let x = 0; x <= 4; x++) {
            es[r * 5 + x] = es[(r - 1) * 5 + x]
        }
    }
    for (let x = 0; x <= 4; x++) {
        es[x] = 0
    }
    esStep += 1
    // Une ligne vide entre chaque ligne d'obstacles : il y a toujours le temps de passer
    if (esStep % 2 == 0) {
        let n = randint(1, 2)
        if (score >= 10) {
            n = randint(2, 3)
        }
        let poses = 0
        while (poses < n) {
            let x = randint(0, 4)
            if (es[x] == 0) {
                es[x] = 1
                poses += 1
            }
        }
        // Un bonus une fois sur deux, dans une case libre
        if (randint(0, 1) == 0) {
            let place = false
            while (!place) {
                let x2 = randint(0, 4)
                if (es[x2] == 0) {
                    es[x2] = 2
                    place = true
                }
            }
        }
    }
}

// Regarde ce qu'il y a sous le joueur
function verifierES() {
    let c = es[20 + esx]
    if (c == 1) {
        finPartie()
    } else if (c == 2) {
        es[20 + esx] = 0
        score += 1
        music.playTone(Note.G, 80)
    }
}

function lancerES() {
    mode = 3
    score = 0
    for (let i = 0; i < 25; i++) {
        es[i] = 0
    }
    esx = 2
    esDir = 0
    esStep = 0
    decompte()
    esNextMove = temps() + 300
    esNextScroll = temps() + 700
    mode = 20
}

// ---------- REJOUER (menu de fin de partie) ----------
function rejouer() {
    if (dernierJeu == 1) {
        lancerInvaders()
    } else if (dernierJeu == 2) {
        lancerFlappy()
    } else if (dernierJeu == 4) {
        lancerDino()
    } else if (dernierJeu == 5) {
        lancerPong()
    } else if (dernierJeu == 6) {
        lancerSnake()
    } else if (dernierJeu == 8) {
        lancerTetris()
    } else if (dernierJeu == 9) {
        lancerFleche()
    } else if (dernierJeu == 10) {
        lancerGD()
    } else if (dernierJeu == 11) {
        lancerSimon()
    } else if (dernierJeu == 12) {
        // Garde le mode choisi (boutons ou inclinaison)
        lancerMaze()
    } else if (dernierJeu == 13) {
        lancerPOM()
    } else if (dernierJeu == 14) {
        lancerStack()
    } else if (dernierJeu == 15) {
        lancerPeche()
    } else if (dernierJeu == 16) {
        lancerPFC()
    } else if (dernierJeu == 20) {
        // Garde le mode choisi (boutons ou inclinaison)
        lancerES()
    } else {
        mode = 0
    }
}

// ---------- BOUTONS ----------
input.onButtonPressed(Button.A, function () {
    if (mode == 21) {
        reveiller()
        return
    }
    if (enPause) {
        basculerSon()
        return
    }
    if (mode == 18) {
        // Retour au menu principal
        mode = 0
        basic.clearScreen()
        return
    }
    if (mode == 0) {
        // Ouvre le sous-menu
        mode = 7
        sousChoix = 0
        afficherSous()
    } else if (mode == 7) {
        // Option suivante
        sousChoix = (sousChoix + 1) % 13
        afficherSous()
    } else if (mode == 17) {
        mCtl = 1 - mCtl
        afficherLab()
    } else if (mode == 19) {
        esCtl = 1 - esCtl
        afficherES()
    } else if (mode == 1) {
        px = Math.max(0, px - 1)
    } else if (mode == 2) {
        by = Math.max(0, by - 1)
        verifierFlappy()
    } else if (mode == 4) {
        if (jt == 0) {
            jt = 15
        }
    } else if (mode == 5) {
        ppx = Math.max(0, ppx - 1)
    } else if (mode == 6) {
        if (!aTourne) {
            snd = (sd + 3) % 4
            aTourne = true
        }
    } else if (mode == 8) {
        if (!tetCollision(tpx - 1, tpy, tcx, tcy)) {
            tpx += -1
        }
    } else if (mode == 9) {
        repondre(0)
    } else if (mode == 10) {
        if (gjt == 0) {
            gjt = 15
        }
    } else if (mode == 11) {
        repondreSimon(0)
    } else if (mode == 12) {
        if (mCtl == 0) {
            mDir = (mDir + 1) % 4
        }
    } else if (mode == 13) {
        if (pPhase == 0) {
            guess = Math.max(1, guess - 1)
            holdT = temps()
        }
    } else if (mode == 14) {
        poserStack()
    } else if (mode == 15) {
        attraperPeche()
    } else if (mode == 16) {
        jouerPFC(0)
    } else if (mode == 20) {
        if (esCtl == 0) {
            esx = Math.max(0, esx - 1)
            verifierES()
        }
    }
})

input.onButtonPressed(Button.B, function () {
    if (mode == 21) {
        reveiller()
        return
    }
    if (enPause) {
        quitterPartie()
        return
    }
    if (mode == 18) {
        // Rejouer le même jeu
        rejouer()
        return
    }
    if (mode == 0) {
        lancerFlappy()
    } else if (mode == 7) {
        // Valide l'option choisie
        if (sousChoix == 0) {
            lancerInvaders()
        } else if (sousChoix == 1) {
            lancerTetris()
        } else if (sousChoix == 2) {
            lancerGD()
        } else if (sousChoix == 3) {
            lancerFleche()
        } else if (sousChoix == 4) {
            lancerSimon()
        } else if (sousChoix == 5) {
            // Choix du mode de jeu du labyrinthe
            mode = 17
            mCtl = 0
            afficherLab()
        } else if (sousChoix == 6) {
            lancerPOM()
        } else if (sousChoix == 7) {
            lancerStack()
        } else if (sousChoix == 8) {
            lancerPeche()
        } else if (sousChoix == 9) {
            lancerPFC()
        } else if (sousChoix == 10) {
            // Choix du mode de jeu d'Edge Surf
            mode = 19
            esCtl = 0
            afficherES()
        } else if (sousChoix == 11) {
            basculerSon()
            afficherSous()
        } else {
            mettreEnVeille()
        }
    } else if (mode == 17) {
        lancerMaze()
    } else if (mode == 19) {
        lancerES()
    } else if (mode == 1) {
        px = Math.min(4, px + 1)
    } else if (mode == 2) {
        by = Math.max(0, by - 1)
        verifierFlappy()
    } else if (mode == 4) {
        if (jt == 0) {
            jt = 15
        }
    } else if (mode == 5) {
        ppx = Math.min(3, ppx + 1)
    } else if (mode == 6) {
        if (!aTourne) {
            snd = (sd + 1) % 4
            aTourne = true
        }
    } else if (mode == 8) {
        if (!tetCollision(tpx + 1, tpy, tcx, tcy)) {
            tpx += 1
        }
    } else if (mode == 9) {
        repondre(1)
    } else if (mode == 10) {
        if (gjt == 0) {
            gjt = 15
        }
    } else if (mode == 11) {
        repondreSimon(1)
    } else if (mode == 12) {
        if (mCtl == 0) {
            bougerMaze(dirX[mDir], dirY[mDir])
        }
    } else if (mode == 13) {
        if (pPhase == 0) {
            guess = Math.min(25, guess + 1)
            holdT = temps()
        }
    } else if (mode == 14) {
        poserStack()
    } else if (mode == 15) {
        attraperPeche()
    } else if (mode == 16) {
        jouerPFC(1)
    } else if (mode == 20) {
        if (esCtl == 0) {
            esx = Math.min(4, esx + 1)
            verifierES()
        }
    }
})

// A+B : Snake depuis le menu, puis action selon le jeu
input.onButtonPressed(Button.AB, function () {
    if (mode == 21) {
        reveiller()
        return
    }
    if (enPause) {
        return
    }
    if (mode == 0) {
        lancerSnake()
    } else if (mode == 1 && ty < 0) {
        tx = px
        ty = 3
        verifierTir()
    } else if (mode == 8) {
        tourner()
    } else if (mode == 9) {
        repondre(2)
    } else if (mode == 10) {
        if (gjt == 0) {
            gjt = 15
        }
    } else if (mode == 11) {
        repondreSimon(2)
    } else if (mode == 12) {
        if (mCtl == 0) {
            mDir = (mDir + 3) % 4
        }
    } else if (mode == 13) {
        validerPOM()
    } else if (mode == 14) {
        poserStack()
    } else if (mode == 15) {
        attraperPeche()
    } else if (mode == 16) {
        jouerPFC(2)
    }
})

// Logo tactile : Dino depuis le menu, retour dans les sous-menus, pause pendant le jeu
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (mode == 21) {
        reveiller()
        return
    }
    if (mode == 0) {
        lancerDino()
    } else if (mode == 7) {
        mode = 0
    } else if (mode == 17 || mode == 19) {
        mode = 7
        afficherSous()
    } else if (enJeu()) {
        basculerPause()
    }
})

// Secouer : lancer Pong depuis le menu, ou réveiller la carte
input.onGesture(Gesture.Shake, function () {
    if (mode == 21) {
        reveiller()
        return
    }
    if (mode == 0) {
        lancerPong()
    }
})

// ---------- MENU ----------
basic.forever(function () {
    if (mode == 7) {
        afficherSous()
    }
    if (mode == 17) {
        afficherLab()
    }
    if (mode == 19) {
        afficherES()
    }
    if (mode == 18) {
        // Menu de fin : A (menu principal), maison, B (rejouer), flèche circulaire
        basic.showLeds(`
            . # # # .
            # . . . #
            # # # # #
            # . . . #
            # . . . #
            `)
        basic.pause(700)
        if (mode == 18) {
            basic.showIcon(IconNames.House)
            basic.pause(700)
        }
        if (mode == 18) {
            basic.showLeds(`
                # # # # .
                # . . . #
                # # # # .
                # . . . #
                # # # # .
                `)
            basic.pause(700)
        }
        if (mode == 18) {
            basic.showLeds(`
                . # # # .
                # . . . #
                # . . # #
                # . . . .
                . # # # .
                `)
            basic.pause(700)
        }
    }
    if (mode == 0) {
        basic.showLeds(`
            . # # # .
            # . . . #
            # # # # #
            # . . . #
            # . . . #
            `)
        basic.pause(700)
    }
    if (mode == 0) {
        basic.showLeds(`
            # # # # .
            # . . . #
            # # # # .
            # . . . #
            # # # # .
            `)
        basic.pause(700)
    }
    if (mode == 0) {
        // Forme du logo (Dino)
        basic.showLeds(`
            . # # # .
            # . . . #
            # . # . #
            # . . . #
            . # # # .
            `)
        basic.pause(700)
    }
    if (mode == 0) {
        // Forme de la secousse (Pong)
        basic.showLeds(`
            . . . . .
            # . . . #
            . # . # .
            . . # . .
            . . . . .
            `)
        basic.pause(700)
    }
    if (mode == 0) {
        // Forme du serpent (A+B)
        basic.showLeds(`
            # # # . .
            . . # . .
            . . # # #
            . . . . #
            . . . . .
            `)
        basic.pause(700)
    }
    if (mode != 0 && mode != 18) {
        basic.pause(100)
    }
})

// ---------- AFFICHAGE : redessine toutes les LED ----------
basic.forever(function () {
    if (enJeu() && mode != 16 && !enPause) {
        for (let y = 0; y <= 4; y++) {
            for (let x = 0; x <= 4; x++) {
                if (buf[y * 5 + x]) {
                    led.plot(x, y)
                } else {
                    led.unplot(x, y)
                }
            }
        }
    }
    basic.pause(30)
})

// ---------- BOUCLE DE JEU UNIQUE ----------
basic.forever(function () {
    basic.pause(50)
    if (enPause) {
        return
    }
    let now = temps()

    if (mode == 1) {
        // Déplacement du tir (les invaders sont à partir de la ligne 1)
        if (ty >= 0 && now >= nextTir) {
            nextTir = now + 100
            ty += -1
            if (ty < 1) {
                ty = -1
            } else {
                verifierTir()
            }
        }
        // Déplacement des invaders
        if (mode == 1 && now >= nextInv) {
            nextInv = now + Math.max(200, 700 - score * 20)
            let minX = 4
            let maxX = 0
            for (let i = 0; i < ex.length; i++) {
                minX = Math.min(minX, ex[i])
                maxX = Math.max(maxX, ex[i])
            }
            if ((direction == 1 && maxX == 4) || (direction == -1 && minX == 0)) {
                direction = -direction
                for (let i = 0; i < ey.length; i++) {
                    ey[i] += 1
                }
            } else {
                for (let i = 0; i < ex.length; i++) {
                    ex[i] += direction
                }
            }
            verifierTir()
            let basAtteint = false
            for (let i = 0; i < ey.length; i++) {
                if (ey[i] >= 4) {
                    basAtteint = true
                }
            }
            if (basAtteint) {
                vies += -1
                music.playTone(Note.C, 150)
                if (vies <= 0) {
                    finPartie()
                    return
                }
                creerVague()
            }
        }
        // Dessin + vies qui clignotent en haut à gauche
        if (mode == 1) {
            effacer()
            pt(px, 4)
            for (let i = 0; i < ex.length; i++) {
                pt(ex[i], ey[i])
            }
            if (ty >= 0) {
                pt(tx, ty)
            }
            if (Math.idiv(now, 300) % 2 == 0) {
                for (let i = 0; i < vies; i++) {
                    pt(i, 0)
                }
            }
        }
    } else if (mode == 2) {
        // Gravité
        if (now >= nextGrav) {
            nextGrav = now + 600
            by += 1
            verifierFlappy()
        }
        // Tuyaux
        if (mode == 2 && now >= nextPipe) {
            nextPipe = now + Math.max(250, 700 - score * 20)
            pipeX += -1
            if (pipeX < 0) {
                score += 1
                music.playTone(Note.G, 100)
                nouveauTuyau()
            }
            verifierFlappy()
        }
        // Dessin
        if (mode == 2) {
            effacer()
            pt(1, by)
            for (let y = 0; y <= 4; y++) {
                if (y != trou && y != trou + 1) {
                    pt(pipeX, y)
                }
            }
        }
    } else if (mode == 4) {
        // Saut
        if (jt > 0) {
            jt += -1
        }
        // Avance des cactus (lente, avec un bip quand un cactus approche)
        let alerte = false
        if (now >= nextCac) {
            nextCac = now + Math.max(200, 350 - score * 5)
            for (let i = cacX.length - 1; i >= 0; i--) {
                cacX[i] += -1
                if (cacX[i] == 3) {
                    alerte = true
                }
                if (cacX[i] < 0) {
                    cacX.removeAt(i)
                    cacH.removeAt(i)
                    score += 1
                }
            }
            gapDino += -1
            if (gapDino <= 0) {
                let h = 1
                if (randint(0, 2) == 0) {
                    h = 2
                }
                cacX.push(4)
                cacH.push(h)
                gapDino = randint(7, 9)
            }
        }
        verifierDino()
        if (mode != 4) {
            return
        }
        // Dessin
        effacer()
        pt(1, dinoY())
        for (let i = 0; i < cacX.length; i++) {
            for (let k = 0; k < cacH[i]; k++) {
                pt(cacX[i], 4 - k)
            }
        }
        if (alerte) {
            music.playTone(Note.A, 60)
        }
    } else if (mode == 5) {
        // Déplacement de la balle
        if (now >= nextBall) {
            nextBall = now + Math.max(150, 450 - score * 15)
            let nx = pbx + pdx
            // Rebond sur les murs gauche/droite
            if (nx < 0 || nx > 4) {
                pdx = -pdx
                nx = pbx + pdx
            }
            let ny = pby + pdy
            // Rebond sur le plafond
            if (ny < 0) {
                pdy = 1
                ny = pby + pdy
            }
            // Arrivée sur la ligne de la raquette
            if (ny >= 4) {
                if (nx == ppx || nx == ppx + 1) {
                    // Raquette touchée : la balle repart vers le haut
                    pdy = -1
                    ny = pby + pdy
                    if (nx == ppx) {
                        pdx = -1
                    } else {
                        pdx = 1
                    }
                    score += 1
                    music.playTone(Note.G, 100)
                } else {
                    pbx = nx
                    pby = ny
                    finPartie()
                    return
                }
            }
            pbx = nx
            pby = ny
        }
        // Dessin
        if (mode == 5) {
            effacer()
            pt(ppx, 4)
            pt(ppx + 1, 4)
            pt(pbx, pby)
        }
    } else if (mode == 6) {
        // Déplacement du serpent
        if (now >= nextSnake) {
            nextSnake = now + Math.max(250, 600 - score * 20)
            sd = snd
            aTourne = false
            let nx = (sx[0] + dirX[sd] + 5) % 5
            let ny = (sy[0] + dirY[sd] + 5) % 5
            let mange = (nx == ax && ny == ay)
            let limite = sx.length - 1
            if (mange) {
                limite = sx.length
            }
            for (let i = 0; i < limite; i++) {
                if (sx[i] == nx && sy[i] == ny) {
                    finPartie()
                    return
                }
            }
            sx.unshift(nx)
            sy.unshift(ny)
            if (mange) {
                score += 1
                music.playTone(Note.G, 100)
                if (sx.length >= 25) {
                    music.playTone(Note.C5, 400)
                    finPartie()
                    return
                }
                placerPomme()
            } else {
                sx.pop()
                sy.pop()
            }
        }
        // Dessin (la pomme clignote)
        if (mode == 6) {
            effacer()
            for (let i = 0; i < sx.length; i++) {
                pt(sx[i], sy[i])
            }
            if (Math.idiv(now, 200) % 2 == 0) {
                pt(ax, ay)
            }
        }
    } else if (mode == 8) {
        // Chute de la pièce
        if (now >= nextTet) {
            nextTet = now + Math.max(250, 700 - score * 8)
            if (!tetCollision(tpx, tpy + 1, tcx, tcy)) {
                tpy += 1
            } else {
                fixerPiece()
                if (mode != 8) {
                    return
                }
            }
        }
        // Dessin : blocs posés + pièce en cours
        if (mode == 8) {
            effacer()
            for (let i = 0; i < 25; i++) {
                if (tb[i]) {
                    buf[i] = true
                }
            }
            for (let i = 0; i < tcx.length; i++) {
                pt(tpx + tcx[i], tpy + tcy[i])
            }
        }
    } else if (mode == 9) {
        // Affiche une flèche après une attente aléatoire
        if (!rShown && now >= rNext) {
            rTarget = randint(0, 2)
            rShown = true
            rDeadline = now + rLimit
        } else if (rShown && now >= rDeadline) {
            // Trop lent
            finPartie()
            return
        }
        if (mode == 9) {
            effacer()
            if (rShown) {
                dessinerFleche(rTarget)
            }
        }
    } else if (mode == 10) {
        // Saut
        if (gjt > 0) {
            gjt += -1
        }
        // Avance des obstacles
        if (now >= nextGD) {
            nextGD = now + Math.max(110, 220 - score * 4)
            for (let i = gx.length - 1; i >= 0; i--) {
                gx[i] += -1
                if (gx[i] < 0) {
                    gx.removeAt(i)
                    gk.removeAt(i)
                    score += 1
                }
            }
            gGap += -1
            if (gGap <= 0) {
                let k = randint(0, 1)
                gx.push(4)
                gk.push(k)
                if (randint(0, 3) == 0) {
                    // Obstacle double
                    gx.push(5)
                    gk.push(k)
                    gGap = randint(6, 9)
                } else {
                    gGap = randint(5, 8)
                }
            }
        }
        verifierGD()
        if (mode != 10) {
            return
        }
        // Dessin : sol (avec trous), piques, cube
        effacer()
        for (let x = 0; x <= 4; x++) {
            let trouIci = false
            for (let i = 0; i < gx.length; i++) {
                if (gx[i] == x && gk[i] == 1) {
                    trouIci = true
                }
            }
            if (!trouIci) {
                pt(x, 4)
            }
        }
        for (let i = 0; i < gx.length; i++) {
            if (gk[i] == 0) {
                pt(gx[i], 3)
            }
        }
        pt(1, gdY())
    } else if (mode == 11) {
        // SIMON : la carte joue la suite
        if (simPhase == 0 && now >= simNext) {
            if (simLit) {
                simLit = false
                music.stopAllSounds()
                simIdx += 1
                simNext = now + 200
                if (simIdx >= seq.length) {
                    simPhase = 1
                    simIdx = 0
                }
            } else {
                simLit = true
                music.ringTone(notePad(seq[simIdx]))
                simNext = now + Math.max(250, 500 - seq.length * 20)
            }
        }
        if (mode == 11) {
            effacer()
            if (simPhase == 0 && simLit) {
                dessinerPad(seq[simIdx])
            }
            if (simPhase == 1 && now < simUntil) {
                dessinerPad(simK)
            }
        }
    } else if (mode == 12) {
        // LABYRINTHE : temps écoulé ?
        if (now >= mDeadline) {
            finPartie()
            return
        }
        // Bips pendant les 5 dernières secondes
        let reste = mDeadline - now
        if (reste < 5000 && Math.idiv(reste, 1000) != mTick) {
            mTick = Math.idiv(reste, 1000)
            music.playTone(Note.A, 30)
        }
        // Mode inclinaison
        if (mCtl == 1 && now >= mNext) {
            let ax2 = input.acceleration(Dimension.X)
            let ay2 = input.acceleration(Dimension.Y) * invY
            if (Math.abs(ax2) > 350 || Math.abs(ay2) > 350) {
                mNext = now + 280
                if (Math.abs(ax2) > Math.abs(ay2)) {
                    if (ax2 > 0) {
                        bougerMaze(1, 0)
                    } else {
                        bougerMaze(-1, 0)
                    }
                } else {
                    if (ay2 > 0) {
                        bougerMaze(0, 1)
                    } else {
                        bougerMaze(0, -1)
                    }
                }
            }
        }
        // Dessin : murs fixes, sortie lente, joueur rapide
        if (mode == 12) {
            effacer()
            for (let i = 0; i < 25; i++) {
                if (mw[i]) {
                    buf[i] = true
                }
            }
            if (Math.idiv(now, 600) % 2 == 0) {
                pt(mexX, mexY)
            }
            if (mCtl == 0) {
                // Case visée : clignote très vite (allumée = libre, éteinte = mur)
                let tx2 = mx + dirX[mDir]
                let ty2 = my + dirY[mDir]
                if (tx2 >= 0 && tx2 <= 4 && ty2 >= 0 && ty2 <= 4) {
                    if (Math.idiv(now, 100) % 2 == 0) {
                        buf[ty2 * 5 + tx2] = !buf[ty2 * 5 + tx2]
                    }
                }
            }
            if (Math.idiv(now, 200) % 2 == 0) {
                pt(mx, my)
            }
        }
    } else if (mode == 13) {
        // PLUS OU MOINS
        if (pPhase == 0) {
            // Répétition automatique si on maintient A ou B
            if (now - holdT > 500 && now >= repT) {
                if (input.buttonIsPressed(Button.A) && !input.buttonIsPressed(Button.B)) {
                    guess = Math.max(1, guess - 1)
                    repT = now + 120
                } else if (input.buttonIsPressed(Button.B) && !input.buttonIsPressed(Button.A)) {
                    guess = Math.min(25, guess + 1)
                    repT = now + 120
                }
            }
            effacer()
            if (Math.idiv(now, 300) % 3 != 0) {
                pt((guess - 1) % 5, Math.idiv(guess - 1, 5))
            }
        } else if (pPhase == 1) {
            if (now >= pUntil) {
                if (essais >= 6) {
                    // Perdu : on montre le nombre secret
                    infoFin = sec
                    pPhase = 3
                    finPartie()
                    return
                }
                pPhase = 0
            } else {
                effacer()
                dessinerFlecheV(pHaut)
            }
        } else if (pPhase == 2) {
            score = 7 - essais
            victoire()
            return
        }
    } else if (mode == 14) {
        // STACK : la barre fait des allers-retours
        if (now >= nextStack) {
            nextStack = now + Math.max(90, 320 - score * 8)
            let nx = stBx + stBd
            if (nx < 0 || nx + stBw - 1 > 4) {
                stBd = -stBd
                nx = stBx + stBd
            }
            stBx = nx
        }
        if (mode == 14) {
            effacer()
            for (let i = 0; i < 25; i++) {
                if (st[i]) {
                    buf[i] = true
                }
            }
            for (let k = 0; k < stBw; k++) {
                pt(stBx + k, stCy)
            }
        }
    } else if (mode == 15) {
        // PÊCHE : le curseur monte et descend
        if (now >= nextFish) {
            nextFish = now + Math.max(60, 200 - score * 8)
            let nf = fc + fd
            if (nf < 0 || nf > 4) {
                fd = -fd
                nf = fc + fd
            }
            fc = nf
        }
        if (mode == 15) {
            effacer()
            for (let y = fz; y <= fz + fzh - 1; y++) {
                pt(1, y)
                pt(3, y)
            }
            pt(2, fc)
        }
    } else if (mode == 16) {
        // PIERRE-FEUILLE-CISEAUX
        if (pfcChoix < 0) {
            if (!pfcPret) {
                pfcPret = true
                basic.showLeds(`
                    . # # # .
                    # . . . #
                    . . # # .
                    . . . . .
                    . . # . .
                    `)
            }
        } else {
            pfcBusy = true
            let j = pfcChoix
            let m = randint(0, 2)
            afficherPFC(j)
            basic.pause(600)
            afficherPFC(m)
            basic.pause(900)
            let r = (j - m + 3) % 3
            if (r == 1) {
                // Gagné
                score += 1
                music.playTone(Note.E5, 120)
                music.playTone(Note.G5, 200)
                basic.showIcon(IconNames.Happy)
                basic.pause(800)
            } else if (r == 0) {
                // Égalité : on rejoue
                basic.showLeds(`
                    . . . . .
                    # # # # #
                    . . . . .
                    # # # # #
                    . . . . .
                    `)
                basic.pause(800)
            } else {
                pfcChoix = -1
                pfcBusy = false
                finPartie()
                return
            }
            pfcChoix = -1
            pfcPret = false
            pfcBusy = false
        }
    } else if (mode == 20) {
        // EDGE SURF : en inclinaison, la direction suit l'inclinaison de la carte
        if (esCtl == 1) {
            let esAcc = input.acceleration(Dimension.X)
            if (esAcc > 300) {
                esDir = 1
            } else if (esAcc < -300) {
                esDir = -1
            } else {
                esDir = 0
            }
            // Le joueur glisse d'une case dans sa direction
            if (now >= esNextMove) {
                esNextMove = now + 300
                esx = Math.max(0, Math.min(4, esx + esDir))
                verifierES()
                if (mode != 20) {
                    return
                }
            }
        }
        // Les points descendent (de plus en plus vite)
        if (now >= esNextScroll) {
            esNextScroll = now + Math.max(280, 650 - score * 12)
            defilerES()
            verifierES()
            if (mode != 20) {
                return
            }
        }
        // Dessin : obstacles fixes, bonus lents, joueur rapide
        if (mode == 20) {
            effacer()
            for (let i = 0; i < 25; i++) {
                if (es[i] == 1) {
                    buf[i] = true
                } else if (es[i] == 2 && Math.idiv(now, 700) % 2 == 0) {
                    buf[i] = true
                }
            }
            if (Math.idiv(now, 100) % 2 == 0) {
                pt(esx, 4)
            }
        }
    }
})

// ---------- DÉMARRAGE : animation d'ouverture ----------
animationOuverture()
