import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Segmented, Button} from "antd";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {Ellipsis} from "antd-mobile";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import FormPaymentProfileCardConnect from "@/form/formpaymentprofile/FormPaymentProfile.CardConnect.jsx";
import FormPaymentProfileStripe from "@/form/formpaymentprofile/FormPaymentProfile.Stripe.jsx";
import FormPaymentProfileSafeSave from "@/form/formpaymentprofile/FormPaymentProfile.SafeSave.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {membershipRequirePayment} from "@/utils/CostUtils.jsx";
import {setFormikError, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import {cx} from "antd-style";
import InstructionBlock from "@/components/instructionblock/InstructionBlock.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";

const { Text, Title } = Typography;

function DevButtons() {
    const {token, globalStyles} = useApp();
    const {buttonStyles} = useCombinedStyles();
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} justify={'center'} gap={16}>
                
               <Button block={true} size={'small'}>Small size='small'</Button>
               <Button block={true}>Default</Button>
               <Button block={true} size={'large'}>Large size='large'</Button>

                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Yellow</span>
                        <span>buttonStyles.buttonYellow</span>
                        <Button block={true} className={buttonStyles.buttonYellow}>Yellow</Button>
                    </Flex>
                </Card>

                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Blue</span>
                        <span>buttonStyles.buttonBlue</span>
                        <Button block={true} className={buttonStyles.buttonBlue}>Blue</Button>
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Primary</span>
                        <span>primary='primary'</span>
                        <Button type={'primary'} block={true} variant="solid">
                            Primary
                        </Button>
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Danger</span>
                        <span>primary='primary' danger='true'</span>
                        <Button type={'primary'} danger={true} block={true} variant="solid">
                            Danger
                        </Button>
                    </Flex>
                </Card>

                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Default</span>
                        <span>color='default'</span>
                        <Button color="default" block={true} variant="solid">
                            Default
                        </Button>
                    </Flex>
                </Card>
                
                //not used
                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Pink</span>
                        <span>color='pink'</span>
                        <Button color="pink" block={true} variant="solid">
                            Pink
                        </Button>
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Purple</span>
                        <span>color='purple'</span>
                        <Button color="purple" block={true} variant="solid">
                            Purple
                        </Button>
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'} vertical={true} gap={8}>
                        <span>Cyan</span>
                        <span>color='cyan'</span>
                        <Button color="cyan" block={true} variant="solid">
                            Cyan
                        </Button>
                    </Flex>
                </Card>
            </Flex>
        </PaddingBlock>
    );
}

export default DevButtons;