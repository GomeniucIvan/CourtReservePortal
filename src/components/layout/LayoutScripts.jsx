import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider.jsx";
import { isNullOrEmpty, equalString } from "@/utils/Utils.jsx";

function LayoutScripts() {
    const { orgId, enterpriseId, authData } = useAuth();
    const [metaPixelCode, setMetaPixelCode] = useState("");
    const [googleTag, setGoogleTag] = useState("");

    useEffect(() => {
        let googleTagConfigKey = "";
        let metaPixelCodeInner = "";

        if ((equalString(orgId, 6415) || equalString(orgId, 6240))) {
            googleTagConfigKey = "G-YK6Z7492YW";
        } else if (equalString(orgId, 6891)) {
            googleTagConfigKey = "GTM-MSR8CPZ";
        } else if (equalString(orgId, 8278)) {
            googleTagConfigKey = "G-3GVS96SPMG";
        } else if (equalString(enterpriseId, 20)) {
            googleTagConfigKey = "GTM-KX6MZ3R";
        } else if (equalString(orgId, 6062)) {
            googleTagConfigKey = "GTM-W249B29D";
        } else if (equalString(orgId, 9909)) {
            googleTagConfigKey = "GTM-KMM682NX";
        } else if (equalString(orgId, 9907)) {
            googleTagConfigKey = "GTM-P3RVXQB";
        } else if (equalString(orgId, 9422)) {
            googleTagConfigKey = "GTM-KW52QT4D";
        } else if (equalString(orgId, 6689)) {
            googleTagConfigKey = "GTM-TCLXTBKH";
        } else if (equalString(orgId, 10051)) {
            metaPixelCodeInner = "553360427019342";
        }

        if (!isNullOrEmpty(googleTagConfigKey)) {
            if (!window.gtag) {
                // Load Google Tag Manager script dynamically
                const script = document.createElement("script");
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagConfigKey}`;
                document.head.appendChild(script);

                script.onload = () => {
                    window.dataLayer = window.dataLayer || [];
                    function gtag() {
                        window.dataLayer.push(arguments);
                    }
                    window.gtag = gtag;

                    gtag("js", new Date());
                    gtag("config", googleTagConfigKey);

                    setGoogleTag(googleTagConfigKey);
                };
            }
        }

        if (!isNullOrEmpty(metaPixelCodeInner)) {
            if (!window.fbq) {
                // Load Facebook Pixel script dynamically
                !(function (f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function () {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = "2.0";
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = !0;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s);
                })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

                window.fbq("init", metaPixelCodeInner);
                window.fbq("track", "PageView");

                setMetaPixelCode(metaPixelCodeInner);
            }
        }
    }, [orgId, enterpriseId]);

    useEffect(() => {
        if ((equalString(orgId, 6415) || equalString(orgId, 6240)) && !isNullOrEmpty(authData?.MemberId)) {
            window.digitalData = {
                member_id: authData?.OrgMemberId || "", // Ensure it's not undefined
                family_id: authData?.OrgMemberFamilyId || "",
            };

            //TODO add qa?!
            
            // Load Adobe Launch script dynamically
            const script = document.createElement("script");
            script.src = "https://assets.adobedtm.com/15c795eb812c/e21f099afbee/launch-EN1e11bbf3860f415da9319a506515ad69.min.js";
            script.async = true;
            script.type = "text/javascript";

            document.head.appendChild(script);

            return () => {
                // Optional cleanup: remove script if necessary
                document.head.removeChild(script);
                delete window.digitalData; // Cleanup global variable
            };
        }
    }, [authData?.MemberId, orgId])
    
    return (
        <>
            {!isNullOrEmpty(metaPixelCode) && (
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src={`https://www.facebook.com/tr?id=${metaPixelCode}&ev=PageView&noscript=1`}
                        alt="Facebook Pixel"
                    />
                </noscript>
            )}

            {!isNullOrEmpty(googleTag) && (
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${googleTag}`}
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>
            )}
        </>
    );
}

export default LayoutScripts;
