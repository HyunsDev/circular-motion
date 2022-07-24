import { useEffect, useState } from "react"
import { useWorker } from "../../hook/useWorker"
import { Controller } from "../controller"
import { Label, Labels } from "../label"

type vector = [number, number]
interface resultData {
    data: {
        length: number
        gravity: number,
        angle: number,
        angularVelocity: number
        angularAcceleration: number
        origin: vector
        vector: vector
        weight: number
        isRelease: boolean
        speed2: vector
    },
    loopId: number
}

const round = (num: number, i: number = 1) => {
    return Math.round(num * (10 ** i)) / (10 ** i)
}

/*
단위 매핑
1px = 1cm = 0.01m
60 loop = 1s
1 loop = 1/60s

1 px/loop = 0.01 * 60 m/s

*/

function ResultController(props: {}) {
    const worker = useWorker()
    const [data, setData] = useState<resultData>({
        data: {
            length: 0,
            gravity: 0,
            angle: 0,
            angularVelocity: 0,
            angularAcceleration: 0,
            origin: [0,0],
            vector: [0,0],
            weight: 0,
            isRelease: false,
            speed2: [0,0],
        },
        loopId: 0
    })

    useEffect(() => {
        const Id = worker.addListener('result', (data) => {
            setData(data)
        })
        
        return () => worker.removeListener(Id)
    }, [worker])
    

    return (
        <Controller right={20} bottom={20} minWidth={300}>
            <Labels>
                <Label name={'질량'} value={`${(data?.data.weight || 0)} kg`} />
                {!data?.data.isRelease && <Label name={'길이'} value={`${(data?.data.length || 0) / 100} m`} />}
                {!data?.data.isRelease && <Label name={'속력'} value={`${round(Math.abs((((data?.data.length || 0) / 100 * (data?.data.angularVelocity || 0) * 180 / Math.PI)) * 60), 2)} m/s`} />}
                {!data?.data.isRelease && <Label name={'각도'} value={`${round((data?.data.angle || 0) * 180 / Math.PI)}° (${round((data?.data.angle || 0) * 180 / Math.PI)}°)`} />}
                {!data?.data.isRelease && <Label name={'각속도'} value={`${round((data?.data.angularVelocity|| 0) * 60 * 180 / Math.PI, 2) }°/s`} />}
                {!data?.data.isRelease && <Label name={'각가속도'} value={`${round((data?.data.angularAcceleration || 0) * 60 * 180 / Math.PI, 2) }°/s²`} />}
                {!data?.data.isRelease && <Label name={'구심가속도'} value={`${round(((data?.data.length || 0) * (data?.data.angularVelocity || 0) ** 2) * 60, 2) }m/s²`} />}
                {!data?.data.isRelease && <Label name={'구심력'} value={`${round(((data.data.weight || 0) * (data?.data.length || 0) * (data?.data.angularVelocity || 0) ** 2) * 60, 2) }N`} />}
                {data?.data.isRelease && <Label name={'속력'} value={`${round(Math.sqrt(data.data.speed2[0]**2 +  data.data.speed2[1]**2), 2)} m/s`} />}
                <Label name={'위치'} value={`${round(data?.data.vector[0] || 0, 0)}, ${round(data?.data.vector[1] || 0, 0)}`} />
                
            </Labels>
        </Controller>
    )
}

export { ResultController }