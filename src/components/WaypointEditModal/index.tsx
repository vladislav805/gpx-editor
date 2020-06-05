import * as React from 'react';
import { IWayPoint } from '../../manager/manager';
import Modal from '../Modal';
import TextInput, { TextInputType } from '../TextInput';
import Button from '../Button';

interface IWaypointEditModalProps {
    waypoint?: IWayPoint;
    onDone: (waypoint: IWayPoint) => void;
}

interface IWaypointEditModalState {
    title?: string;
    description?: string;
    show?: boolean;
}

export default class WaypointEditModal extends React.Component<IWaypointEditModalProps, IWaypointEditModalState> {
    state: IWaypointEditModalState = {};

    componentDidUpdate(prevProps: IWaypointEditModalProps, _prevState: IWaypointEditModalState) {
        if (prevProps.waypoint !== this.props.waypoint) {
            const { title, description } = this.props?.waypoint ?? {};
            this.setState({ title, description, show: true });
        }
    }

    componentWillUnmount() {
        this.setState({ title: '', description: '' });
    }

    private onChangeText = (name: string, value: string) => {
        this.setState({
            [name as keyof IWaypointEditModalState]: value,
        } as Partial<IWaypointEditModalState>);
    }

    private onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const point = this.props.waypoint;
        const { title, description } = this.state;

        point.title = title;
        point.description = description;

        this.props.onDone(point);
    };

    private cancel = () => this.setState({ show: false });

    render() {
        const { waypoint } = this.props;

        if (!waypoint || !this.state.show) {
            return null;
        }

        const { title, description } = this.state;

        return (
            <Modal
                title="Edit waypoint"
                show={!!waypoint}>
                <form
                    onSubmit={this.onSubmit}>
                    <TextInput
                        type={TextInputType.text}
                        label="Title"
                        name="title"
                        defaultValue={title}
                        onChange={this.onChangeText}
                        value={title}
                        required />
                    <TextInput
                        type={TextInputType.textarea}
                        label="Description"
                        name="description"
                        defaultValue={description}
                        onChange={this.onChangeText}
                        value={description} />
                    <Button
                        label="Save"
                        type="submit"
                        size="l" />
                    <Button
                        label="Cancel"
                        type="button"
                        onClick={this.cancel}
                        size="l" />
                </form>
            </Modal>
        );
    }
}
