import React, {Component} from 'react';
import Box from '../../assets/box.svg';

class Error404 extends Component {
    render() {
        if (this.props.history.location.pathname !== '/404') {
            this.props.history.replace("/404");
        }
        return (
            <div style={{maxWidth: '100%', height: 'calc(100vh - 170px)', margin: '0 auto', textAlign: 'center'}}>
                <Box style={{maxWidth: '30%'}}/>
            </div>
        )
    }
}
export default Error404;