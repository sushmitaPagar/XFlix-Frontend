import React, { useEffect, useState } from "react";
import "../css/landingPage.css";
import Header from "./Header";
import { TextField, InputAdornment, Grid } from "@mui/material";
import { Search } from "@mui/icons-material";
import { config } from "../App";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import VideoCard from "./VideoCard";
import Loading from "./Loading";
import Genre from "./Genre";
import { useSnackbar } from 'notistack';
import UploadModal from "./UploadModal";


//Item styling for cards
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const LandingPage = () => {

    const allGenre = [
      {label: "All", value:"All"},
      {label: "Education", value:"Education"},
      {label: "Sports", value: "Sports"},
      {label: "Comedy", value: "Comedy"},
      {label: "Lifestyle", value: "Lifestyle"}
    ];

    const ageList = [
      {label: "Any Age Group", value:null},
      {label: "7+", value:"7"},
      {label: "12+", value: "12"},
      {label: "16+", value: "16"},
      {label: "18+", value: "18"}
    ];

    let params = "";

    const { enqueueSnackbar } = useSnackbar();

    const [dataArray, setDataArray] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(0);
    const [loading,setLoading] = useState(false);

    const [searchKey, setSearchKey] = useState('');
    const [selectedGenres,setSelectedGenres] = useState(["All"]);
    const [age,setAge] = useState(null);
    const [sort,setSort] = useState("releaseDate");

    const debounceSearch = (event, debounceTimeout) => {
        if (debounceTimeout !== 0) {
          clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(async () => {
          setSearchKey(event.target.value);
          const getVideos = await performApiCall();
          setDataArray(getVideos);
        }, 500);
        setDebounceTimeout(timeout);
    };

    const getParams = async() =>{

      if(!selectedGenres.includes('All') && !age && sort==="releaseDate"){
        // this is by default case
        const newarr = selectedGenres.join(",");
        params = "?genres=" + newarr;
      }
      if(selectedGenres.includes('All') && age && sort==='releaseDate'){
        params = "?contentRating="+age+'%2B';
      }
      if(selectedGenres.includes('All') && !age && sort!=='releaseDate'){
        params = '?sortBy='+sort;
      }
      if(selectedGenres.includes('All') && age && sort!=='releaseDate'){
        params = `?contentRating=${age}%2B&sortBy=${sort}`;
      }
      if(!selectedGenres.includes('All') && age && sort==='releaseDate'){
        const newarr = selectedGenres.join(",");
        params = "?genres="+newarr+"&contentRating="+age+'%2B';
      }
      if(!selectedGenres.includes('All') && !age && sort!=='releaseDate'){
        const newarr = selectedGenres.join(",");
        params = "?genres="+newarr+'&sortBy='+sort;
      }
      if(!selectedGenres.includes('All') && age && sort!=='releaseDate'){
        const newarr = selectedGenres.join(",");
        params = "?genres="+newarr+"&sortBy="+sort+"&contentRating="+age+"%2B";
      }
  };

    const performApiCall = async () => {

        let url = config.endpoint + `/v1/videos`;

        if(searchKey !== '' && params !== ''){
          url = config.endpoint + `/v1/videos?title=${searchKey}&` + params;
        }
        else if(searchKey !== ''){
          url = config.endpoint + `/v1/videos?title=${searchKey}`;
        }
        else if(params !== ''){
          url = config.endpoint + `/v1/videos` + params;
        }
        
        try{
            setLoading(true);
            
            //console.log("url : ", url);
            const response = await axios.get(url);

            setLoading(false);

            // if(response.status === 400 || response.status === 404)
            //   return dataArray;

            console.log(response.data.videos);
            return response.data.videos;
        }catch(error){
            //console.log(error);
            if(error.response)
              enqueueSnackbar(error.response, { variant: "error"})
        }
    };

    const handleGenreChange = (genre) => {
        const all = "All";
        const newGenreValue = genre.value;
        let nextGenres = [];

        if(newGenreValue === all){
          setSelectedGenres([all]);
        }else{
          const selectedGenresWithoutAll = selectedGenres.filter((ele) => ele !== all);

          if(selectedGenresWithoutAll.includes(newGenreValue)){
            // that perticular genre is already present in selected genres list
            nextGenres = selectedGenresWithoutAll.filter((ele) => ele !== newGenreValue);
          }
          else{
            nextGenres = [...selectedGenresWithoutAll, newGenreValue];
          }

          if(nextGenres.length === 0){
            setSelectedGenres([all]);
          }else{
            setSelectedGenres(nextGenres);
          }
        }   
      };

    const handleAgeChange = (selectedAge) => {
        if(null===selectedAge){
          setAge(null);
         //apifiltercal()
        }else{
          setAge(selectedAge);
          //apifiltercall()
        }
    };

    const handleSortBy = (e) =>{
        setSort(e.target.value);
    };

    //console.log(params);

    useEffect(() => {
        const callApi = async () =>{
            getParams();

            const getVideos = await performApiCall();
            setDataArray(getVideos);
            
            //handleVideosArray(getVideos);
        };
        callApi();
    }, [selectedGenres, age, sort]);

    return (
        <div>
            {/* Header */}
            <Header>
                <TextField
                    className="search-desktop"
                    size="small"
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                          <Search color="primary" />
                        </InputAdornment>
                    ),
                    }}
                    placeholder="Search"
                    name="search"
                    onChange={(e) => {
                    debounceSearch(e, debounceTimeout);
                    }}
                />
                <UploadModal />
            </Header>
            <TextField
                    className="search-mobile"
                    // size="large"
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                          <Search color="primary" />
                        </InputAdornment>
                    ),
                    }}
                    placeholder="Search"
                    name="search"
                    onChange={(e) => {
                    debounceSearch(e, debounceTimeout);
                    }}
                />
            {/* Genre Panel */}
            <Genre 
              allGenre={allGenre}
              ageList={ageList}
              selectedGenres={selectedGenres}
              age={age}
              sort={sort}
              handleGenreChange={handleGenreChange}
              handleAgeChange={handleAgeChange}
              handleSortBy={handleSortBy}
              />
            {/* Dashboard */}
            {loading ? <Loading /> :
                <Grid container className="dashboard" spacing={2}>
                    {dataArray.map((data)=>{
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
            }
        </div>
    );
}

export default LandingPage;