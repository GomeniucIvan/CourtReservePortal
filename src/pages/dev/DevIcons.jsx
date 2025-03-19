import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex} from "antd";
import {anyInList, isNullOrEmpty} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {Ellipsis} from "antd-mobile";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";

const { Text, Title } = Typography;

function DevIcons() {
    const [svgFiles, setSvgFiles] = useState([]);
    const {setHeaderTitle} = useHeader();
    const {setIsFooterVisible} = useApp();

    useEffect(() => {
        setIsFooterVisible(false);
    }, []);
    
    useEffect(() => {
        // Fetch the list of SVG files from the manifest
        fetch("/svg-manifest.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch SVG manifest");
                }
                return response.json();
            })
            .then((data) => setSvgFiles(data.svgs))
            .catch((error) => {
                console.error("Error fetching SVG manifest:", error);
                message.error("Failed to load icons");
            });
    }, []);

    const handleCardClick = (fileName) => {
        navigator.clipboard
            .writeText(fileName)
            .then(() => {
                pNotify(`Copied "${fileName}" to clipboard`)
            })
            .catch(() => {
                pNotify("Failed to copy to clipboard", 'error')
            });
    };
    
    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Icons</Title>
            <Row gutter={[16, 16]}>
                {anyInList(svgFiles) &&
                    <>
                        {svgFiles.map((file) => (
                            <Col key={file} xs={4} sm={3} md={3} lg={3} xl={2}>
                                <Card
                                    hoverable
                                    style={{ textAlign: "center", border: "1px solid #f0f0f0" }}
                                    onClick={() => handleCardClick(file.replace(".svg", ""))}
                                    bodyStyle={{ padding: "16px" }}
                                >

                                    <Flex vertical={true} gap={2} justify="center" align={"center"}>
                                        <img
                                            src={`/svg/${file}`}
                                            alt={file.replace(".svg", "")}
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                objectFit: "contain",
                                                marginBottom: "10px"
                                            }}
                                        />

                                        <Text style={{fontSize: '10px'}}><Ellipsis direction='end' content={file.replace(".svg", "")}/></Text>
                                    </Flex>
                                </Card>
                            </Col>
                        ))}
                    </>
                }

            </Row>
        </div>
    );
}

export default DevIcons;