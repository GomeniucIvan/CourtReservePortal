import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Button, Flex, Upload, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { pNotify } from '@/components/notification/PNotify';
import { displayMessageModal } from '@/context/MessageModalProvider';
import { modalButtonType } from '@/components/modal/CenterModal';
import {isNullOrEmpty, moreThanOneInList, oneListItem} from '../../utils/Utils';
import { useStyles } from './styles';
import { useAuth } from "@/context/AuthProvider.jsx";
import { useApp } from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {reactNativePickImage, reactNativeTakePhoto} from "@/utils/MobileUtils.jsx";

const { Text } = Typography;

function ImageUploader() {
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [fileList, setFileList] = useState([]);
    const selectAFileRef = useRef(null);
    const { styles } = useStyles();
    const { authData } = useAuth();
    const { token } = useApp();

    useEffect(() => {
        window.mobilePickImageResult = (base64Image) => handleExternalImage(base64Image);
        window.mobileTakePhotoBaseResult = (base64Image) => handleExternalImage(base64Image);
    }, []);

    // Handle file upload change and convert to base64
    // Handle upload change
    const handleUploadChange = ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[fileList.length-1];
            if (!file.thumbUrl) {
                generateThumbUrl(file.originFileObj, (thumbUrl) => {
                    file.thumbUrl = thumbUrl;
                    setProfileImageUrl(thumbUrl);
                    setFileList([file]);
                });
            } else {
                setProfileImageUrl(file.thumbUrl);
                setFileList([file]);
            }
        } else {
            setProfileImageUrl(null);
            setFileList([]);
        }
    };

    const generateThumbUrl = (file, callback) => {
        const reader = new FileReader();
        reader.onload = (e) => callback(e.target.result);
        reader.readAsDataURL(file);
    };

    // Handle images from both pick and take photo
    const handleExternalImage = (base64Image) => {
        const blob = base64ToBlob(base64Image);
        const file = new File([blob], 'external-image.png', { type: 'image/png' });
        const url = URL.createObjectURL(file);
        setProfileImageUrl(url);

        // Simulate file upload
        const newFile = {
            uid: `${Date.now()}`,
            name: 'external-image.png',
            status: 'done',
            originFileObj: file,
            url: url,
        };

        // Trigger cropping by manually updating file list through Upload
        setFileList([newFile]);
    };

    // Convert base64 to Blob
    const base64ToBlob = (base64) => {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    // Delete profile picture
    const handleDelete = () => {
        setProfileImageUrl(null);
        setFileList([]);
    };

    // Open image cropper manually by simulating click
    const openFilePicker = () => {
        reactNativePickImage(selectAFileRef);
    };

    const takePicture = () => {
        reactNativeTakePhoto();
    };

    return (
        <div>

            {/* Image Crop Component */}
            <div style={{display: 'none'}}>
                <ImgCrop cropShape="round" aspect={1} modalClassName={styles.imgCrop}>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        showUploadList={false}
                        fileList={fileList}
                        onChange={handleUploadChange}
                    >
                        <Button type="primary" block icon={<PlusOutlined />} ref={selectAFileRef}>
                            Select a File
                        </Button>
                    </Upload>
                </ImgCrop>
            </div>

            <Flex justify="center" vertical gap={16} className={styles.profilePictureWrapper}>
                <Avatar
                    size={100}
                    src={profileImageUrl}
                    icon={!profileImageUrl && <PlusOutlined />}
                    className={styles.profilePictureAvatar}
                />

                <Flex gap={token.padding} justify="center">
                    {/* Open Cropper Button */}
                    <Button type={'primary'}
                            className={styles.profilePictureButton}
                            onClick={() => {
                                if (window.ReactNativeWebView) {
                                    //file picker allow to take picture
                                    openFilePicker();  
                                } else {
                                    displayMessageModal({
                                        title: "Profile Picture Action",
                                        html: (onClose) => <PaddingBlock leftRight={false} onlyTop={true}>
                                            <Flex vertical={true} gap={token.padding}>
                                                <Button type={'primary'}
                                                        block={true}
                                                        onClick={() => {
                                                            openFilePicker();
                                                            onClose();
                                                        }}>
                                                    Select a Picture
                                                </Button>

                                                <Button type={'primary'}
                                                        block={true}
                                                        onClick={() => {
                                                            takePicture();
                                                            onClose();
                                                        }}>
                                                    Take a Picture
                                                </Button>

                                                <Button block={true} onClick={() => {
                                                    onClose();
                                                }}>
                                                    Close
                                                </Button>
                                            </Flex>
                                        </PaddingBlock>,
                                        type: "info",
                                        buttonType: '',
                                        onClose: () => {},
                                    })
                                }
                            }}>
                        Change
                    </Button>

                    {/* Delete Picture Button */}
                    {!isNullOrEmpty(profileImageUrl) && (
                        <Button
                            type="primary"
                            danger
                            className={styles.profilePictureButton}
                            onClick={() => {
                                displayMessageModal({
                                    title: 'Profile Picture Delete',
                                    html: (onClose) => (
                                        <Flex vertical gap={16}>
                                            <Text>
                                                You are about to delete your profile picture from{' '}
                                                <strong>{authData?.OrgName}</strong>. Are you sure you want to proceed?
                                            </Text>
                                            <Flex vertical gap={10}>
                                                <Button
                                                    block
                                                    type="primary"
                                                    danger
                                                    onClick={() => {
                                                        handleDelete();
                                                        onClose();
                                                    }}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button block onClick={onClose}>
                                                    Close
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    ),
                                    type: 'warning',
                                    buttonType: '',
                                });
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </Flex>
            </Flex>
        </div>
    );
}

export default ImageUploader;