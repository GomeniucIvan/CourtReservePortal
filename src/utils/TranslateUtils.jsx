import {containsNoCase, isNullOrEmpty} from "./Utils.jsx";

let entityReplacements = {
    court: "Court",
    member: "Member",
    resource: "Resource",
    group: "Groups",
    event: "Event",
};

export const setTranslateData = (incData) => {
    if (!isNullOrEmpty(incData)) {
        entityReplacements = {
            court: "Court",
            member: "Member",
            resource: "Resource",
            group: "Groups",
            event: !isNullOrEmpty(incData?.AlternateEventName) ? incData?.AlternateEventName : 'Event',
        }
    }
}

export const requiredMessage = (t, key) => {
    return t('common:requiredMessage', {label: t(key)})
}

export const getMembershipText = (selectedMembershipName) => {
    if (containsNoCase(selectedMembershipName, 'membership')) {
        return selectedMembershipName;
    } else if (!isNullOrEmpty(selectedMembershipName)) {
        return `${selectedMembershipName} Membership`;
    }
};

const EntityStringEnum = {
    Default: "default",
    Uppercase: "uppercase",
    Lowercase: "lowercase",
}

const toEntityStringType = (word, entityType) => {
    switch (entityType) {
        case EntityStringEnum.Uppercase:
            return word.toUpperCase();
        case EntityStringEnum.Lowercase:
            return word.toLowerCase();
        default:
            return word;
    }
};

const shouldPluralize = (word, alternateName) => {
    const pluralEndings = ["s", "ss", "z", "ch", "x"];
    return (
        word.endsWith("s") &&
        pluralEndings.some((ending) => alternateName.endsWith(ending))
    );
};

const processText = (text) => {
    if (isNullOrEmpty(text)){
        return text;
    }
    
    return text
        .split(" ")
        .map((word) => {
            if (word.length < 4 || word.toLowerCase().includes("membership")) {
                return word;
            }

            let lowerWord = word.toLowerCase();
            for (const [keyword, entityKey] of Object.entries(entityReplacements)) {
                if (!lowerWord.includes(keyword) || !entityKey) continue;

                let entityType = EntityStringEnum.Default;
                let replacement = toEntityStringType(entityKey, entityType);

                // Special handling for "event" pluralization
                if (keyword === "event") {
                    if (word.includes("/")) {
                        return word
                            .split("/")
                            .map((subword) =>
                                subword.includes("event")
                                    ? subword.replace("event", shouldPluralize(subword, entityKey) ? replacement + "es" : replacement)
                    : subword
                    )
                    .join("/");
                    }
                    if (shouldPluralize(word, entityKey)) {
                        lowerWord = lowerWord.slice(0, -1) + "es";
                    }
                }

                return lowerWord.replace(keyword, replacement);
            }

            
            return word;
        })
        .join(" ");
};

export const e = (string) => {
    return processText(string);
}

export const eReplace = (string) => {
    return e(string);
}

export const eTranslate = (string) => {
    return e(string);
}