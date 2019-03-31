var canvas = null
var ctx = null
var imgSize = 20
var currentLap = 0
var maxLaps = 3
var img_src = ['img/2.png']
var players = []
var p0Key = 'ArrowLeft'
var p1Key = 'KeyA'
var p2Key = 'KeyF'
var p3Key = 'KeyJ'

var pat = new Image()
pat.src = 'img/pat_grass.jpg'
var pat_grass = null

let gameOver = false
let winner = null

//#region Key Definitions
window.onkeydown = function(e) {
    //e.stopPropagation()
    if (e.code == p0Key && players[0] != undefined) {
        e.preventDefault()
        players[0].turnL = true
    }
    if (e.code == p1Key && players[1] != undefined) {
        e.preventDefault()
        players[1].turnL = true
    }
    if (e.code == p2Key && players[2] != undefined) {
        e.preventDefault()
        players[2].turnL = true
    }
    if (e.code == p3Key && players[3] != undefined) {
        e.preventDefault()
        players[3].turnL = true
    }
}
window.onkeyup = function(e) {
    //e.stopPropagation()
    if (e.code == p0Key && players[0] != undefined) {
        players[0].turnL = false
    }
    if (e.code == p1Key && players[1] != undefined) {
        players[1].turnL = false
    }
    if (e.code == p2Key && players[2] != undefined) {
        players[2].turnL = false
    }
    if (e.code == p3Key && players[3] != undefined) {
        players[3].turnL = false
    }
}
//#endregion

window.onload = function() {
    document.getElementById('pregame-start').onclick = function() {
        document.getElementById('pregame-controls').style.display = 'none'
        maxLaps = document.getElementById('pregame-lap-count').value
        initGame(document.getElementById('pregame-player-count').value)
    }

    let key0 = document.getElementById('pregame-p0Key')
    let key1 = document.getElementById('pregame-p1Key')
    let key2 = document.getElementById('pregame-p2Key')
    let key3 = document.getElementById('pregame-p3Key')
    let keyAlert = document.getElementById('pregame-alert')

    key0.innerHTML = 'Player 0 Key: ' + p0Key
    key1.innerHTML = 'Player 1 Key: ' + p1Key
    key2.innerHTML = 'Player 2 Key: ' + p2Key
    key3.innerHTML = 'Player 3 Key: ' + p3Key

    key0.listen = false
    key1.listen = false
    key2.listen = false
    key3.listen = false

    key0.onfocus = function () { this.blur() }
    key1.onfocus = function () { this.blur() }
    key2.onfocus = function () { this.blur() }
    key3.onfocus = function () { this.blur() }

    key0.onclick = function() {
        key0.innerHTML = 'Player 0 Key: [Press Any Key]'
        key0.listen = true
        key1.listen = false
        key2.listen = false
        key3.listen = false

        keyAlert.innerHTML = 'Press Esc to cancel'
        setTimeout(function() { keyAlert.innerHTML = '' }, 1000)
    }
    key1.onclick = function() {
        key1.innerHTML = 'Player 1 Key: [Press Any Key]'
        key0.listen = false
        key1.listen = true
        key2.listen = false
        key3.listen = false

        keyAlert.innerHTML = 'Press Esc to cancel'
        setTimeout(function() { keyAlert.innerHTML = '' }, 1000)
    }
    key2.onclick = function() {
        key2.innerHTML = 'Player 2 Key: [Press Any Key]'
        key0.listen = false
        key1.listen = false
        key2.listen = true
        key3.listen = false

        keyAlert.innerHTML = 'Press Esc to cancel'
        setTimeout(function() { keyAlert.innerHTML = '' }, 1000)
    }   
    key3.onclick = function() {
        key3.innerHTML = 'Player 3 Key: [Press Any Key]'
        key0.listen = false
        key1.listen = false
        key2.listen = false
        key3.listen = true

        keyAlert.innerHTML = 'Press Esc to cancel'
        setTimeout(function() { keyAlert.innerHTML = '' }, 1000)
    }

    document.onkeydown = function(e) {
        if (key0.listen || key1.listen || key2.listen || key3.listen) {
            if (e.code == 'Escape' && (key0.listen || key1.listen || key2.listen || key3.listen) ) {
                keyAlert.innerHTML = 'Canceled'
                setTimeout(function() { keyAlert.innerHTML = '' }, 1000)
                key0.listen = false
                key1.listen = false
                key2.listen = false
                key3.listen = false
                key0.innerHTML = 'Player 0 Key: ' + p0Key
                key1.innerHTML = 'Player 1 Key: ' + p1Key
                key2.innerHTML = 'Player 2 Key: ' + p2Key
                key3.innerHTML = 'Player 3 Key: ' + p3Key
            } else {
                if (e.code != p0Key && e.code != p1Key && e.code != p2Key && e.code != p3Key) {
                    if (key0.listen) {
                        p0Key = e.code
                        key0.innerHTML = 'Player 0 Key: ' + p0Key
                    } else if (key1.listen) {
                        p1Key = e.code
                        key1.innerHTML = 'Player 1 Key: ' + p1Key
                    } else if (key2.listen) {
                        p2Key = e.code
                        key2.innerHTML = 'Player 2 Key: ' + p2Key
                    } else if (key3.listen) {
                        p3Key = e.code
                        key3.innerHTML = 'Player 3 Key: ' + p3Key
                    }
                    key0.listen = false
                    key1.listen = false
                    key2.listen = false
                    key3.listen = false
                    keyAlert.innerHTML = ''
                } else {
                    keyAlert.innerHTML = 'Key is already in use'
                    setTimeout(function() { keyAlert.innerHTML = '' }, 1000)
                    key0.innerHTML = 'Player 0 Key: ' + p0Key
                    key1.innerHTML = 'Player 1 Key: ' + p1Key
                    key2.innerHTML = 'Player 2 Key: ' + p2Key
                    key3.innerHTML = 'Player 3 Key: ' + p3Key
                    key0.listen = false
                    key1.listen = false
                    key2.listen = false
                    key3.listen = false
                }
            }
        }
    }
}

