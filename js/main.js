var canvas = null
var ctx = null
var imgSize = 10
var currentLap = 0
var maxLaps = 3
var img_src = ['img/2.png']
var players = []

//#region Key Definitions
window.onkeydown = function(e) {
    if (e.keyCode == 37 && players[0] != undefined) {
        e.preventDefault()
        players[0].turnL = true
    }
    if (e.keyCode == 39 && players[0] != undefined) {
        e.preventDefault()
        players[0].turnR = true
    }
    if (e.keyCode == 65 && players[1] != undefined) {
        e.preventDefault()
        players[1].turnL = true
    }
    if (e.keyCode == 68 && players[1] != undefined) {
        e.preventDefault()
        players[1].turnR = true
    }
    if (e.keyCode == 74 && players[2] != undefined) {
        e.preventDefault()
        players[2].turnL = true
    }
    if (e.keyCode == 76 && players[2] != undefined) {
        e.preventDefault()
        players[2].turnR = true
    }
    if (e.keyCode == 100 && players[3] != undefined) {
        e.preventDefault()
        players[3].turnL = true
    }
    if (e.keyCode == 102 && players[3] != undefined) {
        e.preventDefault()
        players[3].turnR = true
    }
}
window.onkeyup = function(e) {
    if (e.keyCode == 37 && players[0] != undefined) {
        players[0].turnL = false
    }
    if (e.keyCode == 39 && players[0] != undefined) {
        players[0].turnR = false
    }
    if (e.keyCode == 65 && players[1] != undefined) {
        players[1].turnL = false
    }
    if (e.keyCode == 68 && players[1] != undefined) {
        players[1].turnR = false
    }
    if (e.keyCode == 74 && players[2] != undefined) {
        players[2].turnL = false
    }
    if (e.keyCode == 76 && players[2] != undefined) {
        players[2].turnR = false
    }
    if (e.keyCode == 100 && players[3] != undefined) {
        players[3].turnL = false
    }
    if (e.keyCode == 102 && players[3] != undefined) {
        players[3].turnR = false
    }
}
//#endregion

window.onload = function() {
    document.getElementById('pregame-start').onclick = function() {
        document.getElementById('pregame-controls').style.display = 'none'
        initGame(document.getElementById('pregame-player-count').value)
    }
}

function initGame(playerCount) {
    canvas = document.getElementById('canvas')
    canvas.style.display = 'block'
    ctx = canvas.getContext('2d')

    if (playerCount > 4) playerCount = 4

    for (let i = 0; i < playerCount; i++)
        createPlayer()
    
    drawMapInit()
    draw()
    window.alert('Naciśnij OK, żeby zacząć')
}

