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
    },
    loopId: number
}


function LabelController(props: {}) {
    const worker = useWorker()
    const [ups, setUps] = useState(0)
    const [lastTime, setLastTime] = useState({time: 0, loopDiff: 0})

    useEffect(() => {
        const Id = worker.addListener('ups', (data) => {
            setUps(data)
        })
        return () => worker.removeListener(Id)
    }, [worker])

    useEffect(() => {
        const Id = worker.addListener('center', (data) => {
            setLastTime({
                time: data.time,
                loopDiff: data.loopDiff
            })
        })
        return () => worker.removeListener(Id)
    }, [worker])
    

    return (
        <Controller right={20} top={20} minWidth={200}>
            <Labels>
                <Label name={'ups'} value={ups} />
                
            </Labels>
        </Controller>
    )
}

export { LabelController }