function initGame(playerCount) {
    document.onkeydown = null
    canvas = document.getElementById('canvas')
    canvas.style.display = 'block'
    ctx = canvas.getContext('2d')

    map = document.getElementById('map')
    map.style.display = 'block'
    map_ctx = map.getContext('2d')
    
    pat_grass = map_ctx.createPattern(pat, 'repeat')

    if (playerCount > 4) playerCount = 4

    for (let i = 0; i < playerCount; i++)
        createPlayer()
    
    drawMap()
    draw()
    //setInterval( "draw()", 10)
    window.alert('Press OK to start the race')

    //isPointInPath
}

//#region Map Drawing
function drawMap() {
    map_ctx.clearRect(0, 0, map.width, map.height)
    map_ctx.strokeStyle = '#FFFFFF'
    map_ctx.lineWidth = 8

    // Poza drogą
    map_ctx.fillStyle = pat_grass //'#55AA00'
    map_ctx.fillRect(0,0, map.width, map.height)
    
    // Droga
    map_ctx.fillStyle = '#888888'
    map_ctx.beginPath()
    map_ctx.arc(map.height / 2, map.height / 2, map.height / 2 - 10, Math.PI / 2, 3 * Math.PI / 2)
    map_ctx.arc(map.width - map.height / 2, map.height / 2, map.height / 2 - 10, 3 * Math.PI / 2, Math.PI / 2)
    map_ctx.closePath()
    map_ctx.fill()
    map_ctx.stroke()

    // Środek
    map_ctx.fillStyle = pat_grass //'#55AA00'
    map_ctx.beginPath()
    map_ctx.arc(map.height / 2, map.height / 2, 170, Math.PI / 2, 3 * Math.PI / 2)
    map_ctx.arc(map.width - map.height / 2, map.height / 2, 170, 3 * Math.PI / 2, Math.PI / 2)
    map_ctx.closePath()
    map_ctx.fill()
    map_ctx.stroke()

    // Linia startu
    map_ctx.strokeStyle = '#FFFFFF'
    map_ctx.lineWidth = 8
    map_ctx.beginPath()
    map_ctx.moveTo(map.height / 2, 3 * map.height / 4 - 9)
    map_ctx.lineTo(map.height / 2, map.height - 11)
    map_ctx.stroke()
}
//#endregion

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    gameOver = false
    winner = null
    for (let i in players) {
        if (players[i].alive) {
            //ctx.fillStyle = players[i].color + '1F'
            ctx.beginPath()
            ctx.lineWidth = imgSize - 2
            for (let j = 0; j < players[i].trail.length; j++) {
                ctx.strokeStyle = players[i].color + (64 - j).toString(16)
                ctx.lineTo(players[i].trail[j].x, players[i].trail[j].y)
                ctx.stroke()
            }

            players[i].draw()

            if (players[i].turnL)
                players[i].updateVel(0.05)
            
            players[i].x += players[i].vx
            players[i].y += players[i].vy

            players[i].trail.unshift({x: players[i].x, y: players[i].y})
            if (players[i].trail.length == 64) players[i].trail.pop()

            /* let dx = players[i].x - (canvas.width - canvas.height / 2)
            let dy = players[i].y - canvas.height / 2
            let dist0 = Math.sqrt(dx * dx + dy * dy)

            dx = players[i].x - canvas.height / 2
            dy = players[i].y - canvas.height / 2
            let dist1 = Math.sqrt(dx * dx + dy * dy)

            if (players[i].x > 368 && players[i].x < 912) {
                if ( !( (players[i].y - imgSize / 2 > 18 && players[i].y + imgSize / 2 < 182) || (players[i].y - imgSize / 2 > 538 && players[i].y + imgSize / 2 < 702) ) ) {
                    players[i].alive = false
                    players[i].updateLapCounter()
                    if (players.length == 1) {
                        gameOver = true
                    }
                    checkAlive()
                }
            } else {
                if ( !( (dist0 - imgSize / 2 > 178 && dist0 + imgSize / 2 < canvas.height / 2 - 18) || (dist1 - imgSize / 2 > 178 && dist1 + imgSize / 2 < canvas.height / 2 - 18) ) ) {
                    players[i].alive = false
                    players[i].updateLapCounter()
                    if (players.length == 1) {
                        gameOver = true
                    }
                    checkAlive()
                }
            } */

            ctx.beginPath()
            ctx.arc(canvas.height / 2, canvas.height / 2, canvas.height / 4 + imgSize / 2, Math.PI / 2, 3 * Math.PI / 2)
            ctx.arc(canvas.width - canvas.height / 2, canvas.height / 2, canvas.height / 4 + imgSize / 2, 3 * Math.PI / 2, Math.PI / 2)
            ctx.closePath()
            if (ctx.isPointInPath(players[i].x, players[i].y)) {
                players[i].alive = false
                players[i].updateLapCounter()
                if (players.length == 1) {
                    gameOver = true
                }
                checkAlive()
            }

            ctx.beginPath()
            ctx.arc(canvas.height / 2, canvas.height / 2, canvas.height / 2 - imgSize * 3 / 2, Math.PI / 2, 3 * Math.PI / 2)
            ctx.arc(canvas.width - canvas.height / 2, canvas.height / 2, canvas.height / 2 - imgSize * 3 / 2, 3 * Math.PI / 2, Math.PI / 2)
            ctx.closePath()
            if (!ctx.isPointInPath(players[i].x, players[i].y)) {
                players[i].alive = false
                players[i].updateLapCounter()
                if (players.length == 1) {
                    gameOver = true
                }
                checkAlive()
            }

            if (players[i].x > 635 && players[i].x < 645 && players[i].doChecks) {
                players[i].holdChecks()
                if (players[i].check1) {
                    players[i].check3 = true
                    console.log('Player ' + players[i].id + ' passed checkpoint 3')
                } else {
                    players[i].check1 = true
                    console.log('Player ' + players[i].id + ' passed checkpoint 1')
                }
            }
            if (players[i].y > 355 && players[i].y < 375 && players[i].doChecks) {
                players[i].holdChecks()
                if (players[i].check0) {
                    players[i].check2 = true
                    console.log('Player ' + players[i].id + ' passed checkpoint 2')
                } else {
                    players[i].check0 = true
                    console.log('Player ' + players[i].id + ' passed checkpoint 0')
                }
            }
            if (players[i].x > 355 && players[i].x < 375) {
                if (players[i].check0 && players[i].check1 && players[i].check2 && players[i].check3) {
                    if (players[i].lapCount != 0)
                        console.warn('Player ' + players[i].id + ' finished a lap')
                    players[i].check0 = false
                    players[i].check1 = false
                    players[i].check2 = false
                    players[i].check3 = false
                    players[i].lapCount += 1
                    if (players[i].lapCount > maxLaps) {
                        winner = players[i].id
                        gameOver = true
                    } else {
                        players[i].updateLapCounter()
                    }
                }
            }
        } else {
            if (players[i].trail.length > 0) {
                players[i].trail.pop()
                ctx.beginPath()
                ctx.lineWidth = imgSize - 2
                for (let j = 0; j < players[i].trail.length; j++) {
                    ctx.strokeStyle = players[i].color + (64 - j).toString(16)
                    ctx.lineTo(players[i].trail[j].x, players[i].trail[j].y)
                    ctx.stroke()
                }

                players[i].draw()
            }
        }
    }

    if (gameOver) {
        if (winner != null) {
            window.alert('Player ' + winner + ' wins!')
        } else {
            window.alert('GAME OVER\n\nPress OK to restart')
        }
        location.reload()
    }

    window.requestAnimationFrame(draw)
}

function createPlayer() {
    let velocity = 5
    let spawnX = 340
    let spawnY = 560 + players.length * 40
    document.getElementById('lap-counter-p' + players.length).style.display = 'block'

    var player = {
        id: players.length,
        alive: true,
        trail: [],
        x: spawnX,
        y: spawnY,
        a: Math.PI / 2,
        doChecks: true,
        check0: true,
        check1: true,
        check2: true,
        check3: true,
        turnL: false,
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
    player.img.src = 'img/p' + player.id + '_base.png'
    player.draw = function() {
        ctx.translate(player.x, player.y) // zaznaczamy pozycję obrazka
        ctx.rotate(-player.a) // o ile obrócić
        ctx.drawImage(player.img, -imgSize, -imgSize, 2 * imgSize, 2 * imgSize) // punkt na obrazku wokół którego obracamy
        ctx.rotate(player.a)
        ctx.translate(-player.x, -player.y)
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

    player.updateLapCounter()
    players.push(player)
    player.draw()
}

function checkAlive() {
    let aliveCount = 0
    for (let i in players) {
        if (players[i].alive) {
            winner = players[i].id
            aliveCount += 1
        }
    }
    if (aliveCount == 1) {
        gameOver = true
    }
}