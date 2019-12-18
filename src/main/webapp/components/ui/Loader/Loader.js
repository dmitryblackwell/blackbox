import React from "react";
import {ScaleLoader} from "react-spinners";

const Loader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px'}}>
        <ScaleLoader
            sizeUnit={"px"}
            size={150}
            color={'#ff0000'}
            loading={true}
        />
    </div>
);

export default Loader;