import styles from './EntityCard.module.less';

const EntityCard = (props) => {
    return (
        <div className={styles.folder}>
            {props.children}
        </div>
    )
}

export default EntityCard;
