import * as React from 'react';
import './modal.scss';
import classNames from 'classnames';

interface IModalProps {
    title: string;
    show?: boolean;
}

interface IModalState {

}

export default class Modal extends React.Component<IModalProps, IModalState> {
    constructor(props: IModalProps) {
        super(props);
    }

    render() {
        const { title, children, show } = this.props;
        return (
            <div className={classNames('modal', {
                'modal__show': show,
            })}>
                <div className="modal-overlay" />
                <div className="modal-window">
                    <div className="modal-title">{title}</div>
                    <div className="modal-content">{children}</div>
                </div>
            </div>
        );
    }
}
