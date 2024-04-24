import styles from './styles.module.scss';

export default function Loading({ message = '読み込み中...' }: { message?: string }) {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loader} />
            <span className={styles.loadingText}>{message}</span>
        </div>
    )
}