//#region Map Drawing
function drawMapInit() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2

    // Poza drogą
    ctx.fillStyle = '#55AA00'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    
    // Droga
    ctx.fillStyle = '#888888'
    ctx.beginPath()
    ctx.arc(canvas.height / 2, canvas.height / 2, canvas.height / 2 - 10, Math.PI / 2, 3 * Math.PI / 2)
    ctx.arc(canvas.width - canvas.height / 2, canvas.height / 2, canvas.height / 2 - 10, 3 * Math.PI / 2, Math.PI / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Środek
    ctx.fillStyle = '#55AA00'
    ctx.beginPath()
    ctx.arc(canvas.height / 2, canvas.height / 2, 170, Math.PI / 2, 3 * Math.PI / 2)
    ctx.arc(canvas.width - canvas.height / 2, canvas.height / 2, 170, 3 * Math.PI / 2, Math.PI / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Linia startu
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(canvas.width - canvas.height / 2, 3 * canvas.height / 4 - 9)
    ctx.lineTo(canvas.width - canvas.height / 2, canvas.height - 11)
    ctx.stroke()
}
function drawMap() {
    // Droga
    ctx.fillStyle = '#8888882E'
    ctx.beginPath()
    ctx.arc(canvas.height / 2, canvas.height / 2, canvas.height / 2 - 10, Math.PI / 2, 3 * Math.PI / 2)
    ctx.arc(canvas.width - canvas.height / 2, canvas.height / 2, canvas.height / 2 - 10, 3 * Math.PI / 2, Math.PI / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Środek
    ctx.fillStyle = '#55AA00'
    ctx.beginPath()
    ctx.arc(canvas.height / 2, canvas.height / 2, 170, Math.PI / 2, 3 * Math.PI / 2)
    ctx.arc(canvas.width - canvas.height / 2, canvas.height / 2, 170, 3 * Math.PI / 2, Math.PI / 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Linia startu
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(canvas.width - canvas.height / 2, 3 * canvas.height / 4 - 9)
    ctx.lineTo(canvas.width - canvas.height / 2, canvas.height - 11)
    ctx.stroke()
}
//#endregion

function draw() {
    drawMap()
    for (let i in players) {
        if (players[i].alive) {
            players[i].draw()

            if (players[i].turnL)
                players[i].updateVel(0.1)
            if (players[i].turnR)
                players[i].updateVel(-0.1)
            
            players[i].x += players[i].vx
            players[i].y += players[i].vy

            let dx = players[i].x - (canvas.width - canvas.height / 2);
            let dy = players[i].y - canvas.height / 2;
            let dist0 = Math.sqrt(dx * dx + dy * dy)

            dx = players[i].x - canvas.height / 2;
            dy = players[i].y - canvas.height / 2;
            let dist1 = Math.sqrt(dx * dx + dy * dy)

            if (players[i].x > 368 && players[i].x < 912) {
                if ( !( (players[i].y > 18 && players[i].y < 182) || (players[i].y > 538 && players[i].y < 702) ) ) {
                    players[i].alive = false
                    players[i].updateLapCounter()
                    if (players.length == 1) {
                        window.alert('Porażka\n\nNaciśnij OK, żeby zrestartować')
                        location.reload()
                    }
                    checkAlive()
                }
            } else {
                if ( !( (dist0 > 178 && dist0 < canvas.height / 2 - 18) || (dist1 > 178 && dist1 < canvas.height / 2 - 18) ) ) {
                    players[i].alive = false
                    players[i].updateLapCounter()
                    if (players.length == 1) {
                        window.alert('Porażka\n\nNaciśnij OK, żeby zrestartować')
                        location.reload()
                    }
                    checkAlive()
                }
            }

            if (players[i].x > 635 && players[i].x < 645 && players[i].doChecks) {
                players[i].holdChecks()
                if (players[i].check1) {
                    players[i].check3 = true
                    console.log('check3')
                } else {
                    players[i].check1 = true
                    console.log('check1')
                }
            }
            if (players[i].y > 355 && players[i].y < 375 && players[i].doChecks) {
                players[i].holdChecks()
                if (players[i].check0) {
                    players[i].check2 = true
                    console.log('check2')
                } else {
                    players[i].check0 = true
                    console.log('check0')
                }
            }
            if (players[i].x > 915 && players[i].x < 925) {
                if (players[i].check0 && players[i].check1 && players[i].check2 && players[i].check3) {
                    console.log('Meta')
                    players[i].check0 = false
                    players[i].check1 = false
                    players[i].check2 = false
                    players[i].check3 = false
                    players[i].lapCount += 1
                    if (players[i].lapCount > maxLaps) {
                        window.alert('Wygrał Player' + players[i].id)
                        location.reload()
                    } else {
                        players[i].updateLapCounter()
                    }
                }
            }
        }
    }

    window.requestAnimationFrame(draw)
}

function createPlayer() {
    let imgId = 0
    let velocity = 5
    let spawnX = 900
    let spawnY = 620
    document.getElementById('lap-counter-p' + players.length).style.display = 'block'

    var player = {
        id: players.length,
        alive: true,
        x: spawnX,
        y: spawnY,
        a: Math.PI / 2,
        doChecks: true,
        check0: true,
        check1: true,
        check2: true,
        check3: true,
        turnL: false,
        turnR: false,
        lapCount: 0,
        img: new Image(),
        updateVel: function (angle) {
            this.a += angle
            this.vx = velocity * Math.sin(this.a)
            this.vy = velocity * Math.cos(this.a)
        },
        holdChecks: function () {
            this.doChecks = false
            setTimeout( () => {this.doChecks = true}, 200)
        }
    }
    switch (players.length) {
        case 0:
            player.color = '#000000'
        break
        case 1:
            player.color = '#FF0000'
        break
        case 2:
            player.color = '#00FF00'
        break
        case 3:
            player.color = '#0000FF'
        break
        default:
            player.color = '#00000000'
    }
    player.draw = function() {
        ctx.fillStyle = player.color
        ctx.beginPath()
        ctx.arc(player.x, player.y, imgSize, 0, 2* Math.PI)
        ctx.fill()
    },
    player.updateLapCounter = function () {
        let lc = document.getElementById('lap-counter-p' + this.id)
        lc.style.color = this.color
        if (this.alive) {
            lc.innerHTML = 'Player ' + this.id + '<br>Lap: ' + this.lapCount + '/' + maxLaps
        } else {
            lc.innerHTML = 'Player ' + this.id + '<br>DEAD'
        }
    }
    player.vx = velocity * Math.sin(player.a)
    player.vy = velocity * Math.cos(player.a)
    player.img.src = img_src[imgId]

    player.updateLapCounter()
    players.push(player)
    player.draw()
}

function checkAlive() {
    let winnerId = -1
    let aliveCount = 0
    for (let i in players) {
        if (players[i].alive) {
            winnerId = players[i].id
            aliveCount += 1
        }
    }
    if (aliveCount == 1) {
        window.alert('Wygrał Player' + winnerId)
        location.reload()
    }
}