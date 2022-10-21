import React, { useEffect, useState } from "react";
import "../css/VideoPage.css";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from 'notistack';
import Header from "./Header";
import { Box, Typography, Button, Stack, Grid } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import VideoCard from "./VideoCard";

const VideoPage = () => {
    //const videos = [...videosArray];

    const { enqueueSnackbar } = useSnackbar();

    const moment = require('moment');
    const { id } = useParams();
    const [loading,setLoading] = useState(false);

    const [videoArray, setVideoArray] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState({});
    const [upVotes, setUpVotes] = useState(0);
    const [downVotes, setDownVotes] = useState(0);

    //Item styling for cards
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const patchVoteData = async (vote) => {
        const voteData = {
            vote: vote,
            change: "increase"
        }

        try {
            const response = await axios.patch(`${config.endpoint}/v1/videos/${id}/votes`, voteData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            return response;
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
            });
        }
    }

    const handleUpVotes = () => {
        setUpVotes(upVotes + 1)
        patchVoteData("upVote")
    }

    const handleDownVotes = () => {
        setDownVotes(downVotes + 1)
        patchVoteData("downVote")
    }

    const updateViews = async () => {
        const response = await axios.patch(`${config.endpoint}/v1/videos/${id}/views`);
        return response;
    }

    const fetchVideoById = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.endpoint}/v1/videos/${id}`);
            //console.log("selected Video: ",response.data);
            
            setSelectedVideo(response.data);
            setUpVotes(response.data.votes.upVotes);
            setDownVotes(response.data.votes.downVotes);
            setLoading(false);

            return response.data;
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
            })
            setLoading(false);
        }
    }

    const performApiCall = async () => {

        let url = config.endpoint + `/v1/videos`;
        
        try{
            //setLoading(true);
            const response = await axios.get(url);
            //setLoading(false);
            return response.data.videos;
        }catch(error){
            if(error.response)
              enqueueSnackbar(error.response, { variant: "error"})
        }
      };

    useEffect(() => {
        const fetchVideo = async () => {
            const response = await performApiCall();
            setVideoArray(response);
            const video = await fetchVideoById(id);
            updateViews();
        }
        
        fetchVideo();
    }, [id]);

    return (
        <>
        <Header />
        <Box>
            {loading ?
                    <Loading /> :
                    <div>
                    <Box className="video-container video-tile">
                        <Box className="ifarme-container">
                            <iframe
                                className="iframe"
                                src={`https://www.${selectedVideo.videoLink}`}
                                title={selectedVideo.title}
                            />
                        </Box>
                        <Box className="videoDetails-container">
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h5">{selectedVideo.title}</Typography>
                                    <Typography variant="p">
                                        {selectedVideo.contentRating} | {" "}
                                        {moment(selectedVideo.releaseDate).fromNow()}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Button onClick={handleUpVotes}>
                                        <Stack direction="row" gap="10px" alignItems="center">
                                            <ThumbUpIcon />
                                            <Typography
                                                variant="p"
                                                style={{ color: "white", fontWeight: "bold" }}
                                            >
                                                {upVotes}
                                            </Typography>
                                        </Stack>
                                    </Button>

                                    <Button onClick={handleDownVotes}>
                                        <Stack direction="row" gap="10px" alignItems="center">
                                            <ThumbDownIcon />
                                            <Typography
                                                variant="p"
                                                style={{ color: "white", fontWeight: "bold" }}
                                            >
                                                {downVotes}
                                            </Typography>
                                        </Stack>
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                        {/* <hr /> */}
                    </Box>
                    <Grid container className="dashboard" spacing={2}>
                        {videoArray.filter((video) => video._id !== id).map((data)=>{
                                return (
                                <Grid item xs={6} md={3} key={data._id}>
                                    <Item className="item">
                                        <VideoCard video={data} key={data._id}/>
                                    </Item>
                                </Grid>
                                );
                            })
                        }
                    </Grid>
                    </div>
            }
        </Box>
        </>
    );
};

export default VideoPage;