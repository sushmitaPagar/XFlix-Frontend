import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "../css/VideoCard.css";
import { Link } from "react-router-dom";

const VideoCard = ({video}) => {

  const moment = require('moment');

    return (
      <>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <Link className="video-tile" to={`/video/${video._id}`}>
              <CardMedia
                component="img"
                height="153"
                image={video.previewImage}
                alt="video_image"
              />
            </Link>
          </CardActionArea>
        </Card>
        <CardContent className="cardContent">
          <Typography gutterBottom variant="h6" component="div">
            {video.title}
          </Typography>
          <div className="cardContent-body2">
            <Typography variant="body2" color="text.secondary">
              {moment(video.releaseDate).fromNow()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {video.contentRating}
            </Typography>
          </div>
        </CardContent>
      </>
    );
};

export default VideoCard;