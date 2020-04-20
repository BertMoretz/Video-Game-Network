import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function HomePage() {
    const [test, setTest] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/test', {
            params: {
                table: 'sample',
            },
        }).then((response) => {
            console.log(response.data);
            setTest(response.data);
        });
    },[]);


    return (
        <div>
            {test && <span>IMPORTED DATA</span>}
        </div>
    )
}
