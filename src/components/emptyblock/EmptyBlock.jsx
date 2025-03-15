import EntityEmptyBlock from "@/components/entitycard/EntityEmptyBlock.jsx";

export const emptyBlockTypes = {
    WAIVER: 'waiver'
}

function EmptyBlock({description, removePadding}) {
    return (
        <EntityEmptyBlock text={description} height={80} removePadding={removePadding} />
    );
}

export default EmptyBlock;