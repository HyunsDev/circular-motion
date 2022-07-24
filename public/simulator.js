/* eslint-disable no-restricted-globals */


let loopId = 0
let loopTimer
let speed = 1
let isPlay = true

const InitData = {
    length: 200,
    gravity: 9.8,
    angle: Math.PI / 4,
    weight: 100,
    angularVelocity: Math.PI / 180,
    angularAcceleration: 0,
    isRelease: false,
    origin: [0, 0],
    shout: 0.5,
    speed2: [0, 0]
}

const data = {
    length: InitData.length,
    gravity: InitData.gravity,
    weight: InitData.weight,
    angle: InitData.angle,
    angularVelocity: InitData.angularVelocity,
    angularAcceleration: InitData.angularAcceleration,
    origin: InitData.origin,
    isRelease: InitData.isRelease,
    shout: InitData.shout,
    vector: [
      InitData.length * Math.sin(InitData.angle) + InitData.origin[0],
      InitData.length * Math.cos(InitData.angle) + InitData.origin[1],
    ],
    speed2: InitData.speed2
}

const notSentData = {
    screen: {
        width: 500,
        height: 500,
    }
}

function simulationLoop() {
    loopId++

    if (data.isRelease) {
        data.vector = [
            data.vector[0] + data.speed2[0],
            data.vector[1] + data.speed2[1],
        ];

        if (data.vector[0] + 10 >= 1 * notSentData.screen.width / 2) {
            data.vector[0] = notSentData.screen.width / 2 - 10
            data.speed2[0] = -1 * data.speed2[0] * data.shout
        }

        if (data.vector[0] - 10 <= - 1 * notSentData.screen.width / 2) {
            data.vector[0] = notSentData.screen.width / 2 + 10
            data.speed2[0] = -1 * data.speed2[0] * data.shout
        }
        
        if (data.vector[1] - 10 <= -1 * notSentData.screen.height / 4) {
            data.vector[1] = notSentData.screen.height / 4 + 10
            data.speed2[1] = -1 * data.speed2[1] * data.shout
        }

        if (data.vector[1] + 10 >= notSentData.screen.height / 4 * 3) {
            data.vector[1] = notSentData.screen.height / 4 * 3 - 10
            data.speed2[1] = -1 * data.speed2[1] * data.shout
        }

        data.speed2[1] += data.gravity / 10

    } else {
        // 계산
        data.angularAcceleration = -1 * data.gravity / 10 / data.length * Math.sin(data.angle);
        data.angularVelocity += data.angularAcceleration;
        data.angle += data.angularVelocity;
        data.vector = [
            data.length * Math.sin(data.angle) + data.origin[0],
            data.length * Math.cos(data.angle) + data.origin[1],
        ];
    }

    self.postMessage({code: 'result', data: {
        loopId,
        data
    }})
}

let updateRateCount = 0
let updateRateStartTime = new Date()
const loop = () => {
    if (updateRateCount === 0) updateRateStartTime = new Date()

    isPlay && simulationLoop()
    updateRateCount++ 

    if (updateRateCount === 60) {
        updateRateCount = 0
        const updateRate = Math.round(60 / (new Date() - updateRateStartTime) * 1000)
        self.postMessage({code: 'ups', data: updateRate})
    }
}

const reset = () => {
    data.angle =  Math.PI / 4
    data.angularAcceleration = InitData.angularAcceleration
    data.angularVelocity = InitData.angularVelocity
    data.isRelease = false
    data.speed2 = [0, 0]

    loopId = 0
    loopTimer && clearInterval(loopTimer)
    loopTimer = setInterval(loop, 16.6)
}
reset()

// IO
self.addEventListener('message', event => {
    switch (event.data.code) {
        case 'ping':
            reset()
            self.postMessage({code: 'pong'})
            break

        case 'pause':
            isPlay = false
            break

        case 'play':
            isPlay = true
            break

        case 'reset':
            reset()
            break

        case 'updateGravity':
            data.gravity = event.data.data
            break

        case 'updateLength':
            data.length = event.data.data
            break

        case 'updateWeight':
            data.weight = event.data.data
            break

        case 'addSpeed':
            data.angularVelocity += event.data.data
            break

        case 'release':

            if (!data.isRelease) {
                const speed = data.length * data.angularVelocity
                data.speed2[0] = speed * Math.cos(data.angle)
                data.speed2[1] = -speed * Math.sin(data.angle)
                data.isRelease = true
            }
            break

        case 'screenSize':
            notSentData.screen = event.data.data
            break

        default:
            console.error(`Wrong Command: '${event.data.code}' `)
    }
})
