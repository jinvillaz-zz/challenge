import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { DropzoneArea } from 'material-ui-dropzone';

import UploadService from '../services/upload-files';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const UploadFiles = () => {
  const classes = useStyles();
  const [ currentFile, setCurrentFile ] = useState('value');
  const [ progress, setProgress ] = useState(0);
  const [ isInprogress, setIsInProgress ] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ isError, setIsError ] = useState(false);
  const [ fileInfo, setFileInfo ] = useState([]);

  const upload = () => {
    setProgress(0);
    setIsInProgress(true);
    UploadService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        setIsError(false);
        return UploadService.getFiles();
      })
      .then((response) => {
        setFileInfo(response.data.name);
        setIsInProgress(false);
      })
      .catch(() => {
        setProgress(0);
        setMessage('Could not upload the file!');
        setCurrentFile(undefined);
        setIsError(true);
        setIsInProgress(false);
      });
  };

  const setSelectedFile = (files) => {
    setCurrentFile(files[0]);
  };

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfo(response.data.name);
    });
  }, [setFileInfo]);

  return (
    <div className="mg20">
      <span> Last file uploaded <h2>{fileInfo} </h2></span>
      <DropzoneArea
        acceptedFiles={['.csv']}
        dropzoneText={"Drag and drop an image here or click"}
        onChange={setSelectedFile}
        onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
        filesLimit={1}
        showFileNames={true}
      />
      {currentFile && (
        <Box className="mb25" display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <BorderLinearProgress variant="determinate" value={progress} />
          </Box>
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
          </Box>
        </Box>)
      }
      <Button variant="contained"
              color="primary"
              className={classes.margin}
              onClick={upload}
              disabled={!currentFile || isInprogress} >
        Upload
      </Button>
      <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
        {message}
      </Typography>
    </div >
  );
}

export default UploadFiles;
