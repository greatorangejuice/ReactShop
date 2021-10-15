import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(3, 0, 3),
    },
}));

type CSVFileImportProps = {
    url: string,
    title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
    const classes = useStyles();
    const [file, setFile] = useState<any>();

    const onFileChange = (e: any) => {
        console.log(e);
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        setFile(files.item(0));
    };

    const removeFile = () => {
        setFile('');
    };

    const uploadFile = async (e: any) => {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            const token = Buffer.from(`${username}:${password}`).toString('base64')
            // const token = Buffer.from(`greatorangejuice:TEST_PASSWORD`).toString('base64')

            const response = await axios({
                method: 'GET',
                url,
                params: {
                    name: encodeURIComponent(file.name)
                },
                headers: {
                    Authorization: `Basic ${token}`
                    // Authorization: `Basic Z3JlYXRvcmFuZ2VqdWljZTpURVNUX1BBU1NXT1JE`
                }
            })
            console.log('File to upload: ', file.name)
            console.log('Uploading to: ', response.data)

            const result = await axios({
                method: "PUT",
                url: response.data.newUrl,
                data: file,
                headers: {
                    'Content-Type': 'text/csv'
                }
            })
            // const result = await fetch(response.data.newUrl, {
            //   method: 'PUT',
            //   body: file
            // })
            console.log('Result: ', result)
            setFile('');
        }
    ;

    return (
        <div className={classes.content}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            {!file ? (
                <input type="file" onChange={onFileChange}/>
            ) : (
                <div>
                    <button onClick={removeFile}>Remove file</button>
                    <button onClick={uploadFile}>Upload file</button>
                </div>
            )}
        </div>
    );
}
