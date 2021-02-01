// getting current location and wetger data
var apiKey = "62e7bfc62ab8697f79172e21d054e9b8"; // api key
var lat;
var long;
const preLoader = document.querySelector('.pre-loader');

navigator.geolocation.getCurrentPosition( (postion)=>{
    //getting latitude and lo/gitude
    lat = postion.coords.latitude;
    long = postion.coords.longitude;

    //fethcing weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)
    .then( res=>{
        res.json()
        .then(data=>{
            // console.log(data)
            const temp = data.main.temp;
            const city = data.name;
            const dsc = data.weather[0].main;
            const wind = data.wind.speed;

            document.querySelector('header h1 span').textContent = city;
            document.querySelector('header h2 .temp').textContent = Math.round(temp - 273);
            document.querySelector('header .right .wether-info .dsc').textContent = dsc;
            document.querySelector('header .right .wether-info .wind').textContent = `${wind} km/h`;

        })
        .catch( err=>console.log(err) )
    } )  
    .catch( err=>console.log(err) )

} )


// set date and greeting in the app as the user's system
const months = ['January','February','March','April','May','June','July','August','Sepetember','October','November','December']
const dateSpan = document.querySelector('.city-info .date');
var msg = "Hello !!";
const date = new Date;
const hour  = date.getHours();

if( hour >= 0 && hour < 6   ){
    msg = "Monring, shin shine !"
}else if( hour >=6  && hour < 12){
    msg = "Good Morning "
}else if( hour >=12 && hour < 16){
    msg = "Good After Noon"
}else if(hour >=16 && hour <= 20){
    msg = "Good Evening"
}else{
    msg = "Good Evening";
}
document.querySelector('.greetings').textContent = msg;

dateSpan.textContent = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;


// set time in the app as the user's system
function setTime(){

    const timeSpan = document.querySelector('.city-info .time');  
    const date = new Date;

    timeSpan.textContent = date.toLocaleTimeString();

    setTimeout( ()=>{
        setTime()
    },1000 )
}
setTime()


//get top articles
var posts;
var index = 0;

function getArticles(code){
    preLoader.style.display = 'block';
    fetch(`https://newsapi.org/v2/top-headlines?country=${code}&apiKey=fc51056197c84d8f9bef2c6add05d224`)
    .then( res=>{

        res.json()
        .then(data=>{
            preLoader.style.display = 'none';
            posts = data.articles;
            console.log(posts);
            putArticles(index);
        })
        .catch( err=>console.log(err) )

    } )
    .catch( err=>console.log(err) )

}
getArticles("us");


function putArticles(indx){
    console.log(indx)
    //disbale next buttun on reaching last article
    if(indx >= 20){
        document.querySelector('#nextPost').setAttribute('disabled','');
        index = 19;
        return;
    }else{
        document.querySelector('#nextPost').removeAttribute('disabled');
    }

    //disbale prev buttun on first article
    if(indx <= -1 ){
        document.querySelector('#prevPost').setAttribute('disabled','');
        index = 0;
        return;
    }else{
        document.querySelector('#prevPost').removeAttribute('disabled');
    }

    const post = posts[indx];
    
    if(post.urlToImage){

        //add loading image
        document.querySelector('article img').src = 'images/load.svg';
        let img = document.createElement('img');
        img.src = post.urlToImage;
        img.onload = ()=>{
            document.querySelector('article img').src = post.urlToImage;
        }
        
    }else{
        document.querySelector('article img').src = 'images/default.png';
    }
    

    document.querySelector('article h2').innerHTML = post.title;
    document.querySelector('article p').innerHTML = post.description;
    document.querySelector('article em').textContent = post.author;
    document.querySelector('article a').href = post.url;
}


// next post
document.querySelector('#nextPost').onclick = ()=>{
    index++;
    putArticles(index);
}

document.querySelector('#prevPost').onclick = ()=>{
    index--;
    putArticles(index);
}


// get artilces by country name
const spans =  document.querySelectorAll('[data-code]');

spans.forEach( (span)=>{


    span.onclick = ()=>{

        //set backgrounf to black for selected country
        spans.forEach( (sp)=>{
            if(span == sp){
                sp.setAttribute('active','')
            }else{
                sp.removeAttribute('active');
            }
        } )

        let code = span.getAttribute('data-code');
        getArticles(code);
        index = 0;
    }

} )


// adding touch event

let start;
let end;

window.addEventListener('touchstart',(e)=>{
    // console.log(e);
    start = e.changedTouches[0].clientX;
})

window.addEventListener('touchend',(e)=>{
    // console.log(e);
    end = e.changedTouches[0].clientX;

    if( Math.abs(start - end) >= 20  ){

        if(start > end){
            //left swipe
            console.log('left swipe')
            index++;
             putArticles(index);
        }else{
            //right swipe
            console.log('right swipe')
            index--;
            putArticles(index);
        }
    }    
})







