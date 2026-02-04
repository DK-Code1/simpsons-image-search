import { useEffect, useState } from "react"
import error from "../assets/error3.png" 

export function ResultImage({episode, frame, backend}) {

    const [image, setImage] = useState("")
    const [adress, setAdress] = useState("#")

    useEffect(() => {

        //getBackend()
        getImage()

    }, [])

    function findClosestFrame(array, target) {
        return array.reduce((closest, frame) => {
            const currentDiff = Math.abs(frame.Timestamp - target);
            const closestDiff = Math.abs(closest.Timestamp - target);
            return currentDiff < closestDiff ? frame : closest;
        });
    }

    async function getImage() {
        if (backend === "buscasimpsons") { // No convertion needed
            setImage(`https://api.buscasimpsons.com/images/${episode}/frame_${frame}.jpg/medium/`)
            setAdress(`https://buscasimpsons.com/scene/${episode}/${frame}/`)
            return
        }

        if (backend === "frinkiac") {
            var frame_to_timestamp = parseInt((Number(frame) / 23.976) * 1000)

            var formated_season = episode.split("x")[0]
            var formated_episode = episode.split("x")[1]

            const options = { method: 'GET', headers: { accept: 'application/json' } };

            try {
                var response = await fetch(`https://try.readme.io/https://frinkiac.com/api/frames/S${formated_season}E${formated_episode}/${frame_to_timestamp}/300/300`, options)

                var results = await response.json()

                var closest = findClosestFrame(results, frame_to_timestamp)

            }

            catch (error) {
                console.log(`${episode}-${frame} not found on frinkiac.`)
            }

            if(closest){
                setImage(`https://frinkiac.com/img/S${formated_season}E${formated_episode}/${closest.Timestamp}/medium.jpg`)
                setAdress(`https://frinkiac.com/caption/S${formated_season}E${formated_episode}/${closest.Timestamp}`)

            }
            
        }
    }

    return (
        <a className="results-image"  href={adress} target="_blank" >
            <img  src={image ? image : error} loading="lazy"/>
            <div>
                <h>{episode}</h>
            </div>
        </a>
    )
}