import {anyInList} from "@/utils/Utils.jsx";
import React, {useEffect, useState} from "react";
import SVG from "@/components/svg/SVG.jsx";

function LayoutIcons() {
    const [svgFiles, setSvgFiles] = useState([]);
    const [svgLoaded, setSvgLoaded] = useState(false);

    useEffect(() => {
        // Fetch the list of SVG files from the manifest
        fetch("/svg-manifest.json")
            .then((response) => {
                console.log(response);
                if (!response.ok) {

                }
                return response.json();
            })
            .then((data) => setSvgFiles(data.svgs))
            .catch((error) => {

            });

        setTimeout(function () {
            setSvgLoaded(true);
        }, 1000)
    }, []);

    return (
        <>
            {!svgLoaded &&
                <>
                    {anyInList(svgFiles) &&
                        <div style={{ display: "none" }}>
                            {svgFiles.map((file) => (
                                <SVG icon={file.replace(".svg", "")} size={24} key={file.replace(".svg", "")} />
                            ))}
                        </div>
                    }
                </>
            }
        </>
    )
}

export default LayoutIcons;