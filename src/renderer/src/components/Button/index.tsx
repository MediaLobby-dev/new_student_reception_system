import styles from './styles.module.scss'
import classNames from 'classnames'

type Props = {
    status?: "primary" | "success" | "danger" | "warning" | "secondary" | "important",
    onClick: () => void
    disabled?: boolean
    children?: React.ReactNode
}

export default function Button({ status, children, onClick, disabled }: Props) {

    if (disabled) {
        return (
            <button className={classNames(styles.button, styles.disabled)} disabled={true}>
                <div className={styles.content}>
                    {children}
                </div>
            </button>
        )
    }

    switch (status) {
        case "primary":
            return (
                <button className={classNames(styles.button, styles.primary)} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )
        case "success":
            return (
                <button className={classNames(styles.button, styles.success)} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )

        case "danger":
            return (
                <button className={classNames(styles.button, styles.danger)} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )
        case "warning":
            return (
                <button className={classNames(styles.button, styles.warning)} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )

        case "secondary":
            return (
                <button className={classNames(styles.button, styles.secondary)} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )
        
        case "important":
            return (
                <button className={classNames(styles.button, styles.inportant)} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )

        default:
            return (
                <button className={styles.button} onClick={onClick}>
                    <div className={styles.content}>
                        {children}
                    </div>
                </button>
            )
    }
}